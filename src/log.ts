/**
 * for Node.js
 * */

function to2Dig(n: number) {
  if (n < 10) {
    return '0' + n
  }
  return n.toString()
}

export function genLogFilename(name = 'log', ext = 'txt') {
  const d = new Date()
  const dateText = [
    d.getFullYear(),
    to2Dig(d.getMonth() + 1),
    to2Dig(d.getDate()),
    '-',
    to2Dig(d.getHours()),
    to2Dig(d.getMinutes()),
    to2Dig(d.getSeconds()),
  ].join('')
  return [name, dateText, ext].join('.')
}

function formatLog(args: IArguments) {
  const util = require('util')
  return util.format.apply(null, args)
}

export function wrapConsoleLog(filename = genLogFilename()) {
  const fs = require('fs')
  // Or 'w' to truncate the file every time the process starts.
  const logFile = fs.createWriteStream(filename, { flags: 'a' })

  console.log = function() {
    const text = formatLog(arguments) + '\n'
    logFile.write(text)
    process.stdout.write(text)
  }
  console.error = function() {
    const text = formatLog(arguments) + '\n'
    logFile.write(text)
    process.stderr.write(text)
  }
}
