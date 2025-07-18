import { expect } from 'chai'
import { test } from 'mocha'
import { format_tel_with_pattern } from '../src/tel'

describe('tel.ts TestSuit', () => {
  describe('format_tel_with_pattern', () => {
    test('with enough length', () => {
      expect(
        format_tel_with_pattern('+85298765432', '+852 xxxx yyyy'),
      ).to.equal('+852 9876 5432')
    })
    test('with not enough length', () => {
      expect(() =>
        format_tel_with_pattern('85298765432', '+852 xxxx yyyy'),
      ).to.throw('invalid length')
    })
    test('with empty input', () => {
      expect(format_tel_with_pattern('', '+852 xxxx yyyy')).to.equal('')
      expect(format_tel_with_pattern(' ', '+852 xxxx yyyy')).to.equal('')
    })
    test('with existing spaces and hyphens', () => {
      expect(
        format_tel_with_pattern('+852 9876 5432', '+852 xxxx yyyy'),
      ).to.equal('+852 9876 5432')
      expect(
        format_tel_with_pattern('+852-9876-5432', '+852 xxxx yyyy'),
      ).to.equal('+852 9876 5432')
    })
  })
})
