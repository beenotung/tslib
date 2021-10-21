import { expect } from 'chai'
import { parseByteSize } from '../src/size'

describe('size.ts TestSuit', () => {
  it('should parse numeric string without unit', () => {
    expect(parseByteSize('12')).to.equals(12)
  })
  it('should parse size in KB', () => {
    expect(parseByteSize('12KB')).to.equals(12 * 1024)
  })
  it('should parse size in MB', () => {
    expect(parseByteSize('12MB')).to.equals(12 * 1024 * 1024)
  })
  it('should parse size in GB', () => {
    expect(parseByteSize('12GB')).to.equals(12 * 1024 * 1024 * 1024)
  })
  it('should parse size in lower case unit', () => {
    expect(parseByteSize('12mb')).to.equals(12 * 1024 * 1024)
  })
  it('should parse size unit short form', () => {
    expect(parseByteSize('12b')).to.equals(12)
    expect(parseByteSize('12k')).to.equals(12 * 1024)
    expect(parseByteSize('12m')).to.equals(12 * 1024 * 1024)
    expect(parseByteSize('12g')).to.equals(12 * 1024 * 1024 * 1024)
  })
})
