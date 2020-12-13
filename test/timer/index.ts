import { startTimer } from '../../src/timer'

const timer = startTimer('test timer')
const n = 1000
timer.setProgress({ totalTick: n, estimateTime: true, sampleOver: n / 10 })

function loop(n: number) {
  if (n > 0) {
    timer.tick()
    setTimeout(loop, 0, n - 1)
  } else {
    timer.end()
  }
}

setTimeout(loop, 0, n)
