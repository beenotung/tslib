/**

 In this example of ~1000ms data loading tasks, using data-processor can
 speed up 31555 times compare to one-by-one sync version
 archived ~25% of 'pure processing' performance

 |===
 | mode | average TPS* |

 | sync version with delay
 |      1.77

 | data-processor pipeline
 |  55872.16

 | sync version without delay
 | 222816.40

 |===
 *: rounded to 2 decimal places

 * */
import { later } from '../src/async/wait'
import { format_time_duration } from '../src/format'
import { catchMain } from '../src/node'
import { batchProcess } from '../src/task/data-processor'

const clearLine = () => process.stdout.write('\r' + ' '.repeat(32) + '\r')

const n = 1000 * 1000
const delay = 1000
const keys = new Array(n).fill(0).map((x, i) => i)
const startTime = Date.now()
let last = -1
const delays = keys.map(() => delay * Math.random())

console.log('benchmarking data-processor pipeline')
catchMain(
  batchProcess<number, { key: number; value: string }>({
    maxConcurrent: 1000 * 100,
    keys,
    loader: (key: number) =>
      later(delays[key]).then(() => {
        return {
          key,
          value: key.toString().repeat(10000),
        }
      }),
    processor: ({ key, value }) => {
      if (key < last) {
        clearLine()
        console.error({ last, key })
        throw new Error('not processing in order')
      }
      last = key
      process.stdout.write('\rprocessing: ' + key)
    },
  }).then(() => {
    clearLine()
    const endTime = Date.now()
    const usedTime = endTime - startTime
    console.log('used: ', format_time_duration(usedTime))
    console.log('average TPS: ' + n / (usedTime / 1000))
    return rawSyncTest(usedTime)
  }),
)

const rawSyncTest = async (duration: number) => {
  console.log()
  console.log('benchmarking sync version with delay')
  let startTime = Date.now()
  let last = -1
  let ranN = n
  for (let i = 0; i < n; i++) {
    await later(delays[i])
    const key = keys[i]
    const datum = i.toString().repeat(10000)
    if (!'dev') {
      console.log(datum)
    }
    if (key < last) {
      throw new Error('not in order')
    }
    last = key
    process.stdout.write('\rprocessing: ' + key)
    if (Date.now() - startTime >= duration) {
      ranN = i
      break
    }
  }
  clearLine()
  let endTime = Date.now()
  let usedTime = endTime - startTime
  console.log('used:', format_time_duration(usedTime))
  console.log('average TPS: ' + ranN / (usedTime / 1000))

  console.log()
  console.log('benchmarking sync version without delay')
  startTime = Date.now()
  last = -1
  for (let i = 0; i < n; i++) {
    const key = keys[i]
    const datum = i.toString().repeat(10000)
    if (!'dev') {
      console.log(datum)
    }
    if (key < last) {
      throw new Error('not in order')
    }
    last = key
    process.stdout.write('\rprocessing: ' + key)
  }
  clearLine()
  endTime = Date.now()
  usedTime = endTime - startTime
  console.log('used:', format_time_duration(usedTime))
  console.log('average TPS: ' + n / (usedTime / 1000))
}
