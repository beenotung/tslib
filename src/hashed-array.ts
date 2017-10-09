import {isDefined} from "./lang";
import {clear} from "./array";

export class HashedArray<A> {
  mapper: (a: A) => PropertyKey;
  array: A[];
  o: { [key: string]: A };

  constructor(mapper: (a: A) => PropertyKey = x => x as any, array: A[] = [], o?: { [key: string]: A }) {
    this.array = array;
    this.mapper = mapper;
    if (isDefined(o)) {
      this.o = o;
    } else {
      o = {};
      array.forEach(x => o[mapper(x)] = x);
      this.o = o;
    }
  }

  insert(x: A, key: PropertyKey = this.mapper(x)) {
    this.array.push(x);
    this.o[key] = x;
    return this;
  }

  replace(x: A, key: PropertyKey = this.mapper(x)) {
    const idx = this.array.findIndex(y => y === x);
    if (idx !== -1) {
      this.o[key] = this.array[idx] = x;
    }
    return this;
  }

  update(x: A, key: PropertyKey = this.mapper(x)) {
    Object.assign(this.o[key], x);
    return this;
  }

  /**
   * insert or replace
   * */
  upsert(x: A, key: PropertyKey = this.mapper(x)) {
    const y = this.o[key];
    if (isDefined(y)) {
      Object.assign(y, x);
      return this;
    } else {
      return this.insert(x, key);
    }
  }

  isEmpty(isValid: (x: A) => boolean): boolean {
    return this.array.length == 0
      || this.array.every(x => !isValid(x))
      ;
  }

  clear() {
    this.o = {};
    return clear(this.array);
  }

  get(key: PropertyKey): A | undefined {
    return this.o[key];
  }

  has(key: PropertyKey): boolean {
    return isDefined(this.get(key));
  }

  set(key: PropertyKey, x: A) {
    return this.update(x, key);
  }
}
