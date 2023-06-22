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
