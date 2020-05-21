#!/usr/bin/env ts-node
// see which way use less memory

import { Random } from '../src/random'

// 34s die at 90M
function concat(n: number) {
  let acc = ''
  for (let i = 0; i < n; i++) {
    const c = Random.nextString(1)
    acc += c
  }
  return acc
}

// 24s die at 136M
function join(n: number) {
  const acc: string[] = []
  for (let i = 0; i < n; i++) {
    const c = Random.nextString(1)
    acc.push(c)
  }
  return acc.join('')
}

// avoid tslint error
console.log(concat, join)

const start = Date.now()
for (let i = 1; ; i *= 1.5) {
  i = Math.round(i)
  const time = Date.now() - start
  console.log(time.toLocaleString(), 'ms, n:', i.toLocaleString())
  // concat(i)
  // join(i)
  break
}
