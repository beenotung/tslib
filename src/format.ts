/**
 * Created by beenotung on 3/9/17.
 */
const size_units = [
  'B'
  , 'KB'
  , 'MB'
  , 'GB'
  , 'TB'
  , 'PB'
  , 'EB'
  , 'ZB'
  , 'YB'
];

export function format_byte(n_byte: number, n_decimal = 2): string {
  let acc = n_byte;
  for (let size_unit of size_units) {
    if (acc < 1024) {
      return acc.toFixed(n_decimal) + ' ' + size_unit;
    }
    acc /= 1024;
  }
  return (acc * 1024).toFixed(n_decimal) + ' ' + size_units[size_units.length - 1];
}
