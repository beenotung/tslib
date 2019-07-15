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
let delays = keys.map(() => delay * Math.random());

console.log('benchmarking data-processor pipeline');
catchMain(
  batchProcess({
    maxConcurrent: 1000 * 100,
    keys,
    loader: key => later(delays[key]).then(() => {
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
    return rawSyncTest(usedTime);
  }));

let rawSyncTest = (async (duration: number) => {
  console.log();
  console.log('benchmarking sync version with delay');
  let startTime = Date.now();
  let last = -1;
  let ranN = n;
  for (let i = 0; i < n; i++) {
    await later(delays[i]);
    let key = keys[i];
    let datum = i.toString().repeat(10000);
    if (key < last) {
      throw new Error('not in order');
    }
    last = key;
    process.stdout.write('\rprocessing: ' + key);
    if ((Date.now() - startTime) >= duration) {
      ranN = i;
      break;
    }
  }
  clearLine();
  let endTime = Date.now();
  let usedTime = endTime - startTime;
  console.log('used:', format_time_duration(usedTime));
  console.log('average TPS: ' + (ranN / (usedTime / 1000)));

  console.log();
  console.log('benchmarking sync version without delay');
  startTime = Date.now();
  last = -1;
  for (let i = 0; i < n; i++) {
    let key = keys[i];
    let datum = i.toString().repeat(10000);
    if (key < last) {
      throw new Error('not in order');
    }
    last = key;
    process.stdout.write('\rprocessing: ' + key);
  }
  clearLine();
  endTime = Date.now();
  usedTime = endTime - startTime;
  console.log('used:', format_time_duration(usedTime));
  console.log('average TPS: ' + (n / (usedTime / 1000)));
});
