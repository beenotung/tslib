import { expect } from 'chai'
import { search } from '../src/search'

describe('search.ts spec', () => {
  it('Test search', () => {
    function test(a: object, b: string | object, expected: boolean) {
      expect(search.object_contain_str(a, b)).to.equals(expected)
    }

    test({ user: 'Alice Li' }, 'alice', true)
    test({ users: [{ user: 'Alice May' }] }, 'alice', true)
    test({}, 'alice', false)
  })
})
