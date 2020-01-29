import { ChildProcess, fork } from 'child_process';
import * as os from 'os';
import { promisify } from 'util';

function defaultWeights(): number[] {
  return os.cpus().map(cpu => cpu.speed);
}

export type WeightedProcessWorker = {
  weight: number;
  process: ChildProcess;
};

/**
 * dispatcher of workers created from `child_process.fork`
 *
 * only support request-response batch-by-batch
 * DO NOT support multiple interlaced concurrent batches
 * */
export class ProcessPool {
  totalWeights: number;
  workers: WeightedProcessWorker[];

  dispatch: {
    <T, R>(inputs: T[], cb: (err: any, outputs: R[]) => void): void;
    <T, R>(inputs: T[]): Promise<R[]>;
  } = promisify(<T, R>(inputs: T[], cb: (err: any, outputs: R[]) => void) => {
    const n = inputs.length;
    const outputs = new Array<R>(n);
    let offset = 0;
    let pending = 0;
    for (const worker of this.workers) {
      const start = offset;
      const count = Math.ceil((worker.weight / this.totalWeights) * n);
      const end = offset + count;
      offset = end;
      const xs = inputs.slice(start, end);
      pending++;
      worker.process.once('message', (ys: R[]) => {
        for (let o = start, c = 0; o < end; o++, c++) {
          outputs[o] = ys[c];
        }
        pending--;
        if (pending === 0) {
          cb(undefined, outputs);
        }
      });
      worker.process.send(xs);
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
          workers: WeightedProcessWorker[];
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
        process: fork(options.modulePath),
      };
    }
  }

  close(signal: NodeJS.Signals | number = os.constants.signals.SIGTERM) {
    // cast as any for @type/node compatibility
    this.workers.forEach(worker => worker.process.kill(signal as any));
  }
}
