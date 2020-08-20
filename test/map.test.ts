import { mapGetOrThrow } from '../src/map'

describe('Map TestSuit', function() {
  describe('mapGetOrThrow', () => {
    const map = new Map([['foo', 'bar']])
    it('should return existing value', function() {
      expect(mapGetOrThrow(map, 'foo')).toEqual('bar')
    })
    it('should throw error on non-exist key', function() {
      expect(() => mapGetOrThrow(map, 'bar', 'key not found')).toThrow(
        'key not found',
      )
    })
  })
})
