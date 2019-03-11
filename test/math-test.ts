import { numberToFraction, reduceFraction } from '../src/math';
import { Random } from '../src/random';

function format([a, b]) {
  return a + '/' + b;
}

console.log('== Test extract + simplify ==');

function test1(x) {
  console.log();
  process.stdout.write(x + ' = ');
  let [a, b] = numberToFraction(x);
  console.log(`${a}/${b}`);
  a *= Random.nextInt(10, -10);
  b *= Random.nextInt(5, -5);
  console.log(`before: ${a}/${b}`);
  [a, b] = reduceFraction([a, b]);
  console.log(`after: ${a}/${b}`);
}

test1(0);
test1(1);
test1(2);
test1(-2);
test1(0.128);
test1(-987.64);
test1(365.2425);

console.log();
console.log('== Test sign handling in simplification ==');

function test2([a, b]) {
  console.log(format([a, b]), '~~>', format(reduceFraction([a, b])));
}

test2([4, 5]);
test2([-4, 5]);
test2([4, -5]);
test2([-4, -5]);
