import {enum_keys, enum_values} from "../src/enum";

enum Color {
  red, green, blue
}

console.log('enum_values', enum_values(Color));
console.log('enum_keys', enum_keys(Color));
