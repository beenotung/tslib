import { is_email, to_full_hk_mobile_phone } from '../src/validate'
import { t } from './tape-adaptor'
import { expect } from 'chai'

describe('validate.ts spec', () => {
  it('should validate email', () => {
    t.equal(true, is_email('user@domain.com'))
    t.equal(false, is_email('user@domain'))
    t.equal(false, is_email('@domain.com'))
    t.equal(false, is_email('user'))
    t.equal(false, is_email(''))
    t.end()
  })
  describe('validate hk mobile phone', () => {
    it('preserve "+852" prefix if present in input', () => {
      expect(to_full_hk_mobile_phone('+85298765432')).to.equals('+85298765432')
    })
    it('add "+852" prefix if absent in input', () => {
      expect(to_full_hk_mobile_phone('98765432')).to.equals('+85298765432')
    })
    it('add "+" prefix if absent in input', () => {
      expect(to_full_hk_mobile_phone('85298765432')).to.equals('+85298765432')
    })
  })
})
