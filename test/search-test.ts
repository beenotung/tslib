import {search} from "../src/search";

function test(a, b) {
  console.log({a, b, res: search.object_contains(a, b)});
}

test({user: 'Alice Li'}, 'alice');
test({users: [{user: "Alice May"}]}, 'alice');
test({}, 'alice');
