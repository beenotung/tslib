import { numToAB } from '../src/number';

function test(x) {
  process.stdout.write(x + ' = ');
  let [a, b] = numToAB(x);
  console.log(`${a}/${b}`);
}

test(0);
test(1);
test(2);
test(-2);
test(0.128);
test(-987.64);
test(365.2425);
