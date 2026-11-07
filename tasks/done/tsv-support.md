# TSV support (tab-separated values)

Goal: decide and document how `src/csv.ts` handles **TSV**, which is a different
format from RFC 4180 CSV — not merely CSV with a tab delimiter.

## Why

`from_csv` / `to_csv` take a `separator` argument, so passing `'\t'` looks like
TSV but is actually a **quoted-tab dialect**: it keeps RFC 4180 quoting/escaping
(a quoted field may contain a tab or a newline). That is _not_ the registered
`text/tab-separated-values` format.

The IANA TSV registration is line-oriented and has **no escaping**:

```
field    ::= [character]+
record   ::= field [TAB field]+ EOL
```

- "Each record is represented as a single line."
- "Note that fields that contain tabs are not allowable in this encoding."
- Quotes are never mentioned, so `"` is **literal data** with no wrapping /
  escaping meaning. A newline in a field is impossible (it ends the record).

### Why this matters

Google Sheets "Download as TSV" flattens in-cell newlines to spaces (a conforming
workaround, since the format can't hold them), while "Download as CSV" preserves
them by quoting. So the two exports differ in **fidelity**, not just delimiter —
e.g. an exported log sheet kept all 4,407 multi-line remarks in CSV and none in
TSV.

## Decision (current)

- `to_csv(rows, '\t')` stays a **quoted-tab dialect** — it round-trips
  multi-line / tab-containing fields. No newline→space flattening (that would be
  lossy and just replicate Google's data-loss behaviour).
- For **strict** IANA TSV, use a dedicated module `src/tsv.ts` rather than
  branching `to_csv` on `separator === '\t'`:
  - `from_tsv(text)` / `to_tsv(rows)` + `TAB` and `THROW` constants in `src/tsv.ts`
  - no quoting/escaping — a `"` is literal data
  - `to_tsv` **throws** by default on a field containing a tab or newline
  - `from_tsv` treats each line as one record
- `to_tsv` accepts `TSVOptions` (`{ tab?, newline? }`) as an **opt-in** to
  substitute the unrepresentable chars instead of throwing:
  - each key is `string | THROW`; omitted or `THROW` = throw (default)
  - suggested patterns: space `' '`, escape `'\\t'` / `'\\n'`, marker `'<tab>'`
    / `'<br>'` / `'[tab]'`
  - `\r\n` is matched as **one** line break (`/\r\n|\r|\n/`), so it becomes one
    replacement, not two
  - substitution is **lossy and not reversible** — on read the replacement
    cannot be told apart from the same literal text; use `to_csv(rows, TAB)` for
    round-trip
  - `from_tsv` stays strict (no options): any substitution must be undone by the
    caller before parsing
- Why a separate module (not a branch in `csv.ts`): strict TSV is a _different
  algorithm_ (no quoting, tabs/newlines unrepresentable), and branching would
  overload `separator` from "field separator" into "which format spec to
  follow" — and break the clean `from_csv`/`to_csv` inverse. A separate file also
  matches the repo's one-format-per-file pattern (`csv.ts`, `xlsx.ts`).
- `csv.ts` is unchanged: `to_csv(rows, '\t')` / `from_csv(text, '\t')` remain the
  quoted-tab dialect. `TAB` is exported from `tsv.ts`.

### Why `split/join` (not `replaceAll`)

`to_tsv` uses `field.split(sep).join(repl)` for both substitutions. Reasons, in
priority order:

1. **Literal replacement (correctness).** A _string_ passed to `replaceAll` is
   not literal — `$&`, `` $` ``, `$'`, `$$` are expanded (`"a\tb"` +
   `replaceAll("\t", "$&")` keeps the real tab, silently producing invalid TSV).
   The `tab`/`newline` values are user-supplied, so `$` can appear. `split/join`
   is unconditionally literal; `replaceAll(sep, () => repl)` would also work but
   needs the `() =>` and a comment.
2. **No `/g` footgun.** `split(/…/)` needs no global flag; `replaceAll(/…/)`
   throws `TypeError` without `g`.
3. **Allocation (measured).** With a function replacement, `replaceAll` invokes
   the callback once per match, so it allocates more. GC scavenges (9-newline
   field, 3M iters): split/join **1214**, regex `replaceAll` 1466, 3×
   `replaceAll` 1488. The gap widens with match count; `split/join` scales with
   parts, not matches.
4. **Speed is a wash for real data.** Sample log: 0% fields with a tab, 6.5%
   with a newline, median 2 / p99 9 occurrences among triggered fields. At that
   scale the difference is ~0.1µs/field. For 4 newline alternatives measured
   (`3×split/join`, `3×replaceAll`, `1×regex replaceAll`, `1×regex split/join`),
   the regex `split/join` was fastest in every shape, so it is kept.

Note: micro-benchmark numbers are V8-version-dependent; the ranking was stable
across runs, but treat absolute figures as indicative.

## Done

- [x] decide the API → separate `src/tsv.ts` module
- [x] implement strict TSV (no quoting; throw on tab/newline in a field)
- [x] export `TAB` constant from `tsv.ts`
- [x] add regression tests (round-trip, quote-as-literal, newline-is-record,
      reject tab, reject newline, options substitution/CRLF/THROW) in
      `test/tsv.spec.ts`
- [x] `tsc` clean; full suite 422 passing; `npm run build` regenerates
      `index.ts` + `dist`

## Related findings

The `src/csv.ts` findings found while investigating were split into
[fix-csv-findings.md](./fix-csv-findings.md). The `from_csv` `trim()` behaviour
is not a bug (by design) — see that file.

## Status

- [x] decide scope (separate `src/tsv.ts` module)
- [x] implement `from_tsv` / `to_tsv` + `TAB` in `src/tsv.ts`
- [x] add `test/tsv.spec.ts`
- [x] move this file to `tasks/done/` (findings split into
      [fix-csv-findings.md](./fix-csv-findings.md))
