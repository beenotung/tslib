import { later } from '../src/async/wait'
import { startTimer } from '../src/node'

async function main() {
  const timer = startTimer('first task')
  await later(100)
  timer.next('second task')
  timer.setProgress(2)
  await later(1500)
  timer.tick()
  await later(1000)
  timer.tick()
  await later(500)
  timer.end()
  console.log('some extra information')
  timer.next('last task')
  await later(200)
  timer.end()
}

main()
