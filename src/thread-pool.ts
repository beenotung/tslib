import * as os from 'os';
import { promisify } from 'util';
import { Worker } from 'worker_threads';

function defaultWeights(): number[] {
  return os.cpus().map(cpu => cpu.speed);
}

export type WeightedWorker = {
  weight: number;
  worker: Worker;
};

/**
 *
 * dispatcher of workers created from `worker_threads.Worker`
 *
 * only support request-response batch-by-batch
 * DO NOT support multiple interlaced concurrent batches
 * */
export class ThreadPool {
  totalWeights: number;
  workers: WeightedWorker[];

  dispatch: {
    <T, R>(inputs: T[], cb: (err: any, outputs: R[]) => void): void;
    <T, R>(inputs: T[]): Promise<R[]>;
  } = promisify(<T, R>(inputs: T[], cb: (err: any, outputs: R[]) => void) => {
    const n = inputs.length;
    const outputs = new Array(n);
    let offset = 0;
    let pending = 0;
    for (const worker of this.workers) {
      const start = offset;
      const count = Math.ceil((worker.weight / this.totalWeights) * n);
      const end = offset + count;
      offset = end;
      const xs = inputs.slice(start, end);
      pending++;
      worker.worker.once('message', ys => {
        for (let o = start, c = 0; o < end; o++, c++) {
          outputs[o] = ys[c];
        }
        pending--;
        if (pending === 0) {
          cb(undefined, outputs);
        }
      });
      worker.worker.postMessage(xs);
      if (end >= n) {
        break;
      }
    }
  });

  constructor(
    options:
      | {
          modulePath: string;
          weights?: number[];
          /**
           * number of worker = (number of core / weights) * overload
           * default to 1.0
           * */
          overload?: number;
        }
      | {
          workers: WeightedWorker[];
        },
  ) {
    if ('workers' in options) {
      if (options.workers.length === 0) {
        throw new Error('require at least 1 workers');
      }
      this.workers = options.workers;
      this.totalWeights = 0;
      this.workers.forEach(x => (this.totalWeights += x.weight));
      return;
    }
    let { weights, overload } = options;
    if (!weights) {
      weights = defaultWeights();
    }
    if (weights.length === 0) {
      throw new Error('require at least 1 weights');
    }
    if (!overload) {
      overload = 1;
    }
    const n = weights.length * overload;
    this.workers = new Array(n);
    this.totalWeights = 0;
    for (let i = 0; i < n; i++) {
      const weight = weights[i % weights.length];
      this.totalWeights += weight;
      this.workers[i] = {
        weight,
        worker: new Worker(options.modulePath),
      };
    }
  }

  close() {
    this.workers.forEach(worker => worker.worker.terminate());
  }
}
