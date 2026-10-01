# Fix coverage report (nyc reports 0%)

Goal: make `npm run report` / `npm run coverage` report real coverage numbers.

## Symptom

`nyc` reports `0%` for every file, and `coverage/lcov.info` is empty (0 lines).
The HTML report at `coverage/lcov-report/index.html` shows all zeros.

## Root cause

`nyc` instruments code by injecting a preload hook **via `NODE_OPTIONS`**:

```
NODE_OPTIONS inside nyc = " --require .../node-preload/node-preload.js"
```

But the `mocha` script **assigns** `NODE_OPTIONS` instead of appending to it,
which clobbers nyc's injected hook:

```json
"mocha": "NODE_OPTIONS='--no-experimental-strip-types' ts-mocha \"{src,test}/**/*.spec.ts\""
```

So nothing is instrumented and coverage is all zeros.

## When it broke

The inline `NODE_OPTIONS=...` was added in commit `9ae653d` (2025-12-13,
"chore: fix ts-mocha usage to allow using enum in test cases"). Before that the
script was just `ts-mocha ...`, so nyc's `NODE_OPTIONS` survived and coverage
worked. The commit fixed an unrelated enum/`--experimental-strip-types` issue and
silently broke coverage as a side effect.

## Evidence

Reproduced by varying only the `NODE_OPTIONS` handling:

| command                                     | result             |
| ------------------------------------------- | ------------------ |
| `nyc npm run mocha` (current)               | `All files 0%`     |
| `nyc` + mocha **without** the env override  | `All files 25.93%` |
| `NODE_OPTIONS="..."` **appended**, then nyc | `All files 66.77%` |

## Fix

Append to `NODE_OPTIONS` instead of overwriting it:

```json
"mocha": "NODE_OPTIONS=\"${NODE_OPTIONS:+$NODE_OPTIONS }--no-experimental-strip-types\" ts-mocha \"{src,test}/**/*.spec.ts\""
```

`${NODE_OPTIONS:+...}` only prepends when it is already set, so it works both
with nyc wrapping (hook preserved) and plain `npm run mocha` (env unset).

The `--no-experimental-strip-types` flag is still required — without it the enum
test fails with `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX` on Node v24.

## Config

`all: true` in `.nycrc.json` so files with no tests are included in the report
instead of being omitted — otherwise the denominator silently shrinks and the
figure inflates as untested files are added:

```json
{
  "all": true,
  "include": "src/**/*.ts",
  "exclude": "src/**/*.{test,spec}.ts"
}
```

`all` is placed first so the diff is a plain insertion (no trailing-comma churn
on `exclude`).

## Verified

| command                  | before            | after                         |
| ------------------------ | ----------------- | ----------------------------- |
| `npm run mocha`          | 434 passing       | 434 passing                   |
| `npm run coverage`       | `All files 0%`    | `All files 66.26%` (76 files) |
| `npm run report:update`  | empty `lcov.info` | 6382 lines                    |
| `lcov-report/index.html` | all zeros         | 66.26% / 60.87%               |

Note: without `all` the report showed 67.09% over 70 files — slightly higher
because untested files were excluded.

## Caveat

The fix uses shell parameter expansion, which requires `sh`/`bash`. npm scripts
run through `sh` on Linux/macOS, so this is fine there; it would not work on
native Windows `cmd`.
