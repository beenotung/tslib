import { startTimer } from '../src/timer'

let timer = startTimer('test')
let n = 1000 ** 3 / 4
timer.setEstimateProgress(n)
for (let i = 0; i < n; i++) {
  timer.tick()
}
timer.end()
