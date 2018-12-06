import { Lock } from '../lock';
import { Task } from './task';

export class TaskPool {
  private readonly lock: Lock;

  constructor(limit: number) {
    this.lock = new Lock(limit);
  }

  public async run<A>(task: Task<A>): Promise<A> {
    await this.lock.acquire(1);
    try {
      return await task();
    } catch (e) {
      throw e;
    } finally {
      this.lock.release(1);
    }
  }
}
