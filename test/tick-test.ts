import { later } from '../src/async/wait'
import { startTimer } from '../src/timer'
import { Random } from '../src/random'

async function main() {
  const timer = startTimer('multi step tick')
  const n = 20
  timer.setProgress({ totalTick: n, estimateTime: true })
  let step = 0
  for (let i = 0; i < n; i++) {
    await later(500)
    step++
    Random.probablyRun(1 / 2, () => {
      timer.tick(step)
      step = 0
    })
  }
  timer.end()
}
main()
