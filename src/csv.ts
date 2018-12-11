export const SINGLE_QUOTE = "'";
export const DOUBLE_QUOTE = '"';
export const COMMA = ',';

export function from_csv(
  s: string,
  separator = COMMA,
  delimiter = DOUBLE_QUOTE,
) {
  const rows: string[][] = [];
  let cols: string[] = [];
  let i = 0;
  const n = s.length;
  for (; i < n; ) {
    const c = s[i];
    switch (c) {
      case separator:
        cols.push('');
        i++;
        break;
      case '\n':
      case '\r':
        rows.push(cols);
        cols = [];
        if (c === '\r' && s[i + 1] === '\n') {
          i += 2;
        } else {
          i += 1;
        }
        break;
      case delimiter: {
        let col = '';
        let idx = i + 1;
        for (; idx < n; idx++) {
          const c = s[idx];
          // console.log({cols, col, c});
          if (c === delimiter && s[idx + 1] === delimiter) {
            col += delimiter;
            idx++;
          } else if (c === delimiter) {
            break;
          } else {
            col += c;
          }
        }
        cols.push(col);
        i = idx + 1;
        break;
      }
      default: {
        /* normal mode */
        const start = i;
        let end = s.indexOf(separator, start);
        if (end === -1) {
          end = n;
        }
        const col = s.substring(start, end);
        cols.push(col);
        i = end + 1;
        break;
      }
    }
  }
  if (cols.length > 0) {
    rows.push(cols);
  }
  return rows;
}
