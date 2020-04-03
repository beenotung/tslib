import test from 'tape';
import { WaitGroup } from '../src/async/wait-group';

test('wait group', t => {
  let wg = new WaitGroup();

  function wait(interval: number) {
    let cb = wg.add();
    console.log('wait for', interval, 'ms');
    setTimeout(() => {
      console.log('waited', interval, 'ms');
      cb();
    }, interval);
  }

  wait(300);
  wait(200);
  wait(100);
  wg.waitAll(() => {
    console.log('all done');
    t.end();
  });
});

