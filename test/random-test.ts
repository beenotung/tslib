import { format_relative_time } from '../src/format';
import { base58Letters, digits, Random } from '../src/random';

let ProgressBar = require('cli-progress').Bar;

function testEnum() {
  enum E {
    a, b, c,
  }

  let e: E = Random.nextEnum(E);
  console.log('enum values:');
  console.log(Random.nextEnum<E>(E));
  console.log(Random.nextEnum<E>(E));
  console.log(Random.nextEnum<E>(E));
  console.log('enum keys:');
  console.log(Random.nextEnumKey(E));
  console.log(Random.nextEnumKey(E));
  console.log(Random.nextEnumKey(E));
}

testEnum();

function testProbability() {
  let xs = {};
  let n = 0;
  let pool = base58Letters;
  let length = 3;
  let progressBar = new ProgressBar();
  progressBar.start(Math.pow(pool.length, length), 0);
  let start = new Date();
  for (; ;) {
    if (n >= Math.pow(pool.length, length)) {
      break;
    }
    let start = Date.now();
    let i = 0;
    for (; ;) {
      i++;
      // let s = Math.random().toString(36).substr(2);
      let s = Random.nextString(length, pool);
      if (!xs[s]) {
        xs[s] = true;
        n++;
        if (progressBar) {
          progressBar.increment();
        } else {
          let end = Date.now();
          let used = end - start;
          console.log(`n=${n}, i=${i}, used ${used} ms`);
        }
        break;
      }
    }
  }
  if (progressBar) {
    progressBar.stop();
  }
  console.log('tried all combination');
  console.log(format_relative_time(start.getTime()));
}

testProbability();
