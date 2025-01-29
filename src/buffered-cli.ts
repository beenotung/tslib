/**
 * - Print the buffer to cli output stream.
 * - Reset the cursor to the beginning without using `console.clear()` to avoid flickering.
 * - Not accurate, when tab (`\t`) is used without `writeln()` nor newline (`\n`).
 */
export class BufferedCli {
  private buffer = ''
  private lastBuffer = ''
  constructor(private out = process.stdout) {}
  write(message: string) {
    this.buffer += message
  }
  writeln(message: string) {
    this.write(message + '\n')
  }
  private render(buffer: string, lastLines: number[]) {
    const columns = this.out.columns
    let x = 0
    let y = 0
    let output = ''
    const lines: number[] = []
    for (const char of buffer) {
      if (char == '\n') {
        // early jump to next line, may need to fill extra spaces
        const lastX = lastLines[y]
        if (lastX > x) {
          output += ' '.repeat(lastX - x)
        }
        output += '\n'
        lines.push(x)
        x = 0
        y++
        continue
      }
      // add new char to the current line
      output += char
      x++
      if (x == columns) {
        // used full line, move to next line
        lines.push(x)
        x = 0
        y++
      }
    }
    lines.push(x)
    return { output, x, y, lines }
  }
  flush() {
    const { out, buffer, lastBuffer } = this

    const last = this.render(lastBuffer, [])
    const current = this.render(buffer, last.lines)

    if (last.y == 0) {
      out.moveCursor(-last.x, 0)
    } else {
      out.moveCursor(0, -last.y)
      out.cursorTo(0)
    }

    let output = current.output
    let extra = 0

    if (!output.endsWith('\n')) {
      const currentTail = getTailLength(output)
      const lastTail = getTailLength(last.output)
      extra = lastTail - currentTail
      if (extra > 0) {
        output += ' '.repeat(extra)
      }
    }

    out.write(output)

    if (extra > 0) {
      out.moveCursor(-extra, 0)
    }

    this.lastBuffer = buffer
    this.buffer = ''
  }
  end() {
    const { out, lastBuffer } = this
    if (!lastBuffer.endsWith('\n')) {
      out.write('\n')
    }
  }
}

function getTailLength(text: string): number {
  const index = text.lastIndexOf('\n')
  if (index === -1) {
    return text.length
  } else {
    return text.length - index - 1
  }
}
