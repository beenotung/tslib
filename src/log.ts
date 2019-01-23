
function to2Dig(n: number) {
  if (n < 10) {
    return '0' + n;
  }
  return n.toString();
}

export function genLogFilename(name = 'log', ext = 'txt') {
  const d = new Date();
  const dateText = [
    d.getFullYear(),
    to2Dig(d.getMonth() + 1),
    to2Dig(d.getDate()),
    '-',
    to2Dig(d.getHours()),
    to2Dig(d.getMinutes()),
    to2Dig(d.getSeconds()),
  ].join('');
  return [name, dateText, ext].join('.');
}

export function wrapConsoleLog(filename = genLogFilename()) {
  const fs = require('fs');
  const util = require('util');
  const logFile = fs.createWriteStream(filename, { flags: 'a' });
  // Or 'w' to truncate the file every time the process starts.
  const logStdout = process.stdout;

  console.log = function() {
    logFile.write(util.format.apply(null, arguments) + '\n');
    logStdout.write(util.format.apply(null, arguments) + '\n');
  };
  console.error = console.log;
}
