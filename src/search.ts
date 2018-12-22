import { getObjectType } from './type';

export namespace search {
  export function str_contains(
    base: string,
    query: string,
    caseInsensitive = true,
  ) {
    if (caseInsensitive) {
      return base.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) !== -1;
    } else {
      return base.indexOf(query) !== -1;
    }
  }

  export function object_contain_str(
    base,
    query: string,
    caseInsensitive = true,
  ) {
    if (typeof base === 'string') {
      return str_contains(base, query, caseInsensitive);
    }
    // for (const k in base) {
    for (const k of Object.keys(base)) {
      const v = base[k];
      if (typeof v === 'string' && typeof query === 'string') {
        if (str_contains(v, query, caseInsensitive)) {
          return true;
        }
      } else if (v === query) {
        return true;
      } else if (Array.isArray(v)) {
        if (v.some(base => object_contain_str(base, query, caseInsensitive))) {
          return true;
        }
      }
    }
    return false;
  }

  /**@deprecated*/
  export let object_contains = object_contain_str;

  export function partialMatch<T>(query: Partial<T>, target: T): boolean {
    const queryType = getObjectType(query);
    const targetType = getObjectType(target);
    if (queryType !== targetType) {
      return false;
    }
    switch (queryType) {
      case 'AsyncFunction':
      case 'Function':
        throw new Error('unsupported partial match on type: ' + queryType);
      case 'Number':
      case 'Null':
      case 'Undefined':
      case 'String':
        return query === target;
      case 'Array':
        return ((target as any) as any[]).some(
          t => ((query as any) as any[]).indexOf(t) !== -1,
        );
      case 'Set':
        return partialMatch(
          Array.from((query as any) as Set<any>),
          Array.from((target as any) as Set<any>),
        );
      case 'Map': {
        let matched = false;
        const targetMap = (target as any) as Map<any, any>;
        ((query as any) as Map<any, any>).forEach((v, k) => {
          matched = matched || partialMatch(v, targetMap.get(k));
        });
        return matched;
      }
      case 'Object':
        return Object.keys(query).some(key =>
          partialMatch(query[key], target[key]),
        );
    }
  }
}
