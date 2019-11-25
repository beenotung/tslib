const noop = () => {
  return noop;
};

// e.g. to mute cli-progress (progress bar)
export function muteObject(target: object) {
  let prototype = target;
  while (prototype !== null) {
    for (const name of Object.getOwnPropertyNames(prototype)) {
      const value = (target as any)[name];
      if (typeof value === 'function') {
        (target as any)[name] = noop;
      }
    }
    prototype = Object.getPrototypeOf(prototype);
  }
}
