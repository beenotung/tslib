import * as path from 'path'
import * as fs from './fs'
import { Result } from './result'
import { TaskPool } from './task/task-pool'

export function createFSPool(concurrentSize: number) {
  const pool = new TaskPool(concurrentSize)
  const res = { ...fs }
  for (const [name, func] of Object.entries(fs)) {
    if (typeof func !== 'function' || name.endsWith('Sync')) {
      continue
    }
    ; (res as any)[name] = function() {
      const args = arguments
      // tslint:disable-next-line:ban-types
      return pool.runTask(() => (func as Function).apply(fs, args))
    }
  }
  const { lstat, readdir, stat } = res
  res.scanRecursively = async function scanRecursively(args: {
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
        await Promise.all(
          names.map(basename => {
            const childPathname = path.join(pathname, basename)
            return check(childPathname, basename)
          }),
        )
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
  return res
}
