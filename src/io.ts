/* tslint:disable:no-var-requires */
export let rl = require("readline").createInterface({
  /* tslint:enable:no-var-requires */
  input: process.stdin
});
export namespace IO {
  export function forEachLine(onnext: (line: string, lineNum: number) => void, oncomplete?: () => void) {
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
