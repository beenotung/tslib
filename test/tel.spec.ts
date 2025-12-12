import { expect } from 'chai'
import { test } from 'mocha'
import {
  format_tel_with_pattern,
  to_full_hk_mobile_phone,
  to_full_sg_mobile_phone,
  to_full_au_mobile_phone,
  to_full_cn_mobile_phone,
  to_full_mo_mobile_phone,
  to_full_ae_mobile_phone,
  to_full_in_mobile_phone,
  to_full_jp_mobile_phone,
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

    describe('Australia', () => {
      test('with country code', () => {
        expect(to_full_au_mobile_phone('+61 412 345 678')).to.equal(
          '+61412345678',
        )
      })
      test('with local format', () => {
        expect(to_full_au_mobile_phone('0412 345 678')).to.equal('+61412345678')
      })
      test('invalid landline', () => {
        expect(to_full_au_mobile_phone('0212 345 678')).to.equal('')
      })
    })

    describe('China', () => {
      test('with country code', () => {
        expect(to_full_cn_mobile_phone('+86 138 1234 5678')).to.equal(
          '+8613812345678',
        )
      })
      test('without country code mobile tel', () => {
        expect(to_full_cn_mobile_phone('138 1234 5678')).to.equal(
          '+8613812345678',
        )
      })
      test('invalid prefix', () => {
        expect(to_full_cn_mobile_phone('128 1234 5678')).to.equal('')
      })
    })

    describe('Macau', () => {
      test('with country code', () => {
        expect(to_full_mo_mobile_phone('+853 6123 4567')).to.equal(
          '+85361234567',
        )
      })
      test('without country code mobile tel', () => {
        expect(to_full_mo_mobile_phone('6123 4567')).to.equal('+85361234567')
      })
      test('invalid prefix', () => {
        expect(to_full_mo_mobile_phone('5123 4567')).to.equal('')
      })
    })

    describe('UAE/Dubai', () => {
      test('with country code', () => {
        expect(to_full_ae_mobile_phone('+971 50 123 4567')).to.equal(
          '+971501234567',
        )
      })
      test('with local format (05x)', () => {
        expect(to_full_ae_mobile_phone('050 123 4567')).to.equal(
          '+971501234567',
        )
      })
      test('invalid prefix', () => {
        expect(to_full_ae_mobile_phone('040 123 4567')).to.equal('')
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

    describe('Japan', () => {
      test('with country code +81 (090)', () => {
        expect(to_full_jp_mobile_phone('+81 90 1234 5678')).to.equal(
          '+819012345678',
        )
      })
      test('with country code +81 (080)', () => {
        expect(to_full_jp_mobile_phone('+81 80 1234 5678')).to.equal(
          '+818012345678',
        )
      })
      test('with country code +81 (070)', () => {
        expect(to_full_jp_mobile_phone('+81 70 1234 5678')).to.equal(
          '+817012345678',
        )
      })
      test('with country code 81 without + (090)', () => {
        expect(to_full_jp_mobile_phone('81 90 1234 5678')).to.equal(
          '+819012345678',
        )
      })
      test('with local format with leading 0 (090)', () => {
        expect(to_full_jp_mobile_phone('090 1234 5678')).to.equal(
          '+819012345678',
        )
      })
      test('with local format without leading 0', () => {
        expect(to_full_jp_mobile_phone('9012345678')).to.equal('+819012345678')
      })
      test('with country code 81 and leading 0 (090)', () => {
        expect(to_full_jp_mobile_phone('8109012345678')).to.equal(
          '+819012345678',
        )
      })
      test('with country code +81 and leading 0 (090)', () => {
        expect(to_full_jp_mobile_phone('+8109012345678')).to.equal(
          '+819012345678',
        )
      })
      test('invalid prefix', () => {
        expect(to_full_jp_mobile_phone('060 1234 5678')).to.equal('')
      })
      test('format mobile phone', () => {
        expect(format_mobile_phone('09012345678')).to.equal('+81 90 1234 5678')
      })
    })

  })
})
