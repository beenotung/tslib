import { Enum, enum_keys, enum_last_i, enum_last_s, enum_only_string, enum_set_string, enum_values } from '../src/enum';

enum Color {
  red, green, blue
}

console.log('keys', Object.keys(Color));

console.log('enum_values', enum_values(Color));
console.log('enum_keys', enum_keys(Color));

console.log('enum', Color);
console.log('last i', enum_last_i(Color));
console.log('last s', enum_last_s(Color));

enum_set_string(Color);
console.log('set string', Color);

enum_only_string(Color);
console.log('only string', Color);

console.log('last i', enum_last_i(Color));
console.log('last s', enum_last_s(Color));

function testEnum(e: Enum<Color>) {
  console.log('passed as enum', e);
  console.log('keys', enum_keys(e));
}

testEnum(Color);
