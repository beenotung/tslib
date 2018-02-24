import {TaskPool} from "../src/task/task-pool";

const pool = new TaskPool(2);
for (let i = 0; i < 10; i++) {
  pool.run(() => console.log(`running`, i))
    .then(c => c ? console.log(c) : c)
    .catch(e => console.error(e));
}
