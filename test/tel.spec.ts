import { expect } from 'chai'
import { test } from 'mocha'
import { format_tel_with_pattern, to_full_hk_mobile_phone } from '../src/tel'

describe('tel.ts TestSuit', () => {
  describe('format_tel_with_pattern', () => {
    test('with enough length', () => {
      expect(
        format_tel_with_pattern('+85298765432', '+852 xxxx yyyy'),
      ).to.equal('+852 9876 5432')
      expect(
        format_tel_with_pattern('+61412345678', '+61 4xx xxx xxx'),
      ).to.equal('+61 412 345 678')
      expect(
        format_tel_with_pattern('+8613812345678', '+86 1nn xxxx xxxx'),
      ).to.equal('+86 138 1234 5678')
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
  describe('varies country phone numbers', () => {
    describe('Hong Kong', () => {
      test('with country code', () => {
        expect(to_full_hk_mobile_phone('+852 9876 5432')).to.equal(
          '+85298765432',
        )
      })
      test('without country code mobile tel', () => {
        expect(to_full_hk_mobile_phone('9876 5432')).to.equal('+85298765432')
      })
      test('without country code non-mobile tel', () => {
        expect(to_full_hk_mobile_phone('2345 6789')).to.equal('')
      })
    })
  })
})
