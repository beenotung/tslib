import { create_sequence_mean } from '../src/sequence'
import { average } from '../src/array'
import { expect } from 'chai'

describe('sequence.ts tests', () => {
  let values = [1, 2, 3, 4, 5]
  let expected_mean = average(values)

  describe('create_sequence_mean', () => {
    it('should calculate running mean', () => {
      const seq = create_sequence_mean()
      for (let i = 0; i < values.length; i++) {
        seq.next(values[i])
      }
      expect(seq.mean).to.equal(expected_mean)
      expect(seq.count).to.equal(values.length)
    })

    it('should calculate mean with initial values', () => {
      // initial mean is 100/5 = 20
      const seq = create_sequence_mean({ initial: { sum: 100, count: 5 } })

      seq.next(20)
      // new mean is (100 + 20) / 6 = 20
      expect(seq.count).to.equal(6)
      expect(seq.mean).to.equal(20)

      seq.next(6)
      // new mean is (120 + 6) / 7 = 18
      expect(seq.count).to.equal(7)
      expect(seq.mean).to.equal(18)
    })

    it('should handle zero values', () => {
      const seq = create_sequence_mean()
      expect(seq.mean).to.equal(0)
      expect(seq.count).to.equal(0)

      seq.next(5)
      expect(seq.mean).to.equal(5)
      expect(seq.count).to.equal(1)
    })
  })
})
