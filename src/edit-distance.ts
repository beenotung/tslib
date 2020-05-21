import {
  ArrayData,
  pop as _pop,
  wrapArray as _wrapArray,
  wrappedLast as _last,
} from './array-wrapper'
import { memorize } from './memorize'

// const last = memorize(_last);
const last = _last
const pop = memorize(_pop)
const wrapArray = memorize(_wrapArray)

/**
 * @description this can consume lot of memory, need to manually invoke edit_distance.clear() to free the caches
 * */
export const edit_distance = memorize(
  <A>(
    s: ArrayData<A> | A[] | string,
    t: ArrayData<A> | A[] | string,
    loop?: boolean,
  ): number => {
    if (s.length === 0) {
      return t.length
    }
    if (t.length === 0) {
      return s.length
    }
    if (loop) {
      s = s as ArrayData<A>
      t = t as ArrayData<A>
    } else {
      s = typeof s === 'string' || Array.isArray(s) ? wrapArray(s) : s
      t = typeof t === 'string' || Array.isArray(t) ? wrapArray(t) : t
    }
    return Math.min(
      edit_distance(pop(s), pop(t), true) + (last(s) === last(t) ? 0 : 1),
      edit_distance(pop(s), t, true) + 1,
      edit_distance(s, pop(t), true) + 1,
    )
  },
)

const edit_distance_clear = edit_distance.clear.bind(edit_distance)
edit_distance.clear = () => {
  if (typeof (last as any).clear === 'function') {
    ; (last as any).clear()
  }
  pop.clear()
  wrapArray.clear()
  edit_distance_clear()
}
