export function setWindowProp (key: string, value: any) {
  window[key] = value;
  return value;
}

export function getWindownProp (key: string) {
  return window[key];
}
