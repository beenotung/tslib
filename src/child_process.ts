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
  let stdout = ''
  let stderr = ''
  return new Promise<number | null>((resolve, reject) => {
    const child = _spawn(cmd, args, options.options)
    child.stdout.setEncoding('utf8')
    child.stdout.on('data', data => {
      stdout += data.toString()
      if (options.on_stdout) {
        options.on_stdout(data)
      } else {
        process.stdout.write(data.toString())
      }
    })
    child.stderr.setEncoding('utf8')
    child.stderr.on('data', data => {
      stderr += data.toString()
      if (options.on_stderr) {
        options.on_stderr(data)
      } else {
        process.stderr.write(data.toString())
      }
    })
    child.on('error', err => {
      const error = new SpawnError(stdout, stderr)
      error.processError = err
      if (options.on_error) {
        options.on_error(error)
      }
      reject(error)
    })
    child.on('close', code => {
      if (code) {
        const error = new SpawnError(stdout, stderr)
        error.code = code
        if (options.on_error) {
          options.on_error(error)
        }
        reject(error)
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
