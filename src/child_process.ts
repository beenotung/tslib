import {
  exec as _exec,
  spawn as _spawn,
  SpawnOptionsWithoutStdio,
} from 'child_process'
import * as util from 'util'

export const exec = util.promisify(_exec)

export function spawn(options: {
  cmd: string
  args?: string[]
  options?: SpawnOptionsWithoutStdio
  on_stdout?: (chunk: any) => void
  on_stderr?: (chunk: any) => void
  on_error?: (error: any) => void
}) {
  let { cmd, args } = options
  if (!args) {
    args = cmd.split(' ')
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    cmd = args.shift()!
  }
  return new Promise<number | null>((resolve, reject) => {
    const child = _spawn(cmd, args, options.options)
    child.stdout.setEncoding('utf8')
    child.stdout.on(
      'data',
      options.on_stdout || (data => process.stdout.write(data.toString())),
    )
    child.stderr.setEncoding('utf8')
    child.stderr.on(
      'data',
      options.on_stderr || (data => process.stderr.write(data.toString())),
    )
    child.on('error', err => {
      if (options.on_error) {
        options.on_error(err)
      } else {
        console.error(err)
        process.exit(1)
      }
    })
    child.on('close', code => {
      if (code) {
        reject(code)
      } else {
        resolve(code)
      }
    })
  })
}

/**
 * spawn a child process and return the stdout and stderr in promise
 *
 * the console is not used to output the stdout and stderr
 */
export async function spawnAndWait(options: {
  cmd: string
  args: string[]
  options?: SpawnOptionsWithoutStdio
}) {
  let stdout = ''
  let stderr = ''
  let error = null
  const code = await spawn({
    cmd: options.cmd,
    args: options.args,
    options: options.options,
    on_stdout: chunk => (stdout += chunk),
    on_stderr: chunk => (stderr += chunk),
    on_error: err => (error = err),
  })
  if (error) {
    throw error
  }
  return { code, stdout, stderr }
}
