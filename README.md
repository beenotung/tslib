# tslib
utils library in Typescript

## Why tslib
My original lib [jslib](https://github.com/beenotung/jslib) was build before ES6 was popular, it has a number of ES6-like classes and polyfill which is not following the standard.

This lib is base on ES6 (and Typescript ES7) which should gain more native performance.

This library is influenced by ramda, elixir, haskell.
It also contains utils functions for rxjs and ng2-chart.

## Installation

### Install from git
```bash
mkdir -p lib
cd lib
git submodule add https://github.com/beenotung/tslib.git
```

### Install from npm
```bash
npm install @beenotung/tslib
```

## Remark
 - curry only work for function of length > 0
   - breaking variety function (those who expect to accept variant length of arguments)
   - no effect on function of length 0

## Todo
