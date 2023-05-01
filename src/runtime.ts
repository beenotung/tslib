export function getWindow(): Window {
  if (typeof window === 'undefined') {
    throw new Error('Not running in Window runtime')
  }
  return window
}

export function getGlobal(): typeof globalThis {
  if (typeof global === 'undefined') {
    throw new Error('Not running in NodeJS runtime')
  }
  return global
}

export function getWindowOrGlobal(): Window | typeof globalThis {
  if (typeof global !== 'undefined') {
    return global
  }
  if (typeof window !== 'undefined') {
    return window
  }
  throw new Error('unknown runtime')
}
