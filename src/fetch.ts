import { HttpError } from './error'

/**
 * check if the status code is 2xx
 * */
export function checkedFetch<T>({
  input,
  init,
  on2xx,
  non2xx,
}: {
  input: RequestInfo | URL
  init?: RequestInit
  on2xx: (response: Response) => T | Promise<T>
  non2xx: (response: Response) => T | Promise<T>
}): Promise<T> {
  return fetch(input, init).then(res => {
    if (200 <= res.status && res.status < 300) {
      return on2xx(res)
    }
    return non2xx(res)
  })
}

export function parseRetryAfter(retryAfter: string | null): number | null {
  if (!retryAfter) {
    return null
  }

  const seconds = +retryAfter
  if (seconds) {
    return seconds * 1000
  }

  const target = new Date(retryAfter).getTime()
  if (target) {
    return target - Date.now()
  }

  return null
}

export type FetchWithRetryOptions = {
  maxRetryCount?: number
  defaultRetryAfterInterval?: number
}

export const fetch_retry_status_codes = [
  // 429: Too Many Requests
  429,
  // 502: Bad Gateway
  502,
  // 503: Service Unavailable
  503,
  // 504: Gateway Timeout
  504,
  // 521: Web Server is Down (cloudflare)
  521,
  // 522: Connection Timed Out (cloudflare)
  522,
  // 523: Origin is unreachable (cloudflare)
  523,
  // 524: A Timeout Occurred (cloudflare)
  524,
]

export async function fetch_with_retry(
  input: RequestInfo | URL,
  init: RequestInit = {},
  options: FetchWithRetryOptions = {},
) {
  for (let retryCount = 0; ; retryCount++) {
    const res = await fetch(input, init)
    if (!fetch_retry_status_codes.includes(res.status)) {
      return res
    }
    const retryAfter =
      parseRetryAfter(res.headers.get('Retry-After')) ||
      options.defaultRetryAfterInterval
    if (
      !retryAfter ||
      (options.maxRetryCount && retryCount > options.maxRetryCount)
    ) {
      throw new HttpError(res.status, res.statusText || 'Too Many Requests')
    }
    await new Promise(resolve => setTimeout(resolve, retryAfter))
  }
}

export async function fetch_json(
  input: RequestInfo | URL,
  init: RequestInit = {},
  options?: FetchWithRetryOptions,
) {
  init.headers = new Headers(init.headers)
  if (!init.headers.has('Accept')) {
    init.headers.set('Accept', 'application/json')
  }
  const res: Response = await fetch_with_retry(input, init, options)
  const contentType = res.headers.get('Content-Type')?.split(';')[0]
  if (contentType?.includes('json')) {
    return res.json()
  }
  const text = await res.text()
  if (contentType?.includes('html')) {
    if (typeof DOMParser !== 'undefined') {
      const doc = new DOMParser().parseFromString(text, 'text/html')
      throw new HttpError(
        res.status,
        'expect json response, but got html, content: ' +
          preview_text(doc.body.innerText),
      )
    } else {
      const preview = preview_html(text)
      const type = preview.type
      throw new HttpError(
        res.status,
        `expect json response, but got ${type}: ` + preview_text(preview.text),
      )
    }
  }
  if (contentType) {
    throw new HttpError(
      res.status,
      `expect json response, but got ${contentType}: ` + preview_text(text),
    )
  } else {
    throw new HttpError(
      res.status,
      'expect json response, but got: ' + preview_text(text),
    )
  }
}

// fallback for nodejs
function preview_html(text: string) {
  let start = text.indexOf('<title')
  if (start >= 0) {
    start = text.indexOf('>', start) + 1
    const end = text.indexOf('</title>', start)
    if (end > start) {
      return { type: 'title', text: text.slice(start, end) }
    }
  }
  start = text.indexOf('<h1')
  if (start >= 0) {
    start = text.indexOf('>', start) + 1
    const end = text.indexOf('</h1>', start)
    if (end > start) {
      return { type: 'title', text: text.slice(start, end) }
    }
  }
  start = text.indexOf('<body')
  if (start >= 0) {
    start = text.indexOf('>', start) + 1
    const end = text.indexOf('</body>', start)
    if (end > start) {
      return { type: 'content', text: text.slice(start, end) }
    }
  }
  return { type: 'text', text }
}

function preview_text(text: string) {
  text = text.trim()
  if (!text) {
    return 'empty text'
  }
  const preview_length = 150
  if (text.length > preview_length) {
    return text.slice(0, preview_length) + '...'
  }
  return text
}
