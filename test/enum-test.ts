import { Enum, enum_keys, enum_only_string, enum_set_string, enum_values } from '../src/enum';

enum Color {
  red, green, blue
}

console.log('keys', Object.keys(Color));

console.log('enum_values', enum_values(Color));
console.log('enum_keys', enum_keys(Color));

console.log('enum', Color);

enum_set_string(Color);
console.log('set string', Color);

enum_only_string(Color);
console.log('only string', Color);

function testEnum(e: Enum) {
  console.log('passed as enum', e);
  console.log('keys', enum_keys(e));
}

testEnum(Color);
