import { countFileLineSync } from '../src/wc'

describe('wc.ts TestSuit', () => {
  it('should count file line', () => {
    expect(countFileLineSync('mk-package.js')).toBe(4)
  })
})
