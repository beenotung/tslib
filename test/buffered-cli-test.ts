import { sleep } from '../src/async/wait'
import { BufferedCli } from '../src/buffered-cli'

let cli: BufferedCli

let spanners = ['001', '01', '1']

async function main() {
  async function test(name: string, fn: () => Promise<void>) {
    console.log('== ' + name + ' ==')
    cli = new BufferedCli()
    await fn()
    cli.end()
    console.log('='.repeat(3 + name.length + 3))
  }

  await test('inline message', async () => {
    for (let spanner of spanners) {
      cli.write(`line 1 | ${spanner}`)
      cli.flush()
      await sleep(1000)
    }
  })

  await test('multi-line message', async () => {
    for (let spanner of spanners) {
      cli.writeln(`line 1 | ${spanner}`)
      cli.writeln(`line 2 | ${spanner}`)
      cli.flush()
      await sleep(1000)
    }
  })

  await test('mixed-line message', async () => {
    for (let spanner of spanners) {
      cli.writeln(`line 1 | ${spanner}`)
      cli.writeln(`line 2 | ${spanner}`)
      cli.write(`line 3 | ${spanner}`)
      cli.flush()
      await sleep(1000)
    }
  })
}
main().catch(e => console.error(e))
