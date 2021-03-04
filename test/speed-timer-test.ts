import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from 'fs'
import path from 'path'
import { createSpeedTimer } from '../src/speed-timer'

const timer = createSpeedTimer()
timer.start()
timer.pause()

if (!existsSync('tmp')) {
  mkdirSync('tmp')
}

const N = 100000
const reportInterval = N / 5
for (let i = 0; i < N; i++) {
  const file = path.join('tmp', i + '.tmp')
  timer.resume()
  writeFileSync(file, i.toString())
  readFileSync(file)
  timer.tick()
  timer.pause()
  unlinkSync(file)
  if (i % reportInterval === 0) {
    timer.report()
  }
}
timer.report()

rmdirSync('tmp')
