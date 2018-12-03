/**
 * @description this module is for better performance by reducing the need to invoke string.substring() and array.slice()
 * */

export interface ArrayString {
  s: string;
  offset: number;
  length: number;
}

export const wrapString = (s: string): ArrayString => ({
  s,
  offset: 0,
  length: s.length,
});

export interface ArrayData<A> {
  s: string | A[];
  offset: number;
  length: number;
}

export const wrapArray = <A>(s: string | A[]): ArrayData<A> => ({
  s,
  offset: 0,
  length: s.length,
});

export const pop = <A>(x: ArrayData<A>): ArrayData<A> => ({
  s: x.s,
  offset: x.offset,
  length: x.length - 1 < 0 ? 0 : x.length - 1,
});

export const wrappedLast = <A>(x: ArrayData<A>): A =>
  x.s[x.offset + x.length - 1] as A;
