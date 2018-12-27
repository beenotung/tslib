import { Random } from '../src/random';

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
