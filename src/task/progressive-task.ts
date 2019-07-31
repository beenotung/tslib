import { Subject } from 'rxjs/Subject';
import { remove } from '../array';
import { createDefer, Defer } from '../async/defer';

/**@deprecated*/
export class ProgressiveTask<A> {
  public readonly f: () => Promise<A>;
  public res?: A;
  public err?: any;
  public running = false;
  public done = false;
  public readonly defer: Defer<A, any> = createDefer();

  constructor(f: () => Promise<A>) {
    this.f = f;
  }
}

export type ProgressiveTaskPoolEventType = 'pending' | 'running' | 'stopped';

export interface ProgressiveTaskPoolProgress {
  eventType: ProgressiveTaskPoolEventType;
  pending: number;
  running: number;
  stopped: number;
}

export interface ProgressiveTaskPoolOptions {
  limit: number;
  /* default true */
  report_progress?: boolean;
  mode?: ProgressiveTaskPoolMode;
}

export const defaultProgressiveTaskPoolOptions: {
  report_progress: ProgressiveTaskPoolOptions['report_progress'];
  mode: ProgressiveTaskPoolMode;
} = {
  report_progress: true,
  mode: 'FILO',
};

export type ProgressiveTaskPoolMode = 'FIFO' | 'FILO';

/**@deprecated*/
export class ProgressiveTaskPool<A> {
  public readonly pendingTasks: Array<ProgressiveTask<A>> = [];
  public readonly runningTasks: Array<ProgressiveTask<A>> = [];
  public readonly stoppedTasks: Array<ProgressiveTask<A>> = [];
  public readonly progress?: Subject<ProgressiveTaskPoolProgress>;

  public limit: number;
  public mode: ProgressiveTaskPoolMode;

  constructor(options: ProgressiveTaskPoolOptions) {
    this.limit = options.limit;
    this.mode = options.mode || defaultProgressiveTaskPoolOptions.mode;
    if (options.report_progress) {
      this.progress = new Subject<ProgressiveTaskPoolProgress>();
    }
  }

  public addTaskF(f: () => Promise<A>) {
    return this.addTask(new ProgressiveTask<A>(f));
  }

  /**
   * parent must be already in pool
   * child should be new task (not in pool)
   * */
  public addDepTask(parent: ProgressiveTask<A>, child: ProgressiveTask<A>) {
    parent.defer.promise.then(res => {
      this.addTask(child);
    });
    return child;
  }

  public addDepTaskF(parent: ProgressiveTask<A>, childF: () => Promise<A>) {
    return this.addDepTask(parent, new ProgressiveTask<A>(childF));
  }

  public addTask(task: ProgressiveTask<A>) {
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
      this.report('pending');
      return task;
    }
    return this.runTask(task);
  }

  public check() {
    if (this.runningTasks.length < this.limit && this.pendingTasks.length > 0) {
      const task =
          this.mode === 'FILO'
            ? this.pendingTasks.pop() /* first in last out */
            : this.pendingTasks.shift() /* first in first out */;
      if (task) {
        this.runTask(task);
      }
      this.check();
    }
  }

  private runTask(task: ProgressiveTask<A>) {
    this.runningTasks.push(task);
    task.running = true;
    const done = () => {
      task.running = false;
      task.done = true;
      remove(this.runningTasks, task);
      this.stoppedTasks.push(task);
      this.report('stopped');
      this.check();
    };
    task
      .f()
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
    this.report('running');
    return task;
  }

  private report(type: ProgressiveTaskPoolEventType) {
    this.progress &&
      this.progress.next({
        eventType: type,
        pending: this.pendingTasks.length,
        running: this.runningTasks.length,
        stopped: this.stoppedTasks.length,
      });
  }
}
