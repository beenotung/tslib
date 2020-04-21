import test from 'tape'
import { pipe } from '../src/pipe'

test('pipe', t => {
  t.equal(
    pipe(
      [[(x: number) => x + 2], [(x: number, y: number) => x * 2 + y, [5]]],
      2,
    ),
    13,
  )
  t.end()
})
