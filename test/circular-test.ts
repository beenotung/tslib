import { ensureNonCyclic } from '../src/object';
import { inspect } from 'util';

let user = { _id: 'user-123' };
// (user as any).self = user;
let x = {
  shops: [{ _id: 'shop-123', owner: user }],
  users: [user, { _id: 'user-456' }],
};
// console.log('x:', inspect(JSON.parse(JSON.stringify(x)), { depth: 999 }));
let y = ensureNonCyclic(x);
console.log('y:', inspect(y, { depth: 999 }));
console.log('pass:', JSON.stringify(x) === JSON.stringify(y));
