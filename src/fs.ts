import * as fs from 'fs'
import * as path from 'path'
import * as util from 'util'
import { Result } from './result'

export let copyFile: typeof fs.copyFile.__promisify__ = util.promisify(
  fs.copyFile,
)

/** @deprecated use native typing instead */
export type readOptions =
  | { encoding?: string | null; flag?: string }
  | string
  | undefined
  | null

/**
 * resolve :: Buffer
 * reject :: NodeJS.ErrnoException
 * */
export let readFile: typeof fs.readFile.__promisify__ = util.promisify(
  fs.readFile,
)
export let writeFile: typeof fs.writeFile.__promisify__ = util.promisify(
  fs.writeFile,
)
export let readdir: typeof fs.readdir.__promisify__ = util.promisify(fs.readdir)
export let unlink: typeof fs.unlink.__promisify__ = util.promisify(fs.unlink)
export let rename: typeof fs.rename.__promisify__ = util.promisify(fs.rename)
/** Does not dereference symbolic links. */
export let lstat: typeof fs.lstat.__promisify__ = util.promisify(fs.lstat)
/** Does dereference symbolic links */
export let stat: typeof fs.stat.__promisify__ = util.promisify(fs.stat)
export let mkdir: typeof fs.mkdir.__promisify__ = util.promisify(fs.mkdir)
export let exists: typeof fs.exists.__promisify__ = util.promisify(fs.exists)

function isNoFileError(e: any): true | Promise<any> {
  if (e.code === 'ENOENT') {
    return true
  }
  return Promise.reject(e)
}

function not<T>(e: true | T): false | T {
  return e === true ? false : e
}

/**@deprecated*/
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

/** @deprecated moved to write-stream.ts */
export { writeStream } from './write-stream'

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
