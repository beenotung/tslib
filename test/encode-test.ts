import {urlEncode} from "../src/encode";

function test(s: any) {
  s = JSON.stringify(s);
  console.log({
    before: s
    , after: urlEncode(s)
  });
}

test({
  name: "tester"
});
test({
  name: "tester=123"
});
test({
  name: "tester&123"
});
test({
  name: "1+2*3/4^5\\6 7&8=9"
});
