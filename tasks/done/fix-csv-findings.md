# Fix `csv.ts` findings

Three small bugs found while reviewing `src/csv.ts`. Split out of
`done/tsv-support.md` when the TSV task was archived.

## Fixed

- `to_csv` threw on a non-string cell (a hole, `null`, or `undefined`) — now
  `String(col ?? '')`, so nullish becomes `''` and other types (e.g. number) are
  coerced.
- `to_csv` left a lone `\r` unquoted — now quoted, per RFC 4180 (CR is outside
  `TEXTDATA`).
- `regular_csv` was a no-op — `cols.push()` → `cols.push('')`, so rows are
  actually padded.

The three fixes are independent (verified): fixing `regular_csv` alone does not
trigger the `to_csv` crash, because `push('')` yields empty strings, not holes.

## Not a bug (by design)

`from_csv`'s `s = s.trim()` is intentional (strips BOM/CRLF from pasted/network
input). Do not "fix" it. `from_tsv` mirrors this.
