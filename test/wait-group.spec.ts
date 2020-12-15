import { expect } from 'chai'
import sinon from 'sinon'
import { WaitGroup } from '../src/async/wait-group'

describe('wait-group.ts TestSuit', () => {
  let clock: ReturnType<typeof sinon.useFakeTimers>
  beforeEach(() => {
    clock = sinon.useFakeTimers()
  })
  afterEach(() => {
    clock.restore()
  })
  it('should wait until all tasks finish', done => {
    const wg = new WaitGroup()

    let doneTimes = 0

    function wait(interval: number) {
      const cb = wg.add()
      setTimeout(() => {
        doneTimes++
        cb()
      }, interval)
    }

    wait(300)
    wait(200)
    wait(100)
    clock.tick(300)

    expect(doneTimes).to.equals(3)
    wg.waitAll(() => {
      done()
    })
  })
})
