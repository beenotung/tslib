import { is_email } from '../src/validate'
import { t } from './tape-adaptor'

test('validate email', () => {
  t.equal(true, is_email('user@domain.com'))
  t.equal(false, is_email('user@domain'))
  t.equal(false, is_email('@domain.com'))
  t.equal(false, is_email('user'))
  t.equal(false, is_email(''))
  t.end()
})
