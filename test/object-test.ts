import test from 'tape'
import { deepEqual, objectToValues, valuesToObject } from '../src/object'
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
