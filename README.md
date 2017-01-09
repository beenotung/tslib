# tslib
rewrite of jslib:
more lightweight and modular

## Why tslib
My original lib [jslib](https://github.com/beenotung/jslib) was build before ES6 was popular, it has a number of ES6-like classes and polyfill which is not following the standard.

This lib is base on ES6 (and Typescript ES7) which should gain more native performance.

Also, this lib will utilize ramda (maybe and rxjs) to reduce the LOC (=> more easy for others to pick up the lib user's code)

## Usage
Just import the ts files directly.

Do not plan to support usage from javascript directly.

## Remark
This lib will not depends on jslib, instead it'll re-implement the features.

## Unsure Remark
This lib is on top of [ramda.js](https://github.com/ramda/ramda)

~~This lib is kind of rewrite of ramda.js in pure ts, but w & w/o something~~

## Todo
 - remove dependency on ramdajs / provide wrapper with type
   - the package in @types/npm-ramda is out dated
   - I failed to update that package
