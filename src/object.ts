import {isDefined} from "./lang";

export function isObject(o: any): boolean {
  return typeof o === "object";
}

export function deepClone<A>(o: A): A {
  if (!isObject(o)) {
    return o;
  }
  if (o instanceof Array) {
    return <A><any><any[]>o.map(deepClone);
  } else {
    const res = <A>{};
    Object.keys(o).forEach(x => res[x] = deepClone(o[x]));
    return res;
  }
}

export function replaceObject<A>(dest: A, src: A): A {
  Object.keys(dest).forEach(x => delete dest[x]);
  return Object.assign(dest, src);
}

const safeProxyHandler: ProxyHandler<any> = {
  has: (target, p) => isDefined(target[p])
  , get: (target, p, receiver) => {
    const res = target[p];
    return isDefined(res) ? res : createSafeObject();
  }
  , set: (target, p, value, receiver) => {
    target[p] = value;
    return true;
  }
  , ownKeys: target => Object.keys(target)
    .filter(p => isDefined(target[p]))
};

/**
 * make a loss object, very forgiving
 * */
export function createSafeObject() {
  return new Proxy({}, safeProxyHandler);
}

export const updateObject = dest => x => Object.assign(dest, x);
