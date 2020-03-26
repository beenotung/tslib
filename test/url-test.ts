import { parseURLSearchParams } from '../src/url';

function test(url: string) {
  console.log('input:', url);
  let output = parseURLSearchParams(url, { parse: 'json' });
  console.log('output:', output);
}

test('https://stackoverflow.com/questions/38600436/how-to-url-encode-chinese-characters?q=%E4%B8%AD%E6%96%87');
test('?name=Alice&age=18&weight=1.2&height=1.2.3&foo[0]=1&foo[2]=2');
test('a=b&c=d')
