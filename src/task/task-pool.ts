import { TaskQueue } from './task-queue';

export class TaskPool extends TaskQueue {
  ps: TaskQueue[];
  i: number;

  constructor(public concurrentSize = 1) {
    super();
    this.ps = new Array(concurrentSize).fill('').map(() => new TaskQueue());
    this.i = 0;
  }

  runTask<A>(f: () => A | Promise<A>): Promise<A> {
    this.i = (this.i + 1) % this.ps.length;
    return this.ps[this.i].runTask(f);
  }
}
