import test from 'tape';
import { compare, compare_by_keys } from '../src/compare';

let numbers = [1, 10, 3, 2];
let sorted = [1, 2, 3, 10];
test('sort numeric number', t => {
  t.deepEquals(numbers.slice().sort(compare), sorted);
  t.end();
});

test('sort object array by key', t => {
  t.deepEquals(
    numbers.map(x => ({ x })).sort(compare_by_keys(['x'])),
    sorted.map(x => ({ x })),
  );
  t.deepEquals(
    [
      { a: 10, b: 10 },
      { a: 1, b: 1 },
      { a: 10, b: 1 },
      { a: 1, b: 10 },
    ].sort(compare_by_keys(['a', 'b'])),
    [
      { a: 1, b: 1 },
      { a: 1, b: 10 },
      { a: 10, b: 1 },
      { a: 10, b: 10 },
    ],
  );
  t.end();
});

test('sort object with non-numeric key', t => {
  let user = {
    name: 'Alice',
    age: 20,
    other_field: true
  };
  // should compile without complaining the boolean field
  [user].sort(compare_by_keys(['name', 'age']));
  t.end();
});
