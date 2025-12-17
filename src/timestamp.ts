/**
 * return in below formats:
 *
 * | Resolution | Format |
 * |-----------:|:-------|
 * | date       | YYYY-MM-DD |
 * | minute     | YYYY-MM-DD HH:MM |
 * | second     | YYYY-MM-DD HH:MM:SS |
 * | millisecond| YYYY-MM-DD HH:MM:SS.sss |
 */
export function getTimestamp(time: Date | number = Date.now()): string {
  const resolution = getTimestamp.resolution
  const date = new Date(time)
  const year = date.getFullYear()
  const month = d2(date.getMonth() + 1)
  const day = d2(date.getDate())
  if (resolution === 'date') {
    return `${year}-${month}-${day}`
  }
  const hour = d2(date.getHours())
  const minute = d2(date.getMinutes())
  if (resolution === 'minute') {
    return `${year}-${month}-${day} ${hour}:${minute}`
  }
  const second = d2(date.getSeconds())
  if (resolution === 'second') {
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }
  const millisecond = d3(date.getMilliseconds())
  return `${year}-${month}-${day} ${hour}:${minute}:${second}.${millisecond}`
}

export namespace getTimestamp {
  export type Resolution = 'date' | 'minute' | 'second' | 'millisecond'
  // eslint-disable-next-line prefer-const
  export let resolution: Resolution = 'second'
}

export function d2(n: number): string {
  if (n < 10) {
    return '0' + n
  }
  return n.toString()
}

export function d3(n: number): string {
  if (n < 10) {
    return '00' + n
  }
  if (n < 100) {
    return '0' + n
  }
  return n.toString()
}
