import { RingBuffer } from '../src/ring-buffer';

const size = 100;
const xs = new RingBuffer(size);
for (let j = 0; j < size * 100; j++) {
  xs.push(0);
  xs.unshift();
}
console.log('without error, length:', xs.length);
