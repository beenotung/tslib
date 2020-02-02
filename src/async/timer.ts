function noop() {
  // placeholder, do not do anything
}

export function clearAllTimer() {
  let i = setInterval(noop);
  for (; i > 0; i--) {
    clearTimeout(i);
    clearInterval(i);
  }
}
