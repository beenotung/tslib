/**
 * Created by beenotung on 6/16/17.
 */
export type BooleanString = 'true' | 'false';

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
  | 'Uint8Array';

export function getObjectType(o: any): ObjectType {
  return Object.prototype.toString.call(o).match(/^\[object (.*)]$/)[1];
}
