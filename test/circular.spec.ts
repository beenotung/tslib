import { expect } from 'chai'
// import { inspect } from 'util'
import { ensureNonCyclic } from '../src/object'

describe('circular TestSuit', () => {
  it('Test ensureNonCyclic()', () => {
    const user = { _id: 'user-123' }
    // (user as any).self = user;
    const x = {
      shops: [{ _id: 'shop-123', owner: user }],
      users: [user, { _id: 'user-456' }],
    }
    // console.log('x:', inspect(JSON.parse(JSON.stringify(x)), { depth: 999 }));
    const y = ensureNonCyclic(x)
    // console.log('y:', inspect(y, { depth: 999 }))

    expect(y.shops[0].owner).deep.eq(user)
    expect(y.users[0]).deep.eq(user)
    expect(x).deep.eq(y)
  })
})
