import { genJsonValue } from '../src/gen-json';
import { jsonToString, jsonToValues, jsonToValuesString, valuesStringToJson } from '../src/json';
import { deepEqual } from '../src/object';
import { getObjectType } from '../src/type';

console.log('test nested object reference');
let user = { name: 'Alice', posts: [] as any[] };
let post = { title: 'hi', author: user };
user.posts.push(post);
user.posts[-1.1] = post;
let index = {
  users: [user],
  posts: [post],
};
try {
  JSON.stringify(index);
  // should has error
  console.error('should has TypeError: Converting circular structure to JSON');
  process.exit(1);
} catch (e) {
}
let text = jsonToValuesString(index);
console.log('='.repeat(32));
console.log(jsonToValues(index));
console.log('-'.repeat(32));
console.log(JSON.parse(text));
console.log('='.repeat(32));
let json = valuesStringToJson(text);
if (!(json.posts[0].author === json.users[0])) {
  console.error('failed to encode/decode nested json object');
  process.exit(1);
}
if (!json.users[0].posts[-1.1]) {
  console.error('failed to encode array element with non-positive integer key');
  process.exit(1);
}
if (!Array.isArray(json.posts)) {
  console.error('lost array type');
  process.exit(1);
}

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

console.log('test if genJsonValue will deadloop');
let n = 1000;
let progress = new CliProgress();
progress.start(n, 0);
for (let i = 0; i < n; i++) {
  progress.update(i);
  test();
}
progress.stop();

