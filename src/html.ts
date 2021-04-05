export let dateFormatter = (x: Date) => x.toString()

export function setDateFormatter(f: (x: Date) => string) {
  dateFormatter = f
}

export function resetDateFormatter() {
  dateFormatter = (x: Date) => x.toString()
}

export function setDateFormatLocale(lang: string, timezone: string) {
  dateFormatter = x => x.toLocaleString(lang, { timeZone: timezone })
}

export function resetDateFormatLocale() {
  dateFormatter = x => x.toLocaleString()
}

export function toString(o: any): string {
  switch (typeof o) {
    case 'string':
      return o
  }
  if (o instanceof Date) {
    return dateFormatter(o)
  }
  if (o instanceof Set) {
    return toString(Array.from(o as Set<any>))
  }
  return JSON.stringify(o, undefined, 2)
}

const escape_space = '&nbsp;'

export function displayJSON(o: any, mode: 'raw' | 'table' = 'table'): string {
  if (mode === 'raw') {
    return `<pre>${toString(o)}</pre>`
  }
  /* mode === 'table' */
  switch (typeof o) {
    case 'object':
      if (Array.isArray(o)) {
        return (
          '<ol>' +
          (o as any[])
            .map(x => '<li>' + displayJSON(x, mode) + '</li>')
            .join('') +
          '</ol>'
        )
      }
      if (o instanceof Set) {
        o = Array.from(o)
        return (
          '<ul>' +
          (o as any[])
            .map(x => '<li>' + displayJSON(x, mode) + '</li>')
            .join('') +
          '</ul>'
        )
      }
      if (o instanceof Date) {
        return toString(o)
      }
      if (o === null) {
        return 'null'
      }
      break
    case 'string': {
      const s = o as string
      return s
        .split('\r')
        .join('')
        .split('\n')
        .join('<br>')
        .split('  ')
        .join(escape_space.repeat(2))
        .split('\t')
        .join(escape_space.repeat(4))
    }
    case 'number':
      return o.toString()
    default:
      return `<pre>${JSON.stringify(o)}</pre>`
  }
  /* being object */
  const rows = Object.keys(o)
    .map(k => {
      const v = o[k]
      return `<tr><td>${displayJSON(k, mode)}</td><td>${displayJSON(
        v,
        mode,
      )}</td></tr>`
    })
    .join('')
  return `<table><tbody>${rows}</tbody></table>`
}

function mkHtmlText(tagName: string, content: string) {
  return `<${tagName}>${content}</${tagName}>`
}

export function csv_to_table_html(rows: string[][]): string {
  const thead = mkHtmlText(
    'thead',
    mkHtmlText('tr', rows[0].map(col => mkHtmlText('th', col)).join('')),
  )
  const tbody = mkHtmlText(
    'tbody',
    rows
      .slice(1)
      .map(cols =>
        mkHtmlText('tr', cols.map(col => mkHtmlText('td', col)).join('')),
      )
      .join(''),
  )
  return mkHtmlText('table', thead + tbody)
}
