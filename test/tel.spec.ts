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
  to_full_th_mobile_phone,
  to_full_in_mobile_phone,
  to_full_jp_mobile_phone,
  to_full_vn_mobile_phone,
  to_full_id_mobile_phone,
  to_full_my_mobile_phone,
  format_mobile_phone,
  is_mobile_phone,
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

    describe('Thailand', () => {
      test('with country code +66 (08x, 10 digits)', () => {
        expect(to_full_th_mobile_phone('+66 081 234 5678')).to.equal(
          '+66812345678',
        )
      })
      test('with country code +66 (09x, 10 digits)', () => {
        expect(to_full_th_mobile_phone('+66 091 234 5678')).to.equal(
          '+66912345678',
        )
      })
      test('with country code +66 (06x, 10 digits)', () => {
        expect(to_full_th_mobile_phone('+66 061 234 5678')).to.equal(
          '+66612345678',
        )
      })
      test('with country code +66 (08x, 9 digits, already in internal format)', () => {
        expect(to_full_th_mobile_phone('+66 81 234 5678')).to.equal(
          '+66812345678',
        )
      })
      test('with country code 66 without + (08x, 10 digits)', () => {
        expect(to_full_th_mobile_phone('66 081 234 5678')).to.equal(
          '+66812345678',
        )
      })
      test('with local format (08x)', () => {
        expect(to_full_th_mobile_phone('081 234 5678')).to.equal('+66812345678')
      })
      test('without leading 0 (08x)', () => {
        expect(to_full_th_mobile_phone('812345678')).to.equal('+66812345678')
      })
      test('invalid prefix', () => {
        expect(to_full_th_mobile_phone('071 234 5678')).to.equal('')
      })
      test('format mobile phone', () => {
        expect(format_mobile_phone('+66812345678')).to.equal('+66 81 234 5678')
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
        expect(format_mobile_phone('+919876543210')).to.equal('+91 98765 43210')
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
        expect(format_mobile_phone('+819012345678')).to.equal(
          '+81 90 1234 5678',
        )
      })
    })

    describe('Vietnam', () => {
      describe('to_full_vn_mobile_phone', () => {
        test('with country code +84 and leading 0 (09x)', () => {
          expect(to_full_vn_mobile_phone('+84 091 234 5678')).to.equal(
            '+84912345678',
          )
        })
        test('with country code +84 and leading 0 (08x)', () => {
          expect(to_full_vn_mobile_phone('+84 081 234 5678')).to.equal(
            '+84812345678',
          )
        })
        test('with country code +84 and leading 0 (07x)', () => {
          expect(to_full_vn_mobile_phone('+84 071 234 5678')).to.equal(
            '+84712345678',
          )
        })
        test('with country code +84 and leading 0 (03x)', () => {
          expect(to_full_vn_mobile_phone('+84 031 234 5678')).to.equal(
            '+84312345678',
          )
        })
        test('with country code +84 and leading 0 (05x)', () => {
          expect(to_full_vn_mobile_phone('+84 051 234 5678')).to.equal(
            '+84512345678',
          )
        })
        test('with country code +84 without leading 0 (already in internal format)', () => {
          expect(to_full_vn_mobile_phone('+84 91 234 5678')).to.equal(
            '+84912345678',
          )
        })
        test('with country code 84 without + and leading 0', () => {
          expect(to_full_vn_mobile_phone('84 091 234 5678')).to.equal(
            '+84912345678',
          )
        })
        test('with local format with leading 0', () => {
          expect(to_full_vn_mobile_phone('091 234 5678')).to.equal(
            '+84912345678',
          )
        })
        test('with local format without leading 0', () => {
          expect(to_full_vn_mobile_phone('912345678')).to.equal('+84912345678')
        })
        test('invalid prefix', () => {
          expect(to_full_vn_mobile_phone('021 234 5678')).to.equal('')
        })
      })
      describe('format_vn_mobile_phone', () => {
        test('formats internal format to display format', () => {
          expect(format_mobile_phone('+84912345678')).to.equal(
            '+84 91 234 5678',
          )
        })
      })
    })

    describe('Indonesia', () => {
      test('with country code (10 digits)', () => {
        expect(to_full_id_mobile_phone('+62 812 3456 789')).to.equal(
          '+628123456789',
        )
      })
      test('with country code (11 digits)', () => {
        expect(to_full_id_mobile_phone('+62 812 3456 7890')).to.equal(
          '+6281234567890',
        )
      })
      test('with country code (9 digits)', () => {
        expect(to_full_id_mobile_phone('+62 812 345 678')).to.equal(
          '+62812345678',
        )
      })
      test('with local format (08x)', () => {
        expect(to_full_id_mobile_phone('0812 3456 789')).to.equal(
          '+628123456789',
        )
        // Should not include leading 0 in result
        expect(to_full_id_mobile_phone('08123456789')).to.equal('+628123456789')
      })
      test('without leading 0', () => {
        expect(to_full_id_mobile_phone('8123456789')).to.equal('+628123456789')
      })
      test('invalid prefix', () => {
        expect(to_full_id_mobile_phone('0712 3456 789')).to.equal('')
      })
      test('format mobile phone (10 digits)', () => {
        expect(format_mobile_phone('+628123456789')).to.equal(
          '+62 812 3456 789',
        )
      })
      test('format mobile phone (11 digits)', () => {
        expect(format_mobile_phone('+6281234567890')).to.equal(
          '+62 812 3456 7890',
        )
      })
    })

    describe('Malaysia', () => {
      test('with country code (012x)', () => {
        expect(to_full_my_mobile_phone('+60 12 345 6789')).to.equal(
          '+60123456789',
        )
      })
      test('with country code (011x - 11 digits)', () => {
        expect(to_full_my_mobile_phone('+60 11 1234 5678')).to.equal(
          '+601112345678',
        )
      })
      test('with local format (012x)', () => {
        expect(to_full_my_mobile_phone('012 345 6789')).to.equal('+60123456789')
      })
      test('with local format (011x - 11 digits)', () => {
        expect(to_full_my_mobile_phone('011 1234 5678')).to.equal(
          '+601112345678',
        )
      })
      test('without leading 0 (12x)', () => {
        expect(to_full_my_mobile_phone('123456789')).to.equal('+60123456789')
      })
      test('invalid prefix', () => {
        expect(to_full_my_mobile_phone('051 234 5678')).to.equal('')
      })
      test('format mobile phone (10 digits)', () => {
        expect(format_mobile_phone('+60123456789')).to.equal('+60 12 345 6789')
      })
      test('format mobile phone (11 digits)', () => {
        expect(format_mobile_phone('+601112345678')).to.equal(
          '+60 11 1234 5678',
        )
      })
    })

    describe('auto detect country code in to_full_mobile_phone', () => {
      test('detects Hong Kong', () => {
        expect(is_mobile_phone('98765432')).to.be.true
        expect(format_mobile_phone('98765432')).to.equal('+852 9876 5432')
      })
      test('detects Thailand', () => {
        expect(is_mobile_phone('0612345678')).to.be.true
        expect(format_mobile_phone('0612345678')).to.equal('+66 61 234 5678')
      })
      test('detects India', () => {
        expect(is_mobile_phone('9876543210')).to.be.true
        expect(format_mobile_phone('9876543210')).to.equal('+91 98765 43210')
      })
      test('detects Japan', () => {
        expect(is_mobile_phone('09012345678')).to.be.true
        expect(format_mobile_phone('09012345678')).to.equal('+81 90 1234 5678')
      })
      test('detects Vietnam', () => {
        expect(is_mobile_phone('0712345678')).to.be.true
        expect(format_mobile_phone('0712345678')).to.equal('+84 71 234 5678')
      })
      test('detects Indonesia', () => {
        expect(is_mobile_phone('08123456789')).to.be.true
        expect(format_mobile_phone('08123456789')).to.equal('+62 812 3456 789')
      })
      test('detects Malaysia', () => {
        expect(is_mobile_phone('0123456789')).to.be.true
        expect(format_mobile_phone('0123456789')).to.equal('+60 12 345 6789')
      })
      test('detects Australia', () => {
        expect(is_mobile_phone('0412345678')).to.be.true
        expect(format_mobile_phone('0412345678')).to.equal('+61 412 345 678')
      })
      test('detects China', () => {
        expect(is_mobile_phone('13812345678')).to.be.true
        expect(format_mobile_phone('13812345678')).to.equal('+86 138 1234 5678')
      })
      test('detects UAE', () => {
        expect(is_mobile_phone('501234567')).to.be.true
        expect(format_mobile_phone('501234567')).to.equal('+971 50 123 4567')
      })
      test('Singapore (conflict with Hong Kong without country code)', () => {
        // Without country code, 8-digit numbers are detected as HK (checked first)
        expect(is_mobile_phone('81234567')).to.be.true
        expect(format_mobile_phone('81234567')).to.equal('+852 8123 4567')
        // With country code, it correctly detects as Singapore
        expect(is_mobile_phone('+6581234567')).to.be.true
        expect(format_mobile_phone('+6581234567')).to.equal('+65 8123 4567')
      })
      test('Macau (conflict with Hong Kong without country code)', () => {
        // Without country code, 8-digit numbers are detected as HK (checked first)
        expect(is_mobile_phone('66123456')).to.be.true
        expect(format_mobile_phone('66123456')).to.equal('+852 6612 3456')
        // With country code, it correctly detects as Macau
        expect(is_mobile_phone('+85366123456')).to.be.true
        expect(format_mobile_phone('+85366123456')).to.equal('+853 6612 3456')
      })
      test('returns false for invalid number', () => {
        expect(is_mobile_phone('1234567890')).to.be.false
        expect(format_mobile_phone('1234567890')).to.equal('')
      })
    })
  })
})
