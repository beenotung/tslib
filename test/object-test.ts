import test from 'tape'
import {
  deepEqual,
  objectGetOrSetDefault,
  objectPick,
  objectToValues,
  valuesToObject,
} from '../src/object'
import { getObjectType } from '../src/type'

test('deepEqual', t => {
  function test(a: any, b: any, answer: boolean) {
    const result = deepEqual(a, b)
    t.true(result === answer, Object.prototype.toString.call(a))
    if (result !== answer) {
      throw new Error(
        'wrong deepEqual impl for type: ' +
          getObjectType(a) +
          ' and ' +
          getObjectType(b),
      )
    }
  }

  test(1, 1, true)

  const aSet = new Set([1, 2])
  const bSet = new Set([1, 2])
  test(aSet, bSet, true)
  bSet.add(3)
  test(aSet, bSet, false)

  const aMap = new Map()
  aMap.set('key', aSet)
  const bMap = new Map()
  bMap.set('key', bSet)
  test(aMap, bMap, false)
  bMap.set('key', aSet)
  test(aMap, bMap, true)

  test(new Date(123), new Date(123), true)

  test(1, '1', false)
  t.end()
})

test('object values', t => {
  const user = {
    user_id: 123,
    username: 'Alice',
    friends: [1, 2, 3],
  }
  const keys: Array<keyof typeof user> = ['user_id', 'username', 'friends']
  const values = objectToValues(user, keys)
  const res: typeof user = valuesToObject(values, keys)
  t.deepEquals(res, user, `objectToValues -> valuesToObject`)
  t.end()
})

test('objectGetOrSetDefault', t => {
  const object: Record<string, any> = {}
  const value = { user: 'Alice' }
  t.equal(
    objectGetOrSetDefault(object, 'a', () => value),
    value,
    'set default value',
  )
  t.equal(
    objectGetOrSetDefault(object, 'a', () => ({ user: 'Bob' })),
    value,
    'get existing value',
  )
  t.equal(
    objectGetOrSetDefault(object, 'b', () => 2),
    2,
    'set new value',
  )
  t.end()
})

test('objectPick', t => {
  const user = { name: 'Alice', age: 12 }
  t.deepEqual(objectPick(user, ['name', 'age']), user, 'pick all props')
  t.deepEqual(objectPick(user, ['name']), { name: user.name }, 'pick one prop')
  t.deepEqual(objectPick(user, []), {}, 'pick zero prop')
  t.end()
})
