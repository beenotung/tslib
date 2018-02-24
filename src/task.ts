import {createDefer, Defer} from "./async/defer";
import {Subject} from "rxjs/Subject";
import {remove} from "./array";
import {ensureNumber, ensureString} from "./strict-type";

/**@deprecated*/
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

export type TaskPoolEventType = "pending" | "running" | "stopped";

export interface TaskPoolProgress {
  eventType: TaskPoolEventType
  pending: number
  running: number
  stopped: number
}

export interface TaskPoolOptions {
  limit: number
  /* default true */
  report_progress?: boolean
  mode?: TaskPoolMode
}

export const defaultTaskPoolOptions: TaskPoolOptions = {
  limit: undefined
  , report_progress: true
  , mode: "FILO"
};

export type TaskPoolMode = "FIFO" | "FILO";

/**@deprecated*/
export class TaskPool<A> {
  readonly pendingTasks: Array<Task<A>> = [];
  readonly runningTasks: Array<Task<A>> = [];
  readonly stoppedTasks: Array<Task<A>> = [];
  readonly progress?: Subject<TaskPoolProgress>;

  limit: number;
  mode: TaskPoolMode;

  constructor(options: TaskPoolOptions) {
    options = Object.assign({}, defaultTaskPoolOptions, options);
    this.limit = ensureNumber(options.limit);
    this.mode = ensureString(options.mode);
    if (options.report_progress) {
      this.progress = new Subject<TaskPoolProgress>();
    }
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
      this.report("pending");
      return task;
    }
    return this.runTask(task);
  }

  check() {
    if (this.runningTasks.length < this.limit && this.pendingTasks.length > 0) {
      const task = this.mode === "FILO"
        ? this.pendingTasks.pop() /* first in last out */
        : this.pendingTasks.shift() /* first in first out */
      ;
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
      this.report("stopped");
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
    this.report("running");
    return task;
  }

  private report(type: TaskPoolEventType) {
    this.progress && this.progress.next({
      eventType: type,
      pending: this.pendingTasks.length,
      running: this.runningTasks.length,
      stopped: this.stoppedTasks.length
    });
  }
}
