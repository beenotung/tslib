import { expect } from 'chai'
import { describe } from 'mocha'
import { getPromiseState } from '../src/async/promise'

describe('getPromiseState', () => {
  it('should return "pending" for a pending promise', () => {
    let p = new Promise((resolve, reject) => {})
    expect(getPromiseState(p)).to.equal('pending')
  })
  it('should return "fulfilled" for a fulfilled promise', () => {
    let p = Promise.resolve('the value')
    expect(getPromiseState(p)).to.equal('fulfilled')
  })
  it('should return "rejected" for a rejected promise', () => {
    let p = Promise.reject('the reason')
    expect(getPromiseState(p)).to.equal('rejected')
  })
})
