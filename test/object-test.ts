import { deepEqual } from '../src/object';
import { getObjectType } from '../src/type';

function test(a, b, answer) {
  let result = deepEqual(a, b);
  if (result !== answer) {
    throw new Error('wrong deepEqual impl for type: ' + getObjectType(a) + ' and ' + getObjectType(b));
  }
}

test(1, 1, true);

let aSet = new Set([1, 2]);
let bSet = new Set([1, 2]);
test(aSet, bSet, true);
bSet.add(3);
test(aSet, bSet, false);

let aMap = new Map();
aMap.set('key', aSet);
let bMap = new Map();
bMap.set('key', bSet);
test(aMap, bMap, false);
bMap.set('key', aSet);
test(aMap, bMap, true);

test(new Date(123), new Date(123), true);

test(1, '1', false);
