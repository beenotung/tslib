import { Lock } from '../lock'
import { Runnable } from './runnable'

export class RunnerPool {
  private readonly lock: Lock

  constructor(limit: number) {
    this.lock = new Lock(limit)
  }

  public async run<A>(task: Runnable<A>): Promise<A> {
    await this.lock.acquire(1)
    try {
      return await task()
    } finally {
      this.lock.release(1)
    }
  }
}
