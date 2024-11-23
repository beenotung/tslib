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

export async function fetch_json(input: RequestInfo | URL, init?: RequestInit) {
  let res = await fetch(input, init)
  let contentType = res.headers.get('content-type')?.split(';')[0]
  if (contentType?.includes('json')) {
    return res.json()
  }
  let text = await res.text()
  if (contentType?.includes('html')) {
    if (typeof DOMParser !== 'undefined') {
      let doc = new DOMParser().parseFromString(text, 'text/html')
      throw new HttpError(
        res.status,
        'expect json response, but got html, content: ' +
          preview_text(doc.body.innerText),
      )
    } else {
      let preview = preview_html(text)
      let type = preview.type
      text = preview_text(preview.text)
      throw new HttpError(
        res.status,
        `expect json response, but got ${type}: ${text}`,
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
    let end = text.indexOf('</title>', start)
    if (end > start) {
      return { type: 'title', text: text.slice(start, end) }
    }
  }
  start = text.indexOf('<h1')
  if (start >= 0) {
    start = text.indexOf('>', start) + 1
    let end = text.indexOf('</h1>', start)
    if (end > start) {
      return { type: 'title', text: text.slice(start, end) }
    }
  }
  start = text.indexOf('<body')
  if (start >= 0) {
    start = text.indexOf('>', start) + 1
    let end = text.indexOf('</body>', start)
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
  let preview_length = 150
  if (text.length > preview_length) {
    return text.slice(0, preview_length) + '...'
  }
  return text
}
