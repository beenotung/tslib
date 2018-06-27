import {MapMap} from "./map-map";
import {wrapFunction} from "./reflection";

/* tslint:disable:ban-types */
/**
 * @description support any arguments length, any data type arguments
 *   do not works for self-recursive functions
 *   unless it is wrapped when being constructed
 *
 *   Example that works:
 *
 *       const q = memorize((n: number) => n < 2 ? 1 : q(n - 1) + q(n - 2));
 *
 *   Example that do not works:
 *
 *       let f = (n: number) => n < 2 ? 1 : f(n - 1) + f(n - 2);
 *       f = memorize(f);
 *
 * */
export function memorize<F extends Function> (f: F): F & { clear: () => void } {
  /* tslint:enable:ban-types */
  /* length => ...args */
  const cache = new MapMap<number, MapMap<any, any>>();
  return Object.assign(
    wrapFunction<F>(function () {
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
    } as any, f.length, f.name)
    , {clear: () => cache.clear()},
  );
}

export class MemorizePool<A> {
  public cache = new MapMap<number, MapMap<any, any>>();

  /**
   * @return [has_or_not, result]
   * */
  public get (args: IArguments): undefined | [A] {
    const map = this.getLastMap(args);
    const last = args[0];
    if (map.has(last)) {
      return [map.get(last)as any];
    } else {
      return undefined;
    }
  }

  public set (args: IArguments, res) {
    this.getLastMap(args).set(args[0], res);
  }

  public getOrCalc (args: IArguments, f: () => A) {
    const map = this.getLastMap(args);
    const last = args[0];
    if (map.has(last)) {
      return map.get(last);
    }
    const res = f();
    map.set(last, res);
    return res;
  }

  private getLastMap (args: IArguments): MapMap<any, A> {
    let map = this.cache.getMap(args.length);
    for (let i = args.length - 1; i > 0; i--) {
      map = map.getMap(args[i]);
    }
    return map;
  }
}
