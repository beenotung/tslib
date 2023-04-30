import { compare, CompareResult } from './compare'
import { setMinus } from './set'

export function str_contains(
  pattern: string,
  target: string,
  ignore_case = false,
): boolean {
  if (ignore_case) {
    return str_contains(pattern.toLowerCase(), target.toLowerCase())
  }
  return target.indexOf(pattern) !== -1
}

export function str_contains_any(
  patterns: string[],
  target: string,
  ignore_case = false,
): boolean {
  return patterns.some(p => str_contains(p, target, ignore_case))
}

/**
 * example : 'change the words' ~> 'Change The Words'
 * */
export function strToCapWords(s: string): string {
  let res = ''
  let lastSpace = true
  for (const c of s) {
    if (c === ' ') {
      lastSpace = true
      res += ' '
    } else {
      if (lastSpace) {
        res += c.toUpperCase()
        lastSpace = false
      } else {
        res += c
      }
    }
  }
  return res
}

export function string_to_chars(s: string): string[] {
  return s.split('')
}

/* source: https://stackoverflow.com/questions/1144783/how-to-replace-all-occurrences-of-a-string-in-javascript */
export function escapeRegExp(str: string): string {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1')
}

/** @deprecated use String.replaceAll() instead (available since 2020) */
export function strReplaceAll(
  str: string,
  find: string,
  replace: string,
): string {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}

export function string_nbyte(s: string): number {
  return encodeURI(s).split(/%..|./).length - 1
}

export function str_like(a: string, b: string, ignore_case = true): boolean {
  if (ignore_case) {
    return str_like(a.toUpperCase(), b.toUpperCase(), false)
  } else {
    return a.includes(b) || b.includes(a)
  }
}

export function is_non_empty_string(s: string): boolean {
  return typeof s === 'string' && s !== ''
}

export function str_dos2unix(s: string): string {
  return strReplaceAll(s, '\r\n', '\n')
}

export function str_unix2dos(s: string): string {
  return strReplaceAll(s, '\n', '\r\n')
}

export function str_minus(a: string, b: string): string {
  return Array.from(setMinus(new Set(a), new Set(b))).join('')
}

function toNum(s: string, i: number): number | false {
  const code = s.charCodeAt(i)
  if (48 <= code && code <= 48 + 10) {
    return code - 48
  } else {
    return false
  }
}

export type compare_chunks = Array<string | number>

function parseString(s: string, i: number, res: compare_chunks): void {
  let acc = ''
  for (; i < s.length; i++) {
    const num = toNum(s, i)
    if (num === false) {
      acc += s[i]
    } else {
      if (acc.length > 0) {
        res.push(acc)
      }
      parseNumber(s, i + 1, num, res)
      return
    }
  }
  if (acc.length > 0) {
    res.push(acc)
  }
}

function parseNumber(
  s: string,
  i: number,
  acc: number,
  res: compare_chunks,
): void {
  for (; i < s.length; i++) {
    const num = toNum(s, i)
    if (num === false) {
      res.push(acc)
      parseString(s, i, res)
      return
    }
    acc = acc * 10 + num
  }
  res.push(acc)
}

export function split_string_num(s: string): compare_chunks {
  const acc: compare_chunks = []
  parseString(s, 0, acc)
  return acc
}

export function compare_string(a: string, b: string): CompareResult {
  const as = split_string_num(a)
  const bs = split_string_num(b)
  const n = Math.min(as.length, bs.length)
  for (let i = 0; i < n; i++) {
    const res = compare(as[i], bs[i])
    if (res !== 0) {
      return res
    }
  }
  return compare(as.length, bs.length)
}

export function extract_lines(s: string): string[] {
  return s
    .split('\n')
    .map(s => s.trim())
    .filter(s => s)
}

export function capitalize(word: string): string {
  return word[0].toLocaleUpperCase() + word.substring(1).toLocaleLowerCase()
}

// using perl naming conversion
export function lcfirst(word: string): string {
  return word[0].toLocaleLowerCase() + word.substring(1)
}

// using perl naming conversion
export function ucfirst(word: string): string {
  return word[0].toLocaleUpperCase() + word.substring(1)
}
