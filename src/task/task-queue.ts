export class TaskQueue {
  p: Promise<void>

  constructor() {
    this.p = Promise.resolve()
  }

  runTask<A>(f: () => A | Promise<A>): Promise<A> {
    return new Promise<A>((resolve, reject) => {
      this.p = this.p.then(async () => {
        try {
          resolve(Promise.resolve(await f()))
        } catch (e) {
          reject(e)
        }
        return Promise.resolve()
      })
    })
  }
}
