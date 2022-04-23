# tslib

utils library in Typescript

[![npm Package Version](https://img.shields.io/npm/v/@beenotung/tslib)](https://www.npmjs.com/package/@beenotung/tslib)
[![npm Package Version](https://img.shields.io/npm/dm/@beenotung/tslib)](https://www.npmtrends.com/@beenotung/tslib)

## Why tslib

My original lib [jslib](https://github.com/beenotung/jslib) was build before ES6 was popular, it has a number of ES6-like classes and polyfill which is not compatible with the standard.

This lib is base on ES6 (and Typescript ES7) which should gain more native performance.

This library is influenced by ramda, elixir, haskell.

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

- increase test coverage

## License

This is a Free and Open Source Software (FOSS) licensed under
[BSD-2-Clause](./LICENSE)
