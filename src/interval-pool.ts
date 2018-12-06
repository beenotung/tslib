export class IntervalPool {
  public currentTask: Promise<any> = Promise.resolve();

  constructor(public interval: number) {}

  public async queue<A>(f: () => A): Promise<A> {
    return (this.currentTask = this.currentTask.then(
      () =>
        new Promise<A>((resolve, reject) => {
          setTimeout(() => {
            try {
              resolve(f());
            } catch (e) {
              reject(e);
            }
          }, this.interval);
        }),
    ));
  }
}
