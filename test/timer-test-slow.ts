import { later } from '../src/async/wait'
import { startTimer } from '../src/timer'

async function main() {
  let timer = startTimer('test')
  let n = 1000
  timer.setEstimateProgress(n)
  timer.sampleTimeInterval = 500
  // timer.sampleTimeInterval = 0
  for (let i = 0; i < n; i++) {
    await later(200)
    timer.tick()
  }
  timer.end()
}
main().catch(e => console.error(e))
