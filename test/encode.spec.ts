import { expect } from 'chai'
import { decodeUTF16BE } from '../src/encode'

describe('UTF-16BE', () => {
  let hex = '4F60597D55CE003F'

  it('should decode UTF-16BE', () => {
    expect(decodeUTF16BE(Buffer.from(hex, 'hex'))).to.equals('中文')
  })

  it('should encode UTF-16BE', () => {})
})
