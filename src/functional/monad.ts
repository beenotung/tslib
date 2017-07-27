/** reference : https://github.com/douglascrockford/monad/blob/master/monad.js*/
export interface Unit {
  method();

  lift_value();
}

export function MONAD(modifier?: Function) {
  const prototype = Object.create(null);
  prototype.is_monad = true;

  function unit(value) {
    const monad = Object.create(prototype);
    monad.bind = function (f: Function, args: any[] = []) {
      return f.apply(void 0, value, ...args);
    };
    if (typeof modifier === "function") {
      value = modifier(monad, value);
    }
    return monad;
  }

  unit["method"] = function (name: PropertyKey, f: Function) {
    prototype[name] = f;
    return unit;
  };

  unit["lift_value"] = function (name: PropertyKey, f: Function) {
    prototype[name] = function () {
      return this.bind(f, arguments);
    };
    return unit;
  };

  return unit;
}


