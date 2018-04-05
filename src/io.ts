import {createInterface, ReadLine, ReadLineOptions} from "readline";
import {createLazy} from "./lazy";

export function createRL(options: ReadLineOptions = {input: process.stdin}): ReadLine {
  return createInterface(options);
}

export let getRL: () => ReadLine = createLazy(createRL);

/**@deprecated*/
export let rl: ReadLine;
{
  let isNew = true;
  rl = new Proxy({}as ReadLine, {
    get: (target, p) => {
      if (isNew) {
        isNew = false;
        Object.assign(target, getRL());
      }
      return target[p];
    }
  });
}

export namespace IO {
  /**
   * @description lineNum start from 0
   * */
  export function forEachLine(onnext: (line: string, lineNum: number) => void, oncomplete?: () => void) {
    const rl = getRL();
    let lineNum = -1;
    rl.on("line", line => {
      lineNum++;
      if (line) {
        onnext(line, lineNum);
      }
    });
    if (typeof oncomplete === "function") {
      rl.on("close", oncomplete);
    }
  }

  /**
   * @description lineNum start from 0
   * */
  export async function mapLine<A>(f: (line: string, lineNum: number) => A): Promise<A[]> {
    return new Promise<A[]>((resolve, reject) => {
      try {
        const res = [];
        forEachLine((line, lineNum) => res.push(f(line, lineNum)), () => resolve(res));
      } catch (e) {
        reject(e);
      }
    });
  }

  export async function collect(): Promise<string[]> {
    return mapLine(x => x);
  }
}
