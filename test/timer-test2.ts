import { later } from '../src/async/wait'
import { startTimer } from '../src/timer'

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

  timer.next('stress test')
  let n = 100000000
  timer.setProgress(n, 0, 1000)
  for (let i = 0; i < n; i++) {
    timer.tick()
  }

  timer.next('progress prediction test')
  n = 10
  timer.setProgress({ totalTick: n, estimateTime: true, sampleOver: 1 })
  for (let i = 0; i < n; i++) {
    await later(1000)
    timer.tick()
  }

  timer.end()
}

main()
