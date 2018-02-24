import {createInterface, ReadLine, ReadLineOptions} from "readline";
import {createLazy} from "./lazy";

export function createRL(options: ReadLineOptions = {input: process.stdin}): ReadLine {
  return createInterface(options);
}

export let getRL: () => ReadLine = createLazy(createRL);

export namespace IO {
  export function forEachLine(onnext: (line: string) => void, oncomplete?: () => void) {
    const rl = getRL();
    rl.on("line", line => {
      if (line) {
        onnext(line);
      }
    });
    if (typeof oncomplete === "function") {
      rl.on("close", oncomplete);
    }
  }

  export async function mapLine<A>(f: (line: string) => A): Promise<A[]> {
    return new Promise<A[]>((resolve, reject) => {
      const res = [];
      forEachLine(line => res.push(f(line)), () => resolve(res));
    });
  }

  export async function collect(): Promise<string[]> {
    return mapLine(x => x);
  }
}
