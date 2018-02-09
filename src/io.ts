/* tslint:disable:no-var-requires */
export let rl = require("readline").createInterface({
  input: process.stdin
});
/* tslint:enable:no-var-requires */
export namespace IO {
  export function forEachLine(onnext: (line: string) => void, oncomplete?: () => void) {
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
