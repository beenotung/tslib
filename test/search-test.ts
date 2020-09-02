import { search } from '../src/search'

function test(a: object, b: string | object) {
  console.log({ a, b, res: search.object_contain_str(a, b) })
}

test({ user: 'Alice Li' }, 'alice')
test({ users: [{ user: 'Alice May' }] }, 'alice')
test({}, 'alice')
