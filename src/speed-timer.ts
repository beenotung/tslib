/**
 * timer measuring time per tick (history)
 * without progress (unbounded)
 * */

export function createSpeedTimer(title = 'Speed:') {
  let startTime = 0
  let pausedTime = 0
  let pauseStartTime = 0
  let ticks = 0

  function start() {
    startTime = Date.now()
  }

  function pause() {
    pauseStartTime = Date.now()
  }

  function resume() {
    const now = Date.now()
    pausedTime += now - pauseStartTime
    pauseStartTime = 0
  }

  function tick() {
    ticks++
  }

  function stats() {
    const now = Date.now()
    let passedTime = now - startTime - pausedTime
    if (pauseStartTime > 0) {
      passedTime -= now - pauseStartTime
    }
    return { passedTime, ticks }
  }

  function report() {
    const { passedTime, ticks } = stats()
    const speed = ticks / (passedTime / 1000)
    // eslint-disable-next-line no-console
    console.log(title, speed.toFixed(2))
  }

  return {
    start,
    pause,
    resume,
    tick,
    stats,
    report,
  }
}
