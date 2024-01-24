/** @default 'to-be-replaced' */
type Mode = 'to-be-replaced' | 'do-not-replace'

type Options = {
  /** @default process.stderr */
  out?: NodeJS.WriteStream
  /** @default ' '' */
  replaceChar?: string
}

export class ProgressCli {
  private lastMessageLength = 0
  private writeStream: NodeJS.WriteStream
  private replaceChar: string

  constructor(options: Options = {}) {
    this.writeStream = options.out || process.stderr
    this.replaceChar = options.replaceChar || ' '
  }

  write(message: string, mode?: Mode) {
    this.writeStream.write(message)
    if (mode != 'do-not-replace') {
      const index = message.lastIndexOf('\n')
      if (index == -1) {
        this.lastMessageLength += message.length
      } else {
        this.lastMessageLength = message.length - index
      }
    }
  }

  writeln(message: string) {
    this.writeStream.write(message + '\n')
    this.lastMessageLength = 0
  }

  update(message: string) {
    const { writeStream, lastMessageLength } = this
    const newMessageLength = message.length
    if (writeStream.moveCursor) {
      writeStream.moveCursor(-lastMessageLength, 0)
      writeStream.write(message)
      const excessMessageLength = lastMessageLength - newMessageLength
      if (excessMessageLength > 0) {
        writeStream.write(this.replaceChar.repeat(excessMessageLength))
        writeStream.moveCursor(-excessMessageLength, 0)
      }
    } else {
      writeStream.write('\n' + message)
    }
    this.lastMessageLength = newMessageLength
  }

  nextLine() {
    this.writeStream.write('\n')
    this.lastMessageLength = 0
  }
}
