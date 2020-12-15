import { RingBuffer } from '../src/ring-buffer'
import { t } from './tape-adaptor'

describe('ring-buffer.ts spec', () => {
  it('Test correct boundary', () => {
    const size = 3
    const xs = new RingBuffer(size)
    for (let x = 0; x < size * 5; x++) {
      xs.push(x)
      const y = xs.unshift()
      t.equal(y, x)
    }
    t.equal(xs.length, 0)
    t.end()
  })
})
