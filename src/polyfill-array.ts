/**
 * Created by beenotung on 5/18/17.
 * Updated by beenotung on 29/1/19.
 * Date format: d/m/y
 */
if (!Array.isArray) {
  Array.isArray = function isArray(arg: any): arg is any[] {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

// tslint:disable
export interface PolyfillArray<T> extends Array<T> {
  /** extended methods */
  peek(callbackfn: (value: number, index: number, array: this) => void, thisArg?: any): this;

  /** from es5 */
  concat(...items: ConcatArray<T>[]): PolyfillArray<T>;

  concat(...items: (T | ConcatArray<T>)[]): PolyfillArray<T>;

  reverse(): PolyfillArray<T>;

  slice(start?: number, end?: number): PolyfillArray<T>;

  splice(start: number, deleteCount?: number): PolyfillArray<T>;

  splice(start: number, deleteCount: number, ...items: T[]): PolyfillArray<T>;

  every(callbackfn: (value: T, index: number, array: PolyfillArray<T>) => unknown, thisArg?: any): boolean;

  some(callbackfn: (value: T, index: number, array: PolyfillArray<T>) => unknown, thisArg?: any): boolean;

  forEach(callbackfn: (value: T, index: number, array: PolyfillArray<T>) => void, thisArg?: any): void;

  map<U>(callbackfn: (value: T, index: number, array: PolyfillArray<T>) => U, thisArg?: any): PolyfillArray<U>;

  filter<S extends T>(callbackfn: (value: T, index: number, array: T[]) => value is S, thisArg?: any): PolyfillArray<S>;

  filter(callbackfn: (value: T, index: number, array: T[]) => unknown, thisArg?: any): PolyfillArray<T>;

  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: PolyfillArray<T>) => T): T;

  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: PolyfillArray<T>) => T, initialValue: T): T;

  reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: PolyfillArray<T>) => U, initialValue: U): U;

  reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: PolyfillArray<T>) => T): T;

  reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: PolyfillArray<T>) => T, initialValue: T): T;

  reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: PolyfillArray<T>) => U, initialValue: U): U;

  /** from es2005.core */
  fill(value: T, start?: number, end?: number): this;

  copyWithin(target: number, start: number, end?: number): this;
}

export interface PolyfillArrayConstructor extends ArrayConstructor {
  /** extended methods */
  /** @deprecated use from() or of() directly */
  fromArray<A>(xs: A[]): PolyfillArray<A>

  /** from es5 */
  new(arrayLength?: number): PolyfillArray<any>;

  new<T>(arrayLength: number): PolyfillArray<T>;

  new<T>(...items: T[]): PolyfillArray<T>;

  (arrayLength?: number): PolyfillArray<any>;

  <T>(arrayLength: number): PolyfillArray<T>

  <T>(...items: T[]): PolyfillArray<T>

  /** from es2015.core */
  from<T>(arrayLike: ArrayLike<T>): PolyfillArray<T>;

  from<T, U>(arrayLike: ArrayLike<T>, mapfn: (v: T, k: number) => U, thisArg?: any): PolyfillArray<U>;

  of<T>(...items: T[]): PolyfillArray<T>;
}
// tslint:enable

const prototype = Object.assign({
  peek: function peek(callbackfn: (value: number, index: number, array: PolyfillArray<any>) => void, thisArg?: any): PolyfillArray<any> {
    // tslint:disable-next-line:no-invalid-this
    const self: PolyfillArray<any> = thisArg || this;
    self.forEach((value, index, array) => {
      callbackfn(value, index, array as PolyfillArray<any>);
    }, self);
    return self;
  },
}, Array.prototype);
export let PolyfillArray: PolyfillArrayConstructor = Array as any;
PolyfillArray.fromArray = PolyfillArray.from;
Object.assign(PolyfillArray.prototype, prototype);
