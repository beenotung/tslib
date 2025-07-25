import { later } from '../src/async/wait'
import { ProgressCli } from '../src/progress-cli'

let interval = 1000

async function main1() {
  let out = process.stderr
  let replaceChar = '='
  let cli = new ProgressCli({ out, replaceChar })

  cli.write('progress: ', 'do-not-replace')

  out.write(replaceChar.repeat(30))
  out.moveCursor(-30, 0)

  await later(interval)
  cli.update('1/3: a long message ')

  await later(interval)
  cli.update('2/3: a longer message ')

  await later(interval)
  cli.update('3/3: a short message ')

  await later(interval)
  cli.update('finished ')

  await later(interval)
  cli.nextLine()
  cli.writeln('done.')
}

async function main2() {
  process.stdout.write('>')
  let cli = new ProgressCli()

  // test emoji
  await later(interval)
  cli.write('👩‍💻')
  await later(interval)
  cli.update('.')
  await later(interval)

  // test chinese
  // cli.write('[1/2] 天下')
  // await cli.update('[2/2] en')

  // //test both
  // cli.write('[1/2] 😀 天下')
  // await cli.update('[2/2] en')

  // // test combining characters
  // cli.write('[1/2] zh\u0300')
  // await cli.update('[2/2] en')

  cli.nextLine()
}

async function main() {
  await main1()
  await main2()
}
main().catch(e => console.error(e))
