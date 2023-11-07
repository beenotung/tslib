import { mkdirSync, readFileSync, statSync, writeFileSync } from 'fs'
import { readFile, writeFile, stat } from 'fs/promises'
import { appendIgnoreLine } from './ignore'
import { join } from 'path'

export type CacheDirOptions = {
  /** @default '.cache' */
  dir?: string

  /** @default 15*60*1000 (15 minutes) */
  expireInterval?: number

  /** @default '.gitignore' (false to skip auto append) */
  gitignore?: string | false
}

export class CacheDir {
  dir: string
  expireInterval: number
  constructor(options?: CacheDirOptions) {
    this.dir = options?.dir || '.cache'
    this.expireInterval = options?.expireInterval || 15 * 60 * 1000
    mkdirSync(this.dir, { recursive: true })
    if (options?.gitignore !== false) {
      appendIgnoreLine(options?.gitignore || '.gitignore', this.dir)
    }
  }

  runSync(args: { filename: string; fn: () => string; as?: 'string' }): string
  runSync(args: { filename: string; fn: () => Buffer; as?: 'buffer' }): Buffer
  runSync(args: {
    filename: string
    fn: () => string | Buffer
    as?: 'string' | 'buffer'
  }): string | Buffer {
    const file = join(this.dir, args.filename)
    try {
      const stats = statSync(file)
      const passedTime = Date.now() - stats.mtimeMs
      if (passedTime < this.expireInterval) {
        return readFileSync(file)
      }
    } catch (error) {
      // file not exists or name clash with directory
    }
    const result = args.fn()
    writeFileSync(file, result)
    return result
  }

  runAsync(args: {
    filename: string
    fn: () => Promise<string>
    as?: 'string'
  }): Promise<string>
  runAsync(args: {
    filename: string
    fn: () => Promise<Buffer>
    as?: 'buffer'
  }): Promise<Buffer>
  async runAsync(args: {
    filename: string
    fn: () => Promise<string | Buffer>
    as?: 'string' | 'buffer'
  }): Promise<string | Buffer> {
    const file = join(this.dir, args.filename)
    try {
      const stats = await stat(file)
      const passedTime = Date.now() - stats.mtimeMs
      if (passedTime < this.expireInterval) {
        return await readFile(file)
      }
    } catch (error) {
      // file not exists or name clash with directory
    }
    const result = await args.fn()
    writeFile(file, result)
    return result
  }
}
