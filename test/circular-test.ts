import { inspect } from 'util'
import { ensureNonCyclic } from '../src/object'

const user = { _id: 'user-123' }
// (user as any).self = user;
const x = {
  shops: [{ _id: 'shop-123', owner: user }],
  users: [user, { _id: 'user-456' }],
}
// console.log('x:', inspect(JSON.parse(JSON.stringify(x)), { depth: 999 }));
const y = ensureNonCyclic(x)
console.log('y:', inspect(y, { depth: 999 }))
console.log('pass:', JSON.stringify(x) === JSON.stringify(y))
