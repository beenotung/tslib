import fs from 'fs'
import path from 'path'
import { createAlphaSmoother } from '../src/stats'
import { DAY } from '../src/time'

fs.mkdirSync('data', { recursive: true })

const smoother = createAlphaSmoother(0.9)

const file = path.join('data', 'trend.csv')
fs.writeFileSync(file, `"date","raw","smooth"\n`)
const N = 500
let acc = N / 2
const now = Date.now()
for (let i = 0; i < N; i++) {
  const delta = ((Math.random() - 0.5) * N) / 2
  acc += delta
  const date = new Date(now + i * DAY).toISOString().split('T')[0]
  fs.appendFileSync(file, `${date},${acc},${smoother.next(acc)}\n`)
}
console.log('saved to', file)
