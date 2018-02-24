import {Task} from "./task";
import {Lock} from "../lock";

export class TaskPool {
  private readonly lock: Lock;

  constructor(limit: number) {
    this.lock = new Lock(limit);
  }

  async run<A>(task: Task<A>): Promise<A> {
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
