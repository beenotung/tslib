/**
 * Strict TSV (tab-separated values), per the IANA `text/tab-separated-values`
 * format: one record per line, tab-separated fields, and **no quoting** — a `"`
 * is literal data, and a tab or newline in a field is not representable.
 *
 * For a quoted-tab dialect that can preserve tabs/newlines, use
 * `to_csv(rows, TAB)` / `from_csv(text, TAB)` from `csv.ts` instead.
 */

export const TAB = '\t'

/** Sentinel: throw instead of substituting an unrepresentable character. */
export const THROW = 'throw'
export const THROWS = 'throws'

/**
 * Accepted spellings of the throw sentinel. Prefer `THROW`; `'throws'` is
 * accepted as an alias for convenience.
 */
export type ThrowOption = typeof THROW | typeof THROWS

function is_throw(
  value: string | ThrowOption | undefined,
): value is ThrowOption | undefined {
  return value === undefined || value === THROW || value === THROWS
}

/**
 * How tab / newline are represented when a strict TSV field cannot contain them.
 *
 * Passed to `to_tsv` it is the character to substitute (or `THROW`/`'throws'`,
 * the default when omitted, to throw). Passed to `from_tsv` it is the marker to
 * restore back to the real character. Using the same options for both round-trips
 * the value: `from_tsv(to_tsv(rows, options), options)`.
 *
 * Substitution is **lossy**: a marker that occurred literally in the original
 * text cannot be told apart from a substituted one on read. Suggested patterns:
 * `' '`, `'\\t'`, `'\\n'`, `'<tab>'`, `'[tab]'`, `'<br>'`.
 */
export type TSVOptions = {
  /** Marker for a tab in a field. */
  tab?: string | ThrowOption
  /** Marker for a line break (`\r\n`, `\r`, or `\n`) in a field. */
  newline?: string | ThrowOption
}

/**
 * Parse a strict TSV text: one record per line, split on tabs, no quoting.
 *
 * Pass the same `options` used with `to_tsv` to restore the substituted tab /
 * newline markers back to the real characters (best-effort — see `TSVOptions`).
 */
export function from_tsv(text: string, options: TSVOptions = {}): string[][] {
  const tab_marker = is_throw(options.tab) ? undefined : options.tab
  const newline_marker = is_throw(options.newline) ? undefined : options.newline

  // by design: strip leading/trailing whitespace and stray control chars
  // (e.g. a trailing CRLF or BOM pasted in from network input)
  text = text.trim()
  const rows: string[][] = []
  const lines = text.split('\n')
  for (let index = 0; index < lines.length; index++) {
    let line = lines[index]
    if (index === lines.length - 1 && line === '') {
      // ignore the trailing newline
      continue
    }
    if (line.endsWith('\r')) {
      line = line.slice(0, -1)
    }
    const fields = line.split(TAB).map(field => {
      if (tab_marker !== undefined) {
        field = field.split(tab_marker).join(TAB)
      }
      if (newline_marker !== undefined) {
        field = field.split(newline_marker).join('\n')
      }
      return field
    })
    rows.push(fields)
  }
  return rows
}

/**
 * Encode rows into a strict TSV text: one record per line (CRLF-terminated),
 * tab-separated. A field containing a tab or newline throws by default; pass
 * `options` to substitute them instead (`to_csv(rows, TAB)` preserves them
 * losslessly).
 */
export function to_tsv(rows: string[][], options: TSVOptions = {}): string {
  const tab_replacement = is_throw(options.tab) ? undefined : options.tab
  const newline_replacement = is_throw(options.newline)
    ? undefined
    : options.newline

  const res: string[] = []
  for (const cols of rows) {
    let first = true
    for (const col of cols) {
      if (first) {
        first = false
      } else {
        res.push(TAB)
      }

      let field = col ?? ''

      if (field.includes(TAB)) {
        if (tab_replacement === undefined) {
          throw new Error(
            'TSV field cannot contain a tab: ' + JSON.stringify(field),
          )
        }
        // split/join keeps the replacement literal; a string passed to
        // replaceAll would expand `$` patterns (e.g. `$&`) from user input
        field = field.split(TAB).join(tab_replacement)
      }

      if (field.includes('\n') || field.includes('\r')) {
        if (newline_replacement === undefined) {
          throw new Error(
            'TSV field cannot contain a newline: ' + JSON.stringify(field),
          )
        }
        // match \r\n as a single line break; split/join keeps the replacement
        // literal (see the tab case above)
        field = field.split(/\r\n|\r|\n/).join(newline_replacement)
      }

      res.push(field)
    }
    res.push('\r\n')
  }
  return res.join('')
}
