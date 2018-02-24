function noop() {
}

export function clearAllTimer() {
  let i = setInterval(noop);
  for (; i > 0; i--) {
    clearTimeout(i);
    clearInterval(i);
  }
}
