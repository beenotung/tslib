import { format_time_duration } from './format'
import { eraseChars } from './node'

export type StartTimerOptions =
  | string
  | {
      name: string
      writeStream?: NodeJS.WriteStream
      /** @default 1 */
      /** @example sample 1 over 10 for 10% progress report */
      sampleOver?: number
      /** @default false */
      estimateTime?: boolean
      /** @default 5000 */
      sampleTimeInterval?: number
    }

export type SetProgressOptions = {
  totalTick: number
  /** @default 0 */
  initialTick?: number
  /** @default previous value */
  sampleOver?: number
  /** @default false */
  estimateTime?: boolean
  /** @default previous value */
  sampleTimeInterval?: number
}
export type SetProgress = ((
  totalTick: number,
  initialTick?: number,
  sampleOver?: number,
) => void) &
  ((options: SetProgressOptions) => void)

export type Timer = ReturnType<typeof startTimer>

/**
 * @description create timer with progress report and finish-time estimation
 * */
export function startTimer(options: StartTimerOptions) {
  let name: string | undefined
  let writeStream: NodeJS.WriteStream
  let sampleOver: number
  let estimateTime = false
  let sampleTimeInterval: number
  if (typeof options === 'string') {
    name = options
    writeStream = defaultTimerWriteStream()
    sampleOver = 1
    sampleTimeInterval = 5000
  } else {
    name = options.name
    writeStream = options.writeStream || defaultTimerWriteStream()
    sampleOver = options.sampleOver || 1
    sampleTimeInterval = options.sampleTimeInterval ?? 5000
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
  let startTime: number
  const start = () => {
    writeStream.write(new Date().toLocaleString() + ': ' + name)
    print(' ...')
    startTime = Date.now()
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
    const usedTime = Date.now() - startTime
    writeStream.write(`${name}: ${format_time_duration(usedTime, 2)}\n`)
    name = undefined
  }
  let totalTick = 0
  let currentTick = 0
  let startTick: number
  let lastSampleTime = 0
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
  const setEstimateProgress = (totalTick: number, sampleRate = 1 / 100) => {
    setProgress({
      totalTick: totalTick,
      estimateTime: true,
      sampleOver: totalTick * sampleRate,
    })
  }
  const tickWithOutSample = (step = 1) => {
    currentTick += step
    tickProgress()
  }
  const updateByInterval = () => {
    const now = Date.now()
    const passed = now - lastSampleTime
    if (passed >= sampleTimeInterval) {
      lastSampleTime = now
      return true
    }
  }
  const tickWithSample = (step = 1) => {
    const oldMod = currentTick % sampleOver
    currentTick += step
    const newMod = currentTick % sampleOver
    if (
      newMod === 0 ||
      newMod < oldMod ||
      (sampleTimeInterval > 0 && updateByInterval())
    ) {
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
    get sampleTimeInterval(): number {
      return sampleTimeInterval
    },
    set sampleTimeInterval(
      /** @description set zero or negative limit to disable update by interval */
      value: number,
    ) {
      sampleTimeInterval = value
    },
    progress,
    setProgress,
    setEstimateProgress,
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
    console.debug.apply(console, arguments as any)
    return true
  }
  return writeStream
}
