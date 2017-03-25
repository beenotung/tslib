# tslib
rewrite of jslib:
more lightweight and modular

## Why tslib
My original lib [jslib](https://github.com/beenotung/jslib) was build before ES6 was popular, it has a number of ES6-like classes and polyfill which is not following the standard.

This lib is base on ES6 (and Typescript ES7) which should gain more native performance.

This library is influenced by ramda, elixir, haskell.
It also contains utils functions for rxjs and ng2-chart.

## Usage
Just import the ts files directly.

Do not plan to support usage from javascript directly.

## Dependencies impose on client
<dep> "rxjs"
<dep> "@angular/core"
<dep> "@angular/forms"
<dep> "ng2-translate"
<dep> "ionic-angular"

## Remark
 - This lib will not depends on jslib, instead it'll re-implement the features.
 - curry only work for function of length > 0
   - breaking variety function (those who expect to accept variant length of arguments)
   - no effect on function of length 0

## Todo
