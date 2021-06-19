import { getLocalStorage, Store } from '../src/store'
import { expect } from 'chai'

describe('store.ts TestSuit', () => {
  const key = 'store-test'
  let store: Store
  it('should load store', () => {
    store = Store.create(getLocalStorage('data'))
  })
  it('should set & get object', () => {
    store.setObject(key, 0)
    expect(store.getObject(key)).to.equal(0)
  })
})
