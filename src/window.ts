export function setWindowProp<A>(key: string, value: A): A {
  window[key as any] = value as any
  return value
}

export function getWindowProp(key: string): any {
  return window[key as any]
}
