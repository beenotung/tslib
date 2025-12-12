import { expect } from 'chai'
import { test } from 'mocha'
import {
  format_tel_with_pattern,
  to_full_hk_mobile_phone,
  to_full_sg_mobile_phone,
  to_full_in_mobile_phone,
  format_mobile_phone,
} from '../src/tel'

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

    describe('Singapore', () => {
      test('with country code', () => {
        expect(to_full_sg_mobile_phone('+65 8123 4567')).to.equal('+6581234567')
      })
      test('without country code mobile tel', () => {
        expect(to_full_sg_mobile_phone('8123 4567')).to.equal('+6581234567')
      })
      test('without country code non-mobile tel', () => {
        expect(to_full_sg_mobile_phone('6123 4567')).to.equal('')
      })
    })
    describe('India', () => {
      test('with country code', () => {
        expect(to_full_in_mobile_phone('+91 98765 43210')).to.equal(
          '+919876543210',
        )
      })
      test('without country code mobile tel', () => {
        expect(to_full_in_mobile_phone('98765 43210')).to.equal('+919876543210')
      })
      test('with 6 prefix', () => {
        expect(to_full_in_mobile_phone('61234 56789')).to.equal('+916123456789')
      })
      test('invalid prefix', () => {
        expect(to_full_in_mobile_phone('51234 56789')).to.equal('')
      })
      test('format mobile phone', () => {
        expect(format_mobile_phone('9876543210')).to.equal('+91 98765 43210')
      })
    })

  })
})
