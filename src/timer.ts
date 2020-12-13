import { format_time_duration } from './format'
import { eraseChars } from './node'

export type StartTimerOptions =
  | string
  | {
      name: string
      writeStream?: NodeJS.WriteStream
      // default: 1
      // e.g. sample 1 over 10 for 10% progress report
      sampleOver?: number
      // default: false
      estimateTime?: boolean
    }

export type SetProgressOptions = {
  totalTick: number
  initialTick?: number // default zero
  sampleOver?: number // default previous value
  estimateTime?: boolean // default false
}
export type SetProgress = ((
  totalTick: number,
  initialTick?: number,
  sampleOver?: number,
) => void) &
  ((options: SetProgressOptions) => void)

export function startTimer(options: StartTimerOptions) {
  let name: string | undefined
  let writeStream: NodeJS.WriteStream
  let sampleOver: number
  let estimateTime = false
  if (typeof options === 'string') {
    name = options
    writeStream = defaultTimerWriteStream()
    sampleOver = 1
  } else {
    name = options.name
    writeStream = options.writeStream || defaultTimerWriteStream()
    sampleOver = options.sampleOver || 1
  }
  let msgLen = 0
  const print = (msg: string) => {
    if (writeStream.moveCursor) {
      writeStream.moveCursor(-msgLen, 0)
    }
    writeStream.write(msg)
    const newMsgLen = msg.length
    eraseChars(writeStream, msgLen - newMsgLen)
    msgLen = newMsgLen
  }
  const start = () => {
    writeStream.write(new Date().toLocaleString() + ': ' + name)
    print(' ...')
    // tslint:disable-next-line no-console
    console.time(name)
  }
  start()
  const end = () => {
    if (!name) {
      return // already ended before
    }
    print('')
    if (writeStream.moveCursor) {
      writeStream.moveCursor(-name.length, 0)
    }
    // tslint:disable-next-line no-console
    console.timeEnd(name)
    name = undefined
  }
  let totalTick = 0
  let currentTick = 0
  let startTick: number
  let startTime: number
  const progress = (msg: string) => {
    print(msg)
  }
  const tickProgressWithoutEstimateTime = () => {
    progress(` (${currentTick}/${totalTick})`)
  }
  const tickProgressWithEstimateTime = () => {
    const tickLeft = totalTick - currentTick
    const tickedAmount = currentTick - startTick
    const tickedTime = Date.now() - startTime
    const tickSpeed = tickedAmount / tickedTime
    const timeLeft = tickLeft / tickSpeed
    const timeLeftText = format_time_duration(timeLeft)
    progress(
      ` (${currentTick}/${totalTick}, estimated time left: ${timeLeftText})`,
    )
  }
  let tickProgress = estimateTime
    ? tickProgressWithEstimateTime
    : tickProgressWithoutEstimateTime
  const setProgress: SetProgress = (
    totalTick_or_options: number | SetProgressOptions,
    _initialTick?: number,
    _sampleOver?: number,
  ) => {
    if (typeof totalTick_or_options === 'object') {
      const option = totalTick_or_options
      totalTick = option.totalTick
      currentTick = option.initialTick || 0
      sampleOver = option.sampleOver || sampleOver
      if (typeof option.estimateTime === 'boolean') {
        estimateTime = option.estimateTime
        tickProgress = estimateTime
          ? tickProgressWithEstimateTime
          : tickProgressWithoutEstimateTime
      }
    } else {
      totalTick = totalTick_or_options
      currentTick = _initialTick || 0
      if (_sampleOver) {
        sampleOver = _sampleOver
      }
    }
    timer.tick = sampleOver === 1 ? tickWithOutSample : tickWithSample
    if (estimateTime) {
      startTick = currentTick
      startTime = Date.now()
    }
    tickProgress()
  }
  const tickWithOutSample = (step = 1) => {
    currentTick += step
    tickProgress()
  }
  const tickWithSample = (step = 1) => {
    const oldMod = currentTick % sampleOver
    currentTick += step
    const newMod = currentTick % sampleOver
    if (newMod === 0 || newMod < oldMod) {
      tickProgress()
    }
  }
  const timer = {
    end,
    next(newName: string) {
      end()
      name = newName
      start()
    },
    progress,
    setProgress,
    tick: sampleOver === 1 ? tickWithOutSample : tickWithSample,
  }
  return timer
}

export function defaultTimerWriteStream(): NodeJS.WriteStream {
  if (typeof process !== 'undefined' && process.stdout) {
    return process.stdout
  }
  const writeStream: NodeJS.WriteStream = {} as any
  writeStream.write = function() {
    // tslint:disable-next-line no-console
    console.debug.apply(console, arguments as any)
    return true
  }
  return writeStream
}
