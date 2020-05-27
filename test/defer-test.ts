import { createDefer } from '../src/async/defer'

async function test() {
  const defer = createDefer()
  console.log('wait 1 second')
  setTimeout(defer.resolve, 1000)
  await defer.promise
  console.log('ok')
}

test()
