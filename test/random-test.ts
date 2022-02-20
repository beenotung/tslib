import { format_relative_time } from '../src/format'
import { base58Letters, Random } from '../src/random'

import { Bar } from 'cli-progress'

function testEnum() {
  enum E {
    a,
    b,
    c,
  }

  const e = Random.nextEnum(E) as E
  console.log(e)
  console.log('enum values:')
  console.log(Random.nextEnum<E>(E))
  console.log(Random.nextEnum<E>(E))
  console.log(Random.nextEnum<E>(E))
  console.log('enum keys:')
  console.log(Random.nextEnumKey(E))
  console.log(Random.nextEnumKey(E))
  console.log(Random.nextEnumKey(E))
}

testEnum()

function testProbability() {
  const xs = {} as Record<string, boolean>
  let n = 0
  const pool = base58Letters
  const length = 3
  const progressBar = new Bar({})
  progressBar.start(Math.pow(pool.length, length), 0)
  const start = new Date()
  for (;;) {
    if (n >= Math.pow(pool.length, length)) {
      break
    }
    const start = Date.now()
    let i = 0
    for (;;) {
      i++
      // let s = Math.random().toString(36).substring(2);
      const s = Random.nextString(length, pool)
      if (!xs[s]) {
        xs[s] = true
        n++
        if (progressBar) {
          progressBar.increment(1)
        } else {
          const end = Date.now()
          const used = end - start
          console.log(`n=${n}, i=${i}, used ${used} ms`)
        }
        break
      }
    }
  }
  if (progressBar) {
    progressBar.stop()
  }
  console.log('tried all combination')
  console.log(format_relative_time(start.getTime()))
}

testProbability()
