import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'
import { Result } from './result'

export const copyFile: typeof fs.copyFile.__promisify__ = util.promisify(
  fs.copyFile,
)

/**
 * resolve :: Buffer
 * reject :: NodeJS.ErrnoException
 * */
export const readFile: typeof fs.readFile.__promisify__ = util.promisify(
  fs.readFile,
)
export const writeFile: typeof fs.writeFile.__promisify__ = util.promisify(
  fs.writeFile,
)
export const readdir: typeof fs.readdir.__promisify__ = util.promisify(
  fs.readdir,
)
export const unlink: typeof fs.unlink.__promisify__ = util.promisify(fs.unlink)
export const rename: typeof fs.rename.__promisify__ = util.promisify(fs.rename)
/** Does not dereference symbolic links. */
export const lstat: typeof fs.lstat.__promisify__ = util.promisify(fs.lstat)
/** Does dereference symbolic links */
export const stat: typeof fs.stat.__promisify__ = util.promisify(fs.stat)
export const mkdir: typeof fs.mkdir.__promisify__ = util.promisify(fs.mkdir)
export const exists: typeof fs.exists.__promisify__ = util.promisify(fs.exists)

function isNoFileError(e: any): true | Promise<any> {
  if (e.code === 'ENOENT') {
    return true
  }
  return Promise.reject(e)
}

function not<T>(e: true | T): false | T {
  return e === true ? false : e
}

export function exist(filename: string): Promise<boolean> {
  return stat(filename)
    .then(() => true)
    .catch(e => not(isNoFileError(e)))
}

export function hasFile(filename: string): Promise<boolean> {
  return stat(filename)
    .then(stat => stat.isFile())
    .catch(e => not(isNoFileError(e)))
}

export function hasDirectory(filename: string): Promise<boolean> {
  return stat(filename)
    .then(stat => stat.isDirectory())
    .catch(e => not(isNoFileError(e)))
}

export async function scanRecursively(args: {
  entryPath: string
  onFile?: (filename: string, basename: string) => Result<void>
  onDir?: (dirname: string, basename: string) => Result<void>
  onComplete?: () => Result<void>
  dereferenceSymbolicLinks?: boolean
  skipDir?: (dirname: string, basename: string) => boolean
}) {
  const {
    entryPath,
    onFile,
    onDir,
    onComplete,
    dereferenceSymbolicLinks,
    skipDir,
  } = args
  const checkStat = dereferenceSymbolicLinks ? stat : lstat
  const check = async (pathname: string, basename: string) => {
    const stat = await checkStat(pathname)
    if (stat.isDirectory()) {
      if (onDir) {
        await onDir(pathname, basename)
      }
      if (skipDir && skipDir(pathname, basename)) {
        return
      }
      const names = await readdir(pathname)
      for (const basename of names) {
        const childPathname = path.join(pathname, basename)
        await check(childPathname, basename)
      }
      return
    }
    if (onFile && stat.isFile()) {
      await onFile(pathname, basename)
      return
    }
  }
  await check(entryPath, path.basename(entryPath))
  if (onComplete) {
    await onComplete()
  }
}

export function scanRecursivelySync(args: {
  entryPath: string
  onFile?: (filename: string, basename: string) => void
  onDir?: (dirname: string, basename: string) => void
  onComplete?: () => void
  dereferenceSymbolicLinks?: boolean
  skipDir?: (dirname: string, basename: string) => boolean
}) {
  const {
    entryPath,
    onFile,
    onDir,
    onComplete,
    dereferenceSymbolicLinks,
    skipDir,
  } = args
  const checkStat = dereferenceSymbolicLinks ? fs.statSync : fs.lstatSync
  const check = (pathname: string, basename: string) => {
    const stat = checkStat(pathname)
    if (stat.isDirectory()) {
      if (onDir) {
        onDir(pathname, basename)
      }
      if (skipDir && skipDir(pathname, basename)) {
        return
      }
      const names = fs.readdirSync(pathname)
      for (const basename of names) {
        const childPathname = path.join(pathname, basename)
        check(childPathname, basename)
      }
      return
    }
    if (onFile && stat.isFile()) {
      onFile(pathname, basename)
      return
    }
  }
  check(entryPath, path.basename(entryPath))
  if (onComplete) {
    onComplete()
  }
}

export function readJsonFile(file: string): Promise<any> {
  return readFile(file).then(buffer => JSON.parse(buffer.toString()))
}

export function readJsonFileSync(file: string): any {
  return JSON.parse(fs.readFileSync(file).toString())
}

export function writeJsonFile(
  file: string,
  value: any,
  options?: { format?: boolean },
): Promise<any> {
  const text = options?.format
    ? JSON.stringify(value, null, 2)
    : JSON.stringify(value)
  return writeFile(file, text)
}

export function writeJsonFileSync(
  file: string,
  value: any,
  options?: { format?: boolean },
): any {
  const text = options?.format
    ? JSON.stringify(value, null, 2)
    : JSON.stringify(value)
  return fs.writeFileSync(file, text)
}

export type IterateFileByLineOptions = {
  encoding?: BufferEncoding
  batchSize?: number // default is 8MB
  close?: () => void // teardown when the consumer early return
}

/**
 * linefeed "\n" is omitted from the yielded value
 * but "\r" if exists is preserved as is
 * */
export function* iterateFileByLine(
  file: string,
  options?: IterateFileByLineOptions,
): Generator<string> {
  const batchSize = options?.batchSize || 8 * 1024 * 1024
  const encoding = options?.encoding
  const buffer = Buffer.alloc(batchSize)

  const fd = fs.openSync(file, 'r')
  if (options) {
    options.close = () => fs.closeSync(fd)
  }
  let acc = Buffer.alloc(0)
  for (;;) {
    const read = fs.readSync(fd, buffer, 0, batchSize, null)
    if (read === 0) {
      break
    }
    acc = Buffer.concat([acc, buffer], acc.length + read)
    for (;;) {
      const idx = acc.indexOf(10)
      if (idx === -1) {
        break
      }
      const line = acc.slice(0, idx)
      yield line.toString(encoding)
      acc = acc.slice(idx + 1)
    }
  }
  if (acc.length > 0) {
    yield acc.toString(encoding)
  }
  fs.closeSync(fd)
}

export function verboseWriteFileSync(file: string, content: string | Buffer) {
  fs.writeFileSync(file, content)
  // eslint-disable-next-line no-console
  console.log('saved to', file)
}
