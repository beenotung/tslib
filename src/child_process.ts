import {
  exec as _exec,
  spawn as _spawn,
  SpawnOptionsWithoutStdio,
} from 'child_process'
import * as util from 'util'

export const exec = util.promisify(_exec)

export class SpawnError extends Error {
  public processError?: any
  public code?: number
  constructor(
    public stdout: string,
    public stderr: string,
  ) {
    super()
  }
}

/**
 * Won't throw error, the error handling should be done in callback and if-throw style.
 * Use spawnAndWait if you want error handling in try-catch style.
 */
export async function spawn(options: {
  cmd: string
  args?: string[]
  options?: SpawnOptionsWithoutStdio
  on_stdout?: (chunk: any) => void
  on_stderr?: (chunk: any) => void
  on_error?: (error: any) => void
}): Promise<number | null> {
  let { cmd, args } = options
  if (!args) {
    args = cmd.split(' ')
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    cmd = args.shift()!
  }
  const code = await new Promise<number | null>(resolve => {
    const child = _spawn(cmd, args, options.options)
    child.stdout.setEncoding('utf8')
    child.stdout.on('data', data => {
      if (options.on_stdout) {
        options.on_stdout(data)
      } else {
        process.stdout.write(data.toString())
      }
    })
    child.stderr.setEncoding('utf8')
    child.stderr.on('data', data => {
      if (options.on_stderr) {
        options.on_stderr(data)
      } else {
        process.stderr.write(data.toString())
      }
    })
    child.on('error', err => {
      if (options.on_error) {
        options.on_error(err)
      } else {
        console.error(err)
      }
      resolve(null)
    })
    child.on('close', code => {
      resolve(code)
    })
  })
  return code
}

/**
 * spawn a child process and return the stdout and stderr in promise
 *
 * the console is not used to output the stdout and stderr
 *
 * the error stack is preserved (avoided lost in native event loop)
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
  if (error || code) {
    const spawnError = new SpawnError(stdout, stderr)
    if (error) {
      spawnError.processError = error
    }
    if (code) {
      spawnError.code = code
    }
    throw spawnError
  }
  return { code, stdout, stderr }
}
