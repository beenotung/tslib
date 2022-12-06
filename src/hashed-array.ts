import { clearArray, removeBy } from './array'
import { isDefined } from './lang'

/**
 * <A> must be object.
 * For string, number e.t.c use Set instead
 * */
export class HashedArray<A extends object> {
  public mapper: (a: A) => PropertyKey
  public array: A[]
  public o: { [key: string]: A }

  constructor(
    mapper: (a: A) => PropertyKey = x => x as any,
    array: A[] = [],
    o?: { [key: string]: A },
  ) {
    this.array = array
    this.mapper = mapper
    if (o) {
      this.o = o
    } else {
      const o: any = {}
      array.forEach(x => (o[mapper(x) as string] = x))
      this.o = o
    }
  }

  public insert(x: A, key: PropertyKey = this.mapper(x)) {
    this.array.push(x)
    this.o[key as string] = x
    return this
  }

  public replace(x: A, key: PropertyKey = this.mapper(x)) {
    const idx = this.array.findIndex(y => y === x)
    if (idx !== -1) {
      this.o[key as string] = this.array[idx] = x
    }
    return this
  }

  public update(x: A, key: PropertyKey = this.mapper(x)) {
    Object.assign(this.o[key as string], x)
    return this
  }

  /**
   * insert or replace
   * */
  public upsert(x: A, key: PropertyKey = this.mapper(x)) {
    const y = this.o[key as string]
    if (isDefined(y)) {
      Object.assign(y, x)
      return this
    } else {
      return this.insert(x, key)
    }
  }

  public remove(x: A) {
    return this.removeByKey(this.mapper(x))
  }

  public removeByKey(key: PropertyKey) {
    removeBy(this.array, x => this.mapper(x) === key)
    delete this.o[key as string]
    return this
  }

  public isEmpty(isValid: (x: A) => boolean): boolean {
    return this.array.length === 0 || this.array.every(x => !isValid(x))
  }

  public clear() {
    this.o = {}
    return clearArray(this.array)
  }

  public get(key: PropertyKey): A | undefined {
    return this.o[key as string]
  }

  public has(key: PropertyKey): boolean {
    return isDefined(this.get(key))
  }

  public set(key: PropertyKey, x: A) {
    return this.update(x, key)
  }

  public static from<A extends object>(xs: A[]): HashedArray<A> {
    const res = new HashedArray<A>()
    xs.forEach(x => res.insert(x))
    return res
  }
}
