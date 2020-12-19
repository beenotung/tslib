import { expect } from 'chai'
import { test } from 'mocha'
import { pipe } from '../src/pipe'

describe('pipe.ts spec', () => {
  test('pipe()', () => {
    expect(pipe([[x => x + 2], [(x, y) => x * 2 + y, [5]]], 2)).to.equals(13)
  })
})
