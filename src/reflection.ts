import {mapArray} from "./array";

/* tslint:disable:ban-types */
export function wrapFunction(f: Function): Function {
  const args = mapArray(new Array(f.length), (x, i) => 'a' + i).join(',');
  let newF: Function;
  eval(`newF=function ${f.name}(${args}){return f.apply(null,arguments);}`);
  return newF;
}

/* tslint:enable:ban-types */
