import { genJsonValue } from '../src/gen-json';
import { jsonToString } from '../src/json';
import { deepEqual } from '../src/object';
import { getObjectType } from '../src/type';

let CliProgress = require('cli-progress').Bar;

function jsonSize(o: any): number {
  switch (getObjectType(o)) {
    case 'String':
    case 'Number':
    case 'Null':
    case 'Undefined':
    case 'Boolean':
      return 1;
    case 'Array': {
      let xs: any[] = o;
      return xs.map(x => jsonSize(x)).reduce((acc, c) => acc + c, xs.length);
    }
    case 'Object': {
      let xs = Object.keys(o);
      return xs.map(x => jsonSize(o[x])).reduce((acc, c) => acc + c, xs.length);
    }
    default:
      console.error('unknown json type:', o);
      process.exit(1);
      throw new Error('unknown json type');
  }
}

function test() {
  let o = genJsonValue();
  // let s = JSON.stringify(o);
  if (!'size') {
    console.log('size:', jsonSize(o));
    return;
  }
  let strOwn = jsonToString(o);
  let strNative = JSON.stringify(o);
  if (strOwn.length !== strNative.length) {
    console.log('not match');
  }
  if (strOwn !== strNative) {
    // console.log('not same?');
    let oOwn = JSON.parse(strOwn);
    let oNative = JSON.parse(strNative);
    if (!deepEqual(oOwn, oNative)) {
      console.log('not same');
    }
  }
}

let n = 1000;
let progress = new CliProgress();
progress.start(n, 0);
for (let i = 0; i < n; i++) {
  progress.update(i);
  test();
}
progress.stop();

