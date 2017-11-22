import {createDefer, Defer, remove} from "@beenotung/tslib";
import {log} from "./debug";

export class Task<A> {
  readonly f: () => Promise<A>;
  res?: A;
  err?: any;
  running = false;
  done = false;
  readonly defer: Defer<A, any> = createDefer();

  constructor(f: () => Promise<A>) {
    this.f = f;
  }
}

export class TaskPool<A> {
  pendingTasks: Array<Task<A>> = [];
  runningTasks: Array<Task<A>> = [];
  stoppedTasks: Array<Task<A>> = [];

  constructor(public limit: number) {
  }

  addTaskF(f: () => Promise<A>) {
    return this.addTask(new Task<A>(f));
  }

  /**
   * parent must be already in pool
   * child should be new task (not in pool)
   * */
  addDepTask(parent: Task<A>, child: Task<A>) {
    parent.defer.promise.then(res => {
      this.addTask(child);
    });
    return child;
  }

  addDepTaskF(parent: Task<A>, childF: () => Promise<A>) {
    return this.addDepTask(parent, new Task<A>(childF));
  }

  addTask(task: Task<A>) {
    if (task.running) {
      this.runningTasks.push(task);
      return task;
    }
    if (task.done) {
      this.stoppedTasks.push(task);
      return task;
    }
    if (this.runningTasks.length >= this.limit) {
      this.pendingTasks.push(task);
      return task;
    }
    return this.runTask(task);
  }

  check() {
    log(`pending: ${this.pendingTasks.length}, running: ${this.runningTasks.length}, stopped: ${this.stoppedTasks.length}`);
    if (this.runningTasks.length < this.limit && this.pendingTasks.length > 0) {
      const task = this.pendingTasks.pop();
      this.runTask(task);
      this.check();
    }
  }

  private runTask(task: Task<A>) {
    this.runningTasks.push(task);
    task.running = true;
    const done = () => {
      task.running = false;
      task.done = true;
      remove(this.runningTasks, task);
      this.stoppedTasks.push(task);
      this.check();
    };
    task.f()
      .then(res => {
        task.res = res;
        task.defer.resolve(res);
        done();
      })
      .catch(err => {
        task.err = err;
        task.defer.reject(err);
        done();
      });
    return task;
  }
}
