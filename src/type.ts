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
  | 'String'
  | 'Null'
  | 'Undefined'
  | 'Function'
  | 'AsyncFunction';

export function getObjectType(o: any): ObjectType {
  return Object.prototype.toString
    .call(o)
    .replace('[object ', '')
    .replace(']', '');
}
