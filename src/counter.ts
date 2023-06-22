export interface Counter {
  next(): number
}

export function new_counter(init = 0): Counter {
  return {
    next: () => ++init,
  }
}

export const Counter = new_counter(1)
