import * as test from 'tape';
import { format_2_digit, format_byte, format_datetime, format_n_digit, format_relative_time } from '../src/format';
import { DAY, MINUTE, SECOND } from '../src/time';

test('format_byte', t => {
  t.equal(format_byte(412.5 * 1024 * 1024), '412.50 MB', 'format size');
  t.end();
});

test('format_datetime', t => {
  let time = new Date('2019-03-11T03:56:00.000Z').getTime();
  t.equal(format_datetime(time), 'Mon, Mar 11, 2019, 11:56 AM', 'format time (default)');
  // node v10
  t.equal(format_datetime(time, { locales: 'zh-hk' }), 'Mon, Mar 11, 2019, 11:56 AM', 'format time (zh-hk)');
  // node v8
  // t.equal( format_datetime(time, { locales: 'zh-hk' }), '2019 Mar 11, Mon 11:56 AM','format time (zh-hk)');
  t.end();
});

test('format_relative_time', t => {
  t.equal(format_relative_time(12.5 * MINUTE), '12.5 minutes hence');
  t.equal(format_relative_time(76 * DAY), '2.5 months hence');
  t.equal(format_relative_time(-400 * DAY), '1.1 years ago');
  t.equal(format_relative_time(-1.5 * SECOND), '1.5 seconds ago');
  t.equal(format_relative_time(-1024 * SECOND), '17.1 minutes ago');
  t.end();
});

test('format_digit', t => {
  t.equal(format_2_digit(12), '12');
  t.equal(format_2_digit(6), '06');

  t.equal(format_n_digit(6, 2), '06');
  t.equal(format_n_digit(6, 4), '0006');
  t.equal(format_n_digit(6, 1), '6');
  t.equal(format_n_digit(6, 0), '6');
  t.equal(format_n_digit(6, -10), '6');

  t.end();
});
