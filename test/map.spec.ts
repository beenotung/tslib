import { expect } from 'chai'
import { mapGetOrThrow } from '../src/map'

describe('map.ts TestSuit', function() {
  describe('mapGetOrThrow', () => {
    const map = new Map([['foo', 'bar']])
    it('should return existing value', function() {
      expect(mapGetOrThrow(map, 'foo')).to.equals('bar')
    })
    it('should throw error on non-exist key', function() {
      expect(() => mapGetOrThrow(map, 'bar', 'key not found')).to.throws(
        'key not found',
      )
    })
  })
})
