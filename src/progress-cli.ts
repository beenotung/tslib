/** @default 'to-be-replaced' */
type Mode = 'to-be-replaced' | 'do-not-replace'

type Options = {
  /** @default process.stderr */
  out?: NodeJS.WriteStream
  /** @default ' ' */
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
        this.lastMessageLength += message.length + countFullWidthChars(message);
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
    const newMessageLength = message.length + countFullWidthChars(message);
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

function countFullWidthChars(str: string): number {
  let count = 0;
  for (const char of str) {
    const code = char.charCodeAt(0);
    // Full-width characters range
    if (
      (code >= 0xFF00 && code <= 0xFFEF) ||  // Full-width ASCII & punctuations
      (code >= 0x4E00 && code <= 0x9FFF) ||  // Chinese characters
      (code >= 0x3000 && code <= 0x303F) ||  // Chinese punctuations & full-width space
      (code >= 0x3040 && code <= 0x30FF)     // Japanese kana
    ) {
      count++;
    }
  }
  return count;
}