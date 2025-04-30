import { sleep } from '../src/async/wait'
import { startTimer } from '../src/timer'

async function main() {
  let timer = startTimer('convert video')

  timer.setEstimateProgress(12.3456789, 0)

  timer.tick()
  timer.tick(1.23456789)
  timer.tick(1.23456789)
  await sleep(5000)
  timer.end()
}
main().catch(e => console.error(e))
