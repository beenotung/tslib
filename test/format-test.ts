import test from 'tape'
import {
  format_2_digit,
  format_byte,
  format_datetime,
  format_long_short_time,
  format_n_digit,
  format_relative_time,
  setLang,
} from '../src/format'
import { CENTURY, DAY, MINUTE, SECOND, WEEK } from '../src/time'

test('format_byte', t => {
  t.equal(format_byte(412.5 * 1024 * 1024), '412.50 MB', 'format size')
  t.end()
})

test('format_datetime', t => {
  const time = new Date('2019-03-11T03:56:00.000Z').getTime()
  t.equal(
    format_datetime(time),
    'Mon, Mar 11, 2019, 11:56 AM',
    'format time (default)',
  )
  // node v10
  t.equal(
    format_datetime(time, { locales: 'zh-hk' }),
    'Mon, Mar 11, 2019, 11:56 AM',
    'format time (zh-hk)',
  )
  // node v8
  // t.equal( format_datetime(time, { locales: 'zh-hk' }), '2019 Mar 11, Mon 11:56 AM','format time (zh-hk)');
  t.end()
})

test('format_relative_time (default)', t => {
  t.equal(format_relative_time(12.5 * MINUTE), '12.5 minutes hence')
  t.equal(format_relative_time(4 * DAY), '4 days hence')
  t.equal(format_relative_time(4 * CENTURY), '4 centuries hence')
  t.equal(format_relative_time(76 * DAY), '2.5 months hence')
  t.equal(format_relative_time(-400 * DAY), '1.1 years ago')
  t.equal(format_relative_time(-1.5 * SECOND), '1.5 seconds ago')
  t.equal(format_relative_time(-1024 * SECOND), '17.1 minutes ago')
  t.end()
})
test('format_relative_time (zh)', t => {
  setLang('zh')
  t.equal(format_relative_time(12.5 * MINUTE), '12.5 分鐘後')
  t.end()
})
test('format_relative_time (en)', t => {
  setLang('en')
  t.equal(format_relative_time(12.5 * MINUTE), '12.5 minutes hence')
  t.end()
})
test('format_long_short_time', t => {
  const now = Date.now()
  t.equal(format_long_short_time(now - 4.5 * DAY), '4 days ago')
  t.equal(format_long_short_time(now + 4.5 * DAY), '4 days hence')
  t.notEqual(format_long_short_time(now - 4.5 * WEEK), '4 weeks ago')
  t.notEqual(format_long_short_time(now + 4.5 * WEEK), '4 weeks hence')
  t.end()
})

test('format_digit', t => {
  t.equal(format_2_digit(12), '12')
  t.equal(format_2_digit(6), '06')

  t.equal(format_n_digit(6, 2), '06')
  t.equal(format_n_digit(6, 4), '0006')
  t.equal(format_n_digit(6, 1), '6')
  t.equal(format_n_digit(6, 0), '6')
  t.equal(format_n_digit(6, -10), '6')

  t.end()
})
