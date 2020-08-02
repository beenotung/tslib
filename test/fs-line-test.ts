import { iterateFileByLine, IterateFileByLineOptions } from '../src/fs'
import { Random } from '../src/random'

const file = 'res/db.txt'
let lines = 0
let words = 0
const opts: IterateFileByLineOptions = {}
for (const line of iterateFileByLine(file, opts)) {
  lines++
  words += line.length
  const l = lines.toLocaleString()
  const w = words.toLocaleString()
  Random.probablyRun(1 / 1000, () =>
    process.stdout.write(`\r  lines: ${l} words: ${w}`),
  )
  if (lines > 10000) {
    opts.close!()
    break
  }
}
{
  const l = lines.toLocaleString()
  const w = words.toLocaleString()
  process.stdout.write(`\r  lines: ${l} words: ${w}`)
}
console.log()
