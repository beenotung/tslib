export function catchMain(p: Promise<any>): void {
  p.catch(e => {
    console.error(e)
    process.exit(1)
  })
}

export function eraseChars(writeStream: NodeJS.WriteStream, n: number) {
  if (n < 1) {
    return
  }
  writeStream.write(' '.repeat(n))
  if (writeStream.moveCursor) {
    writeStream.moveCursor(-n, 0)
  }
}

export type StartTimerOptions =
  | string
  | {
      name: string
      writeStream?: NodeJS.WriteStream
    }

const defaultWriteStream = () => process.stdout

export function startTimer(options: StartTimerOptions) {
  let name: string | undefined
  let writeStream: NodeJS.WriteStream
  if (typeof options === 'string') {
    name = options
    writeStream = defaultWriteStream()
  } else {
    name = options.name
    writeStream = options.writeStream || defaultWriteStream()
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
  let total = 0
  let tick = 0
  const progress = (msg: string) => {
    print(msg)
  }
  const tickProgress = () => {
    progress(` (${tick}/${total})`)
  }
  return {
    end,
    next(newName: string) {
      end()
      name = newName
      start()
    },
    progress,
    setProgress(totalTick: number, initialTick = 0) {
      total = totalTick
      tick = initialTick
      tickProgress()
    },
    tick() {
      tick++
      tickProgress()
    },
  }
}
