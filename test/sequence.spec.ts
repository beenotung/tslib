import {
  create_sequence_mean,
  create_sequence_standard_deviation,
} from '../src/sequence'
import { average, standard_deviation } from '../src/array'
import { expect } from 'chai'

describe('sequence.ts tests', () => {
  let values = [1, 2, 3, 4, 5]
  let expected_mean = average(values)
  let expected_standard_deviation_for_sample = standard_deviation(
    values,
    'sample',
  )
  let expected_standard_deviation_for_population = standard_deviation(
    values,
    'population',
  )

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

  describe('create_sequence_standard_deviation', () => {
    it('should calculate running standard deviation', () => {
      let seq = create_sequence_standard_deviation()
      for (let i = 0; i < values.length; i++) {
        seq.next(values[i])
      }
      expect(seq.count).to.equal(values.length)
      expect(seq.get_standard_deviation('sample')).to.equal(
        expected_standard_deviation_for_sample,
      )
      expect(seq.get_standard_deviation('population')).to.equal(
        expected_standard_deviation_for_population,
      )
    })

    it('should calculate standard deviation with initial values', () => {
      let seq = create_sequence_standard_deviation()
      seq.next(10)
      seq.next(20)

      seq = create_sequence_standard_deviation({
        initial: seq,
      })
      seq.next(30)
      expect(seq.count).to.equal(3)
      expect(seq.get_standard_deviation('sample')).to.equal(
        standard_deviation([10, 20, 30], 'sample'),
      )
      expect(seq.get_standard_deviation('population')).to.equal(
        standard_deviation([10, 20, 30], 'population'),
      )
    })

    it('should handle zero values', () => {
      let seq = create_sequence_standard_deviation()
      expect(seq.count).to.equal(0)
      expect(seq.mean).to.equal(0)
      expect(seq.sum_of_squares).to.equal(0)
      expect(seq.get_variance('sample')).to.deep.equal(0 / -1)
      expect(seq.get_variance('population')).to.deep.equal(0 / 0)

      seq.next(50)
      expect(seq.count).to.equal(1)
      expect(seq.mean).to.equal(50)
      expect(seq.sum_of_squares).to.equal(0)
      expect(seq.get_variance('sample')).to.deep.equal(0 / 0)
      expect(seq.get_variance('population')).to.deep.equal(0 / 1)

      seq.next(70)
      expect(seq.count).to.equal(2)
      expect(seq.mean).to.equal(60)
      expect(seq.sum_of_squares).to.equal(20 * 10)
      expect(seq.get_variance('sample')).to.deep.equal((20 * 10) / 1)
      expect(seq.get_variance('population')).to.deep.equal((20 * 10) / 2)
    })
  })
})
