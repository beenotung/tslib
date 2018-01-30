export async function promisify<A>(f: (...args: any[]) => any, args: any[] = []): Promise<A> {
  return new Promise<A>((resolve, reject) => {
    (f as any).call(...args, (err, res: A) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    })
  })
}

export interface PromiseCallback<A> {
  (err, res: A): any;

  promise: Promise<A>;
}

export function genPromiseCallback<A>(): PromiseCallback<A> {
  let resolve, reject;
  let p = new Promise<A>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  let cb = (err, res) => {
    if (err) {
      reject(err)
    } else {
      resolve(res)
    }
  };
  return Object.assign(cb, {promise: p});
}
