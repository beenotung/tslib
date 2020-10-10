import { pipe } from '../src/pipe'

test('pipe', () => {
  expect(
    pipe(
      [[(x: number) => x + 2], [(x: number, y: number) => x * 2 + y, [5]]],
      2,
    ),
  ).toEqual(13)
})
