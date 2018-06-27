import {createDefer, Defer} from "./async/defer";

interface QueueItem {
  defer: Defer<void, never>;
  amount: number;
}

export class Lock {

  public readonly quota: number;
  public res: number;

  private queue: QueueItem[] = [];

  constructor (quota = 1) {
    this.quota = quota;
    this.res = quota;
  }

  public async acquire (amount = 1): Promise<void> {
    if (amount > this.quota) {
      throw new Error("not enough quota: max=" + this.quota + ", require=" + amount);
    }
    if (this.res >= amount) {
      this.res -= amount;
      return;
    }
    const defer = createDefer<void, never>();
    this.queue.push({defer, amount});
    return defer.promise;
  }

  public release (amount = 1) {
    this.res += amount;
    this.check();
  }

  private check () {
    this.queue = this.queue.filter((item) => {
      if (this.res >= item.amount) {
        this.res -= item.amount;
        item.defer.resolve(void 0);
        return false;
      }
      return true;
    });
  }
}

export function createLock (quota = 1): Lock {
  return new Lock(quota);
}
