/**
 * opposite of Pick
 *
 * From T, pick a set of properties whose keys are not in the union K
 * */
export type Drop<T, K extends keyof T> = { [P in Exclude<keyof T, K>]: T[P] }

export type BooleanString = 'true' | 'false'

export type ObjectType =
  | 'Object'
  | 'Array'
  | 'Map'
  | 'Set'
  | 'Number'
  | 'Boolean'
  | 'String'
  | 'Null'
  | 'Undefined'
  | 'Function'
  | 'AsyncFunction'
  | 'Date'
  | 'process'
  | 'Uint8Array'

export function getObjectType(o: any): ObjectType {
  const type = Object.prototype.toString.call(o)
  const match = type.match(/^\[object (.*)]$/)
  if (match) {
    const res = match[1]
    if (res) {
      return res as any
    }
  }
  return type.replace(/^\[/, '').replace(/]$/, '') as any
}
