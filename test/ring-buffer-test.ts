import { RingBuffer } from '../src/ring-buffer';
import * as test from 'tape';

test('correct boundary', t => {
  const size = 3;
  const xs = new RingBuffer(size);
  for (let x = 0; x < size * 5; x++) {
    xs.push(x);
    let y = xs.unshift();
    t.equal(y, x);
  }
  t.equal(xs.length, 0);
  t.end();
});
