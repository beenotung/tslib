import { map_any, map_set } from './iterative/map';
import { isDefined } from './lang';
import { getObjectType } from './type';

export function isObject(o: any): boolean {
  return typeof o === 'object';
}

export function hasFunction(o: object | any[], name: PropertyKey): boolean {
  return typeof o[name] === 'function';
}

export function deepClone<A>(o: A): A {
  if (!isObject(o)) {
    return o;
  }
  if (o instanceof Array) {
    return ((o.map(deepClone) as any[]) as any) as A;
  } else {
    const res = {} as A;
    Object.keys(o).forEach(x => (res[x] = deepClone(o[x])));
    return res;
  }
}

export function replaceObject<A>(dest: A, src: A): A {
  Object.keys(dest).forEach(x => delete dest[x]);
  return Object.assign(dest, src);
}

const safeProxyHandler: ProxyHandler<any> = {
  has: (target, p) => isDefined(target[p]),
  get: (target, p, receiver) => {
    const res = target[p];
    return isDefined(res) ? res : createSafeObject();
  },
  set: (target, p, value, receiver) => {
    target[p] = value;
    return true;
  },
  ownKeys: target => Object.keys(target).filter(p => isDefined(target[p])),
};

/**
 * make a loss object, very forgiving
 * */
export function createSafeObject() {
  return new Proxy({}, safeProxyHandler);
}

export const updateObject = dest => x => Object.assign(dest, x);

export const isNull = (x): boolean =>
  !(x === null || x === undefined || x === '');

export function removeNull(o) {
  if (Array.isArray(o)) {
    return o
      .filter(x => !(x === null || x === undefined || x === ''))
      .map(x => removeNull(x));
  }
  if (o instanceof Set) {
    return new Set(removeNull(Array.from(o)));
  }
  if (o instanceof Date) {
    return o;
  }
  if (typeof o === 'object' && o !== null) {
    o = Object.assign({}, o);
    for (const k of Object.keys(o)) {
      const v = o[k];
      if (v === null || v === undefined || v === '') {
        delete o[k];
      }
    }
  }
  return o;
}

/**
 * @param {any}       o           : value to be checked
 * @param {boolean}   skip        : true will remove duplicated value silently;
 *                                  false will throw an error upon duplication
 * @param {any}       placeholder : custom value to replace duplicated object
 * @param {function}  mapper      : optional map function
 * @param {Set}       visited     : internal book keeping seen objects
 * */
export function ensureNonCyclic<A>(
  o: A,
  skip = true,
  placeholder: any = void 0,
  mapper?: (a: any) => any,
  visited = new Set(),
): A {
  switch (getObjectType(o)) {
    case 'Number':
    case 'String':
    case 'Null':
    case 'Undefined':
    case 'Function':
    case 'AsyncFunction':
      /* these types can be duplicated */
      return mapper ? mapper(o) : o;
    default:
      /* array, set, map, object */
      if (visited.has(o)) {
        /* duplicated object */
        if (skip) {
          return placeholder;
        }
        throw new Error('circular structure, duplicated value: ' + o);
      }
      /* non-duplicated object */
      /* clone the set, to allow sibling duplication */
      visited = map_set(visited, x => x);
      visited.add(o);
      return map_any(o, x =>
        ensureNonCyclic(x, skip, placeholder, mapper, visited),
      );
  }
}
