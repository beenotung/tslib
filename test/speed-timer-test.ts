import { createSpeedTimer } from '../src/speed-timer'

const timer = createSpeedTimer()

function createWorker(interval = 0) {
  let timeout: any

  function start() {
    timer.tick()
    timeout = setTimeout(start, interval)
  }

  function stop() {
    clearTimeout(timeout)
  }

  return { start, stop }
}

const N = 8
const Timeout = 3 * 1000
const workers = new Array(N).fill(0).map(() => createWorker())

timer.start()
workers.forEach(worker => worker.start())

const reportTimer = setInterval(() => timer.report(), 1 * 1000)

setTimeout(() => {
  clearInterval(reportTimer)
  timer.pause()
  workers.forEach(worker => worker.stop())
  timer.report()
}, Timeout)
