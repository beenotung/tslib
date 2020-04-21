import {
  compare_string,
  split_string_num,
  string_to_chars,
} from '../src/string'

console.log(string_to_chars('9876543210123456789'))

function test(values: string[]) {
  values.forEach(s => console.log(s, ':', split_string_num(s)))

  console.log(
    'sorted:',
    values.sort((a, b) => compare_string(a, b)),
  )
}

test(['varchar_10', 'varchar_20', 'varchar_16', 'varchar_64'])
test(['1', '2', '10', '20', '0', '00'])
