/**
 * Created by beenotung on 3/9/17.
 */
const size_units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export function format_byte(n_byte: number, n_decimal = 2): string {
  let acc = n_byte;
  for (const size_unit of size_units) {
    if (acc < 1024) {
      return acc.toFixed(n_decimal) + ' ' + size_unit;
    }
    acc /= 1024;
  }
  return (
    (acc * 1024).toFixed(n_decimal) + ' ' + size_units[size_units.length - 1]
  );
}

export function format_datetime(
  time: number,
  options: { locales?: string; empty?: string } = {},
) {
  if (!time) {
    return options.empty || '-';
  }
  return new Date(time).toLocaleString(options.locales || 'en', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    hour12: true,
    minute: '2-digit',
  });
}
