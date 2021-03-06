import { mapArray } from './array'

let f_name: string

/* tslint:disable:ban-types */
/**
 * @description may not work after being minify due to scoped name collision
 * */
export function wrapFunction<F extends Function>(
  _host_function_: F,
  n = _host_function_.length,
  name = _host_function_.name,
): F {
  /* tslint:enable:ban-types */
  const args = mapArray(new Array(n), (x, i) => 'a' + i).join(',')
  /* tslint:disable */
  let newF: F = undefined as any
  eval(
    `newF=function ${name}(${args}){return ${f_name}.apply(null,arguments);}`,
  )
  return newF as any
  /* tslint:enable */
}

f_name = wrapFunction
  .toString()
  .split('(')[1]
  .split(',')[0]

/* tslint:disable:ban-types */
/**
 * @description safe under minify, but occur more call stack size
 * */
export function safeWrapFunction<F extends Function>(
  _host_function_: F,
  n = _host_function_.length,
  name = _host_function_.name,
): F {
  /* tslint:enable:ban-types */
  const args = mapArray(new Array(n), (x, i) => 'a' + i).join(',')
  /* tslint:disable */
  return eval(`(function() {
    return function(f) {
      return function ${name}(${args}) {
        return f.apply(null, arguments);
      };
    };
  })()`)(_host_function_)
  /* tslint:enable */
}
