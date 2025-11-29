import { startTimer } from '../src/timer'
import { later } from '../src/async/wait'

async function main() {
  let timer = startTimer('process files')

  timer.setEstimateProgress(5)

  for (let i = 1; i <= 5; i++) {
    // timer.tick()
    timer.progress(` (${i}/5 测试中)`)
    await later(1000)
  }

  timer.end()
}
main().catch(e => console.error(e))
