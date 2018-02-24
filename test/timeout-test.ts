import {timeoutPromise} from "../src/async/timeout-promise";
import {createLock} from "../src/lock";
import {checkPromise} from "../src/async/checked-promise";

async function main() {
  const lock = createLock(2);
  console.log(1);
  await lock.acquire(1);
  console.log(2);
  await lock.acquire(1);
  console.log(3);
  lock.release(1);
  console.log(4);
  await lock.acquire(1);
  console.log(5);
}

checkPromise(timeoutPromise(main(), 5000, "acquire lock"));
