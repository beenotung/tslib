import {wrapFunction} from "./reflection";
import {MapMap} from "./map-map";

/* tslint:disable:ban-types */
/**
 * @description support any arguments length, any data type arguments
 * @description do not works for self-recursive functions
 * */
export function memorize<F extends Function>(f: F): F {
  /* tslint:enable:ban-types */
  /* length => ...args */
  const cache = new MapMap<number, MapMap<any, any>>();
  return wrapFunction<F>(function () {
    let map = cache.getMap(arguments.length);
    for (let i = arguments.length - 1; i > 0; i--) {
      map = map.getMap(arguments[i]);
    }
    const last = arguments[0];
    if (map.has(last)) {
      return map.get(last);
    }
    const res = f.apply(null, arguments);
    map.set(last, res);
    return res;
  } as any, f.length, f.name);
}

export class MemorizePool<A> {
  cache = new MapMap<number, MapMap<any, any>>();

  /**
   * @return [has_or_not, result]
   * */
  get(args: IArguments): undefined | [A] {
    const map = this.getLastMap(args);
    const last = args[0];
    if (map.has(last)) {
      return [map.get(last)as any];
    } else {
      return undefined;
    }
  }

  set(args: IArguments, res) {
    this.getLastMap(args).set(args[0], res);
  }

  getOrCalc(args: IArguments, f: () => A) {
    const map = this.getLastMap(args);
    const last = args[0];
    if (map.has(last)) {
      return map.get(last);
    }
    const res = f();
    map.set(last, res);
    return res;
  }

  private getLastMap(args: IArguments): MapMap<any, A> {
    let map = this.cache.getMap(args.length);
    for (let i = args.length - 1; i > 0; i--) {
      map = map.getMap(args[i]);
    }
    return map;
  }
}
