import { later } from '../src/async/wait'
import { TaskPool } from '../src/task/task-pool'

const pool = new TaskPool(2)
for (let i = 0; i < 10; i++) {
  pool
    .runTask(
      () =>
        new Promise(async (resolve, reject) => {
          console.log('begin', i)
          await later(1000)
          console.log(' end ', i)
          resolve()
        }),
    )
    .then(c => (c ? console.log(c) : c))
    .catch(e => console.error(e))
}
