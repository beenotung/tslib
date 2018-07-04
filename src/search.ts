export namespace search {
  export function str_contains (base: string, query: string, caseInsensitive = true) {
    if (caseInsensitive) {
      return base.toLocaleLowerCase().indexOf(query.toLocaleLowerCase()) !== -1;
    } else {
      return base.indexOf(query) !== -1;
    }
  }

  export function object_contains (base, query: string, caseInsensitive = true) {
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
        if (v.some((base) => object_contains(base, query, caseInsensitive))) {
          return true;
        }
      }
    }
    return false;
  }
}
