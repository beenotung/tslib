function wrapFunction_defineProperty<F extends Function>(
  fn: F,
  length = fn.length,
  name = fn.name,
): F {
  const f = function() {
    return fn.apply(null, arguments)
  }
  Object.defineProperty(f, 'name', { value: name })
  Object.defineProperty(f, 'length', { value: length })
  return f as any
}

function wrapFunction_newFunction_eval<F extends Function>(
  fn: F,
  length = fn.length,
  name = fn.name,
): F {
  const args = new Array(length).fill(0)
.map((_, i) => 'a' + (i + 1))
  const wrapper = eval(`(function wrapper(fn) {
    return function ${name}(${args}) {
      return fn.apply(null, arguments)
    }
  })`)
  return wrapper(fn)
}

// for testing only
export default {
  wrapFunction_defineProperty,
  wrapFunction_newFunction_eval,
}

export const wrapFunction =
  'defineProperty' in Object && typeof Object.defineProperty === 'function'
    ? wrapFunction_defineProperty
    : wrapFunction_newFunction_eval
