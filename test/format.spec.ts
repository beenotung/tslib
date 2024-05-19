import {
  format_2_digit,
  format_byte,
  format_datetime,
  format_long_short_time,
  format_n_digit,
  format_relative_time,
  setLang,
} from '../src/format'
import { CENTURY, DAY, HOUR, MINUTE, SECOND, WEEK } from '../src/time'
import { t } from './tape-adaptor'
import { test } from 'mocha'
import { expect } from 'chai'

describe('format.ts spec', () => {
  describe('format_byte', () => {
    t.equal(format_byte(412.5 * 1024 * 1024), '412.50 MB', 'format size')
    t.end()
  })

  describe('format_datetime', () => {
    let time = new Date('2019-03-11T03:56:00.000Z').getTime()
    {
      // adjust for timezone different
      time += (8 - -new Date().getTimezoneOffset() / 60) * HOUR
    }
    // node v8: 2019 Mar 11, Mon 11:56 AM
    // node v10: Mon, Mar 11, 2019, 11:56 AM
    // node v14: Mon, 11 Mar 2019, 11:56 am | 2019年3月11日週一 上午11:56
    const str = format_datetime(time)
    expect(str).to.contains('Mon')
    expect(str).to.contains('11')
    expect(str).to.contains('Mar')
    expect(str).to.contains('2019')
    expect(str).to.contains('11:56')
    expect(str.toUpperCase()).to.contains('AM')
    t.end()
  })

  test('format_relative_time (default)', () => {
    t.equal(format_relative_time(12.5 * MINUTE), '12.5 minutes hence')
    t.equal(format_relative_time(4 * DAY), '4 days hence')
    t.equal(format_relative_time(4 * CENTURY), '4 centuries hence')
    t.equal(format_relative_time(77 * DAY), '2.5 months hence')
    t.equal(format_relative_time(-402 * DAY), '1.1 years ago')
    t.equal(format_relative_time(-1.5 * SECOND), '1.5 seconds ago')
    t.equal(format_relative_time(-59 * SECOND), '59 seconds ago')
    t.equal(format_relative_time(-60 * SECOND), '1 minute ago')
    t.equal(format_relative_time(-61 * SECOND), '1 minute ago')
    t.equal(format_relative_time(-119 * SECOND), '1.9 minutes ago')
    t.equal(format_relative_time(-120 * SECOND), '2 minutes ago')
    t.equal(format_relative_time(-1024 * SECOND), '17 minutes ago')
    t.end()
  })
  test('format_relative_time (zh)', () => {
    setLang('zh')
    t.equal(format_relative_time(12.5 * MINUTE), '12.5 分鐘後')
    t.end()
  })
  test('format_relative_time (en)', () => {
    setLang('en')
    t.equal(format_relative_time(12.5 * MINUTE), '12.5 minutes hence')
    t.end()
  })
  test('format_long_short_time', () => {
    const now = Date.now()
    t.equal(format_long_short_time(now - 4.5 * DAY), '4.5 days ago')
    t.equal(format_long_short_time(now + 4.5 * DAY), '4.5 days hence')
    t.notEqual(format_long_short_time(now - 4.5 * WEEK), '4.5 weeks ago')
    t.notEqual(format_long_short_time(now + 4.5 * WEEK), '4.5 weeks hence')
    t.notEqual(
      format_long_short_time(now + 4.5 * WEEK, { format_duration_digit: 0 }),
      '4 weeks hence',
    )
    t.end()
  })

  test('format_digit', () => {
    t.equal(format_2_digit(12), '12')
    t.equal(format_2_digit(6), '06')

    t.equal(format_n_digit(6, 2), '06')
    t.equal(format_n_digit(6, 4), '0006')
    t.equal(format_n_digit(6, 1), '6')
    t.equal(format_n_digit(6, 0), '6')
    t.equal(format_n_digit(6, -10), '6')

    t.end()
  })
})
