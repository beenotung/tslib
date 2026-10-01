# Increase test coverage

Goal: raise test coverage across the library.

Current baseline: **~66% statements / 68% lines** over 76 files.

## Context

**121** top-level `src/*.ts` files (excluding `src/index.ts`), **177** `.ts` files
under `src/` total, but only **36** `*.spec.ts` files in `test/`.

## Plan

- [ ] list untested modules (src files with no matching `test/<name>.spec.ts`)
      and prioritise by usage/risk rather than raw line count
- [ ] add tests for the highest-value untested modules
- [ ] add a coverage threshold once a baseline is established
- [ ] keep new modules covered as they are added (see the `tasks/*.md` +
      `_index.md` convention)

## Status

- [ ] prioritise untested modules
- [ ] add tests
