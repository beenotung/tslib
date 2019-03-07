import { getObjectType } from './type';
import { map_set } from './iterative/map';

export type JsonPrimitive = string | number | null;

export interface JsonObject {
  [key: string]: JsonValue
}

export interface JsonArray {
  readonly length: number

  [key: number]: JsonValue
}

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export function jsonToString(o, visited = new Set()): string {
  let type = getObjectType(o);
  switch (type) {
    case 'String':
    case 'Number':
    case 'Null':
    case 'Undefined':
      return JSON.stringify(o);
    case 'Array':
    case 'Object': {
      if (visited.has(o)) {
        throw new TypeError('circular structure, duplicated value: ' + o);
      }
      /* clone the set, to allow sibling duplication */
      visited = map_set(visited, x => x);
      visited.add(o);
      if (type === 'Array') {
        /* is array */
        return '[' + (o as any[]).map(x => jsonToString(x, visited)).join(',') + ']';
      } else {
        /* is object */
        return '{' + Object.keys(o).sort().map(x => JSON.stringify(x) + ':' + jsonToString(o[x])).join(',') + '}';
      }
    }
  }
}
