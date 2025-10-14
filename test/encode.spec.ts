import { expect } from 'chai'
import { decodeUTF16BE, encodeUTF16BE } from '../src/encode'

describe('UTF-16BE', () => {
  let hex = '4F60597D55CE003F'
  let word = '你好嗎?'

  it('should decode UTF-16BE', () => {
    expect(decodeUTF16BE(Buffer.from(hex, 'hex'))).to.equals(word)
  })

  it('should encode UTF-16BE', () => {
    expect(encodeUTF16BE(word).toString('hex').toUpperCase()).to.equals(hex)
  })
})
