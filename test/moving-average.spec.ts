import { expect } from 'chai'
import {
  create_exponential_moving_average,
  create_sliding_window_average,
} from '../src/moving-average'

describe('moving-average.ts TestSuit', () => {
  let epsilon = 1e-6

  describe('create_exponential_moving_average', () => {
    it('should create with alpha', () => {
      const ma = create_exponential_moving_average({ alpha: 0.1 })
      expect(ma.alpha).to.be.closeTo(0.1, epsilon)
      expect(ma.beta).to.be.closeTo(0.9, epsilon)
    })

    it('should create with beta', () => {
      const ma = create_exponential_moving_average({ beta: 0.9 })
      expect(ma.alpha).to.be.closeTo(0.1, epsilon)
      expect(ma.beta).to.be.closeTo(0.9, epsilon)
    })

    it('should create with initial value', () => {
      const ma = create_exponential_moving_average({
        initial_value: 10,
        alpha: 0.1,
      })
      expect(ma.get_value()).to.equal(10)
    })

    it('should throw error if get value without initial value', () => {
      const ma = create_exponential_moving_average({ alpha: 0.1 })
      expect(() => ma.get_value()).to.throw('no value yet')
    })

    it('should calculate moving average', () => {
      const ma = create_exponential_moving_average({ alpha: 0.9 })
      expect(ma.next(100)).to.be.closeTo(100, epsilon)
      expect(ma.next(0)).to.be.closeTo(90, epsilon)
      expect(ma.next(0)).to.be.closeTo(81, epsilon)
      expect(ma.next(0)).to.be.closeTo(72.9, epsilon)
    })
  })

  describe('create_sliding_window_average', () => {
    it('should create with initial value', () => {
      const ma = create_sliding_window_average({
        window_size: 3,
        initial_value: 10,
      })
      expect(ma.get_value()).to.be.closeTo(10, epsilon)
    })

    it('should throw error if get value without initial value', () => {
      const ma = create_sliding_window_average({ window_size: 3 })
      expect(() => ma.get_value()).to.throw('no value yet')
    })

    it('should calculate moving average without initial value', () => {
      const ma = create_sliding_window_average({ window_size: 3 })
      expect(ma.next(100)).to.be.closeTo(100 / 1, epsilon)
      expect(ma.next(0)).to.be.closeTo(100 / 2, epsilon)
      expect(ma.next(0)).to.be.closeTo(100 / 3, epsilon)
      expect(ma.next(0)).to.be.closeTo(0, epsilon)
      expect(ma.next(100)).to.be.closeTo(100 / 3, epsilon)
      expect(ma.next(100)).to.be.closeTo(200 / 3, epsilon)
      expect(ma.next(100)).to.be.closeTo(300 / 3, epsilon)
    })

    it('should calculate moving average with initial value', () => {
      const ma = create_sliding_window_average({
        window_size: 3,
        initial_value: 100,
      })
      expect(ma.get_value()).to.be.closeTo(100, epsilon)
      expect(ma.next(0)).to.be.closeTo(200 / 3, epsilon)
      expect(ma.next(0)).to.be.closeTo(100 / 3, epsilon)
      expect(ma.next(0)).to.be.closeTo(0, epsilon)
      expect(ma.next(100)).to.be.closeTo(100 / 3, epsilon)
      expect(ma.next(100)).to.be.closeTo(200 / 3, epsilon)
      expect(ma.next(100)).to.be.closeTo(300 / 3, epsilon)
    })
  })
})
