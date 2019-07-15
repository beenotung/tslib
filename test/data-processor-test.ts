import { later } from '../src/async/wait';
import { format_time_duration } from '../src/format';
import { catchMain } from '../src/node';
import { batchProcess } from '../src/task/data-processor';

let clearLine = () => process.stdout.write('\r' + ' '.repeat(32) + '\r');

let n = 1000 * 1000;
let delay = 1000;
let keys = new Array(n).fill(0).map((x, i) => i);
let startTime = Date.now();
let last = -1;
catchMain(
  batchProcess({
    maxConcurrent: 1000 * 100,
    keys,
    loader: key => later(delay * Math.random()).then(() => {
      return ({
        key,
        value: key.toString().repeat(10000),
      });
    }),
    processor: ({ key, value }) => {
      if (key < last) {
        clearLine();
        console.error({ last, key });
        throw new Error('not processing in order');
      }
      last = key;
      process.stdout.write('\rprocessing: ' + key);
    },
  }).then(() => {
    clearLine();
    let endTime = Date.now();
    let usedTime = endTime - startTime;
    console.log('used: ', format_time_duration(usedTime));
    console.log('average TPS: ' + (n / (usedTime / 1000)));
  }));

