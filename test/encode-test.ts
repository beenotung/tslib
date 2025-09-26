import { urlEncode } from '../src/encode'

function test(o: object) {
  let native = new URLSearchParams(o as any).toString()
  let custom = urlEncode(o)
  console.log({
    json: JSON.stringify(o),
    native,
    custom,
    re_native: new URLSearchParams(native),
    re_custom: new URLSearchParams(custom),
  })
}

test({
  name: 'tester',
})
test({
  name: 'tester 123',
})
test({
  name: 'tester+123',
})
test({
  name: 'tester=123',
})
test({
  name: 'tester&123',
})
test({
  name: 'tester%123',
})
test({
  name: '1+2*3/4^5\\6 7&8=9',
})
test({
  items: [1, 2, 3],
})
test({
  items: ['1', '2', '3'],
})
test({
  user: { id: 1, username: 'tester' },
})
test({
  name: null,
})
