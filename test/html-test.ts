import {displayJSON, setDateFormatLocale, setDateFormatter} from "../src/html";
import {HOUR} from "../src/time";

const d = new Date("12/01/2018 13:05:21 GMT+0800 (HKT)");
const html = displayJSON(d);
console.log({
  d
  , html
});

setDateFormatter(x => {
  console.log('calling custom date formatter');
  const d = new Date(x.toUTCString().replace('GMT', ''));
  d.setTime(d.getTime() - 8 * HOUR);
  return d.toUTCString().replace('GMT', 'GMT-8 (PST)');
});
const html2 = displayJSON(d);
console.log({
  d
  , html2
});

setDateFormatLocale("en", "America/Los_Angeles");
const html3 = displayJSON(d);
console.log({
  d
  , html3
});
