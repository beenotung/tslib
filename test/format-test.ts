import { format_byte, format_datetime, format_relative_time } from '../src/format';
import { DAY, MINUTE, SECOND } from '../src/time';

console.log('size:', format_byte(412.5 * 1024 * 1024));
// size: 412.50 MB

console.log('time (default):', format_datetime(Date.now()));
// time (default): Mon, Mar 11, 2019, 11:56 AM
console.log('time (zh-hk):', format_datetime(Date.now(), { locales: 'zh-hk' }));
// time (zh-hk): 2019 M03 11, Mon 11:56 AM

console.log('time diff:', format_relative_time(12.5 * MINUTE));
// time diff: after 12.5 minutes
console.log('time diff:', format_relative_time(76 * DAY));
// time diff: after 2.5 months
console.log('time diff:', format_relative_time(-400 * DAY));
// time diff: 1.1 years ago
console.log('time diff:', format_relative_time(-1.5 * SECOND));
// time diff: 1.5 seconds ago
console.log('time diff:', format_relative_time(-1024 * SECOND));
// time diff: 17.1 minutes ago


