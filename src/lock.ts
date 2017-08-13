import {createDefer, Defer} from "./async";

interface QueueItem {
  defer: Defer<void, Error>;
  amount: number;
}

export class Lock {

  readonly quota: number;
  res: number;

  private queue: QueueItem[] = [];

  constructor(quota = 1) {
    this.quota = quota;
    this.res = quota;
  }

  async acquire(amount = 1): Promise<void> {
    if (amount > this.quota) {
      throw new Error("not enough quota: max=" + this.quota + ", require=" + amount);
    }
    if (amount <= this.res) {
      this.res -= amount;
      return void 0;
    }
    const defer = createDefer<void, Error>();
    this.queue.push({
      defer: defer
      , amount: amount
    });
    return defer.promise;
  }

  release(amount = 1) {
    this.res += amount;
    this.queue.forEach(item => {
      if (item.amount <= this.res) {
        this.res -= item.amount;
        item.defer.resolve(void 0);
      }
    });
  }
}

export function createLock(quota = 1): Lock {
  return new Lock(quota);
}
