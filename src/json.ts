import { map_set } from './iterative/map';
import { getObjectType } from './type';

export type JsonPrimitive = string | number | null | boolean;

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface JsonArray {
  readonly length: number;

  [key: number]: JsonValue;
}

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export function jsonToString(o: any, visited = new Set()): string {
  const type = getObjectType(o);
  switch (type) {
    case 'String':
    case 'Number':
    case 'Null':
    case 'Undefined':
    case 'Boolean':
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
        return (
          '[' + (o as any[]).map(x => jsonToString(x, visited)).join(',') + ']'
        );
      } else {
        /* is object */
        return (
          '{' +
          Object.keys(o)
            .sort()
            .map(x => JSON.stringify(x) + ':' + jsonToString(o[x]))
            .join(',') +
          '}'
        );
      }
    }
    default:
      console.error('unsupported data type:', type);
      throw new TypeError('unsupported data type');
  }
}

// tslint:disable:prefer-for-of
interface JsonValues {
  values: any[];
  arrays: number[];
}

/**
 * support cyclic reference in json;
 * also support array with non-positive integer key, e.g. xs[-1.1]
 * */
export function jsonToValues(value: any): JsonValues {
  const value_id_map = new Map<any, number>();
  const values: any[] = [];
  const arrays: number[] = [];
  let n = 0;
  const encode = (value: any): number => {
    let id = value_id_map.get(value);
    if (typeof id === 'number') {
      return id;
    }
    id = n++;
    value_id_map.set(value, id);
    if (value === null || typeof value !== 'object') {
      values[id] = value;
      return id;
    }
    // const ids: any = Array.isArray(value) ? [] : {};
    const ids: any = {};
    if (Array.isArray(value)) {
      arrays.push(id);
    }
    const keys = Object.keys(value);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      ids[key] = encode(value[key]);
    }
    values[id] = ids;
    return id;
  };
  encode(value);
  return {
    values,
    arrays,
  };
}

export function valuesToJson(jsonValues: JsonValues): any {
  const { values, arrays } = jsonValues;
  const id_value_map = new Map<number, any>();
  const decode = (id: number): any => {
    if (id_value_map.has(id)) {
      return id_value_map.get(id);
    }
    const ids = values[id];
    if (ids === null || typeof ids !== 'object') {
      return ids;
    }
    // const value: any = Array.isArray(ids) ? [] : {};
    const value: any = arrays.includes(id) ? [] : {};
    id_value_map.set(id, value);
    const keys = Object.keys(ids);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      value[key] = decode(ids[key]);
    }
    return value;
  };
  return decode(0);
}

// tslint:enable:prefer-for-of

export function jsonToValuesString(value: any): string {
  return jsonToString(jsonToValues(value));
}

export function valuesStringToJson(json: string): any {
  return valuesToJson(JSON.parse(json));
}
