import { later } from '../src/async/wait'
import { ProgressCli } from '../src/progress-cli'

async function main() {
  let out = process.stderr
  let replaceChar = '='
  let cli = new ProgressCli({ out, replaceChar })

  let interval = 1000

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
// main().catch(e => console.error(e))

async function main2() {
  process.stdout.write('>')
  let cli = new ProgressCli()

  // test emoji
  // cli.write('👩‍💻')
  // cli.update('.')

  // cli.write('[1/2] 😀 天下')

  // test chinese
  cli.write('[1/2] 天下')
  cli.update('[2/2] en')

  cli.nextLine()
}
main2().catch(e => console.error(e))
