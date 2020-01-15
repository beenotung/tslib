export const SINGLE_QUOTE = "'";
export const DOUBLE_QUOTE = '"';
export const COMMA = ',';

export function from_csv(
  s: string,
  separator = COMMA,
  delimiter = DOUBLE_QUOTE,
): string[][] {
  // to remove control char if got from network
  s = s.trim();
  const rows: string[][] = [];
  let cols: string[] = [];
  let col = '';
  let i = 0;
  const n = s.length;
  for (; i < n; ) {
    const c = s[i];
    i++;
    switch (c) {
      case separator:
        cols.push(col);
        col = '';
        break;
      case '\r':
        if (s[i] !== '\n') {
          col += c;
        }
        break;
      case '\n':
        cols.push(col);
        col = '';
        rows.push(cols);
        cols = [];
        break;
      default:
        if (c === delimiter) {
          for (;;) {
            const c = s[i];
            i++;
            if (c === delimiter) {
              if (s[i] === delimiter) {
                /* the content is delimiter */
                col += delimiter;
                i++;
              } else {
                /* the content has ends */
                break;
              }
            } else {
              /* the content is not delimiter */
              col += c;
            }
          }
          break;
        }
        col += c;
    }
  }
  if (s[n - 1] !== '\n') {
    // not terminated by new line, auto feed a newline
    if (col.length > 0) {
      cols.push(col);
    }
    if (cols.length > 0) {
      rows.push(cols);
    }
  }
  return rows;
}

export function to_csv(
  rows: string[][],
  separator = COMMA,
  delimiter = DOUBLE_QUOTE,
): string {
  const res: string[] = [];
  for (const cols of rows) {
    let first = true;
    for (const col of cols) {
      if (first) {
        first = false;
      } else {
        res.push(separator);
      }
      if (
        col &&
        col.indexOf(delimiter) === -1 &&
        col.indexOf(separator) === -1
      ) {
        res.push(col);
      } else {
        res.push(delimiter);
        for (const c of col) {
          if (c === delimiter) {
            res.push(delimiter, delimiter);
          } else {
            res.push(c);
          }
        }
        res.push(delimiter);
      }
    }
    res.push('\r\n');
  }
  return res.join('');
}

export function regular_csv(rows: string[][]): void {
  /**
   * to make each rows with same number of columns
   * for to_csv() to insert ending commas
   * */
  let maxCol = 0;
  rows.forEach(cols => (maxCol = Math.max(maxCol, cols.length)));
  rows.forEach(cols => {
    for (let i = cols.length; i < maxCol; i++) {
      cols.push();
    }
  });
}

export function csv_to_json(
  rows: string[][],
  titles: string[] = rows.shift() || [],
) {
  const n = titles.length;
  return rows.map(cols => {
    const res: { [title: string]: string } = {};
    for (let i = 0; i < n; i++) {
      res[titles[i]] = cols[i];
    }
    return res;
  });
}

export function json_to_csv(xs: any[]): string[][] {
  const titles: string[] = [];
  const titleCache: { [title: string]: boolean } = {};
  const rows: string[][] = [titles];

  /* build title list */
  for (const x of xs) {
    for (const title of Object.keys(x)) {
      if (!titleCache[title]) {
        titleCache[title] = true;
        titles.push(title);
      }
    }
  }

  const n = titles.length;

  for (const x of xs) {
    const cols = new Array(n).fill('');
    rows.push(cols);
    for (let i = 0; i < n; i++) {
      let col = x[titles[i]];
      if (col === null || col === undefined) {
        col = '';
      } else {
        col = String(col);
      }
      cols[i] = col;
    }
  }

  return rows;
}

function to_width(s: string, len: number, repeatChar: string): string {
  const diff = len - s.length;
  if (diff > 0) {
    s += repeatChar.repeat(diff / repeatChar.length);
    s += repeatChar.slice(0, len - s.length);
  }
  return s;
}

export function csv_to_table_text(
  rows: string[][],
  options?: {
    col_separator?: '  ' | string;
    header_line_char?: '-' | string;
    show_total?: false | boolean;
  },
): string {
  if (rows.length === 0) {
    return '';
  }
  let col_separator = '  ';
  let header_line_char = '-';
  let show_total = false;
  if (options) {
    if (options.col_separator) {
      col_separator = options.col_separator;
    }
    if (options.header_line_char) {
      header_line_char = options.header_line_char;
    }
    if (options.show_total) {
      show_total = options.show_total;
    }
  }
  const n = rows[0].length;
  const lengths = new Array(n).fill(0);
  for (const cols of rows) {
    for (let i = 0; i < n; i++) {
      const col = cols[i];
      if (col) {
        lengths[i] = Math.max(lengths[i], col.length);
      }
    }
  }
  const titles = rows[0];
  const contents = rows.slice(1);
  let acc = '';
  acc += titles.map((s, i) => to_width(s, lengths[i], ' ')).join(col_separator);
  acc += '\n';
  acc += titles
    .map((s, i) => to_width('', lengths[i], header_line_char))
    .join(col_separator);
  acc += '\n';
  acc += contents
    .map(cols =>
      cols.map((s, i) => to_width(s, lengths[i], ' ')).join(col_separator),
    )
    .join('\n');
  if (show_total) {
    acc += '\n';
    acc += '\n';
    acc += 'total: ' + contents.length;
  }
  return acc;
}
