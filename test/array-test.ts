import { Bar } from 'cli-progress';
import {
  binArray,
  cloneArray,
  countArray,
  countElement,
  defaultComparator,
  getMaxArraySize,
  max,
  maxByField,
  maxByFunc,
  median,
  min,
  minByField,
  minByFunc,
  mode,
  range,
  sum,
  sumByField,
} from '../src/array';
import * as test from 'tape';

test('getMaxArraySize', t => {
  const MaxArraySize = getMaxArraySize();
  console.log({ MaxArraySize });
  let xss = new Array(MaxArraySize);
  const bar = new Bar({});
  bar.start(MaxArraySize, 0);
  for (let i = 0; i < 10000; i++) {
    xss[i] = new Array(MaxArraySize);
    bar.increment(1);
  }
  bar.stop();
  t.end();
});

test('cloneArray', t => {
  let xs = [1, 3, 2];
  let ys = cloneArray(xs);

  t.deepEquals(xs, ys, 'should clone identical array');

  ys[0]++;
  t.notDeepEqual(xs, ys, 'should not modify original array');

  t.end();
});

test('range', t => {
  let xs = range(1, 100);
  t.deepEqual(xs, new Array(100).fill(0).map((x, i) => i + 1));
  t.end();
});

test('binArray', t => {
  let xs = range(1, 100);
  let xss = binArray(xs, 7);
  t.deepEqual(xss.length, 15);
  t.deepEqual(xss[0], [1, 2, 3, 4, 5, 6, 7]);
  t.deepEqual(xss[14], [99, 100]);
  t.end();
});

test('countArray', t => {
  t.equal(countArray(range(1, 100), x => x % 2 === 0), 50);
  t.end();
});

test('array compare', t => {
  let numbers = [1, 3, 2];
  let negativeNumbers = numbers.map(x => -x);
  let objects = numbers.map(x => ({ x }));
  let numberSum = 1 + 2 + 3;

  t.equal(max(numbers), 3, 'max');
  t.deepEqual(maxByField(objects, 'x'), { x: 3 }, 'maxByField');
  t.deepEquals(maxByFunc(objects, (a, b) => defaultComparator(a.x, b.x)), { x: 3 }, 'maxByFunc');

  t.equal(min(numbers), 1, 'min');
  t.equal(min(negativeNumbers), -3, 'min negative');
  t.deepEqual(minByField(objects, 'x'), { x: 1 }, 'minByField');
  t.deepEquals(minByFunc(objects, (a, b) => defaultComparator(a.x, b.x)), { x: 1 }, 'minByFunc');

  t.equal(sum(numbers), numberSum, 'sum');
  t.equal(sumByField(objects, 'x'), numberSum, 'sumByField');

  t.end();
});

test('median', t => {
  let xs = [1, 4, 5, 2, 1, 3, 4, 1, 5, 1, 5, 3, 2, 1, 2, 3];
  let x = median(xs);
  t.equal(x, 2.5);
  t.end();
});

test('counting', t => {
  let xs = [
    ...'a'.repeat(2).split(''),
    ...'b'.repeat(3).split(''),
    ...'c'.repeat(4).split(''),
    ...'d'.repeat(2).split(''),
  ];
  t.equal(countElement(xs, 'c'), 4, 'countElement');
  t.equal(mode(xs), 'c', 'mode');
  t.end();
});

