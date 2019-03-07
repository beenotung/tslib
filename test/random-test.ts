import { digits, Random } from '../src/random';

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
  let pool = digits;
  let length = 4;
  for (; ;) {
    if (n >= Math.pow(pool.length, length)) {
      console.log('tried all combination');
      return;
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
        break;
      }
    }
    let end = Date.now();
    let used = end - start;
    // if (Random.nextBool(0.25)) {
      console.log(`n=${n}, i=${i}, used ${used} ms`);
    // }
  }
}

testProbability();
