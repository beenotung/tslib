import { countFileLineSync } from '../src/wc'
import { expect } from 'chai'

describe('wc.ts TestSuit', () => {
  it('should count file line', () => {
    expect(countFileLineSync('mk-package.js')).to.equals(4)
  })
})
