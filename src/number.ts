/**
 * Created by beenotung on 4/23/17.
 */
import { compare } from './compare'

export function fromLocaleString(str: string): number {
  let num = +str.replaceAll(',', '')
  if (num.toLocaleString() === str) {
    return num
  }
  throw new Error('failed to parse locale string into number')
}

/** @deprecated*/
export { CompareResult } from './compare'
/** @deprecated*/
export const compare_number = compare
