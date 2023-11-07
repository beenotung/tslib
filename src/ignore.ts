import { appendFileSync, existsSync, readFileSync } from 'fs'

export function appendIgnoreLine(file: string, line: string) {
  line = line.trim()
  if (existsSync(file)) {
    let text = readFileSync(file).toString()
    let hasLine = text.split('\n').some(eachLine => {
      eachLine = eachLine.trim()
      return (
        eachLine == line || eachLine + '/' == line || eachLine == line + '/'
      )
    })
    if (hasLine) return
    if (!text.endsWith('\n')) {
      line = '\n' + line
    }
  }
  appendFileSync(file, line + '\n')
}
