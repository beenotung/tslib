/**
 * Created by beenotung on 4/23/17.
 */

export function fromLocaleString(str: string): number {
  const num = +str.replaceAll(',', '')
  if (num.toLocaleString() === str) {
    return num
  }
  throw new Error('failed to parse locale string into number')
}

export function countFractionDigits(num: number): number {
  let str = num.toString()
  if (str.includes('e')) {
    str = str.split('e')[0]
  }
  const dotIndex = str.indexOf('.')
  if (dotIndex === -1) {
    return 0
  }
  return str.length - dotIndex - 1
}
