import * as fs from 'fs'
import * as path from 'path'
import { readdir, readFile, rename, unlink, writeFile } from 'fs/promises'
import { proxyStore } from './store'
import { new_counter } from './counter'

export const counterSymbol = Symbol.for('counter')
export const dirpathSymbol = Symbol.for('dirpath')
export const asyncStoreSetItemResultsSymbol = Symbol.for(
  'asyncStoreSetItemResults',
)

export type AsyncStoreSetItemResult = Promise<void> & {
  hasCancel: boolean
  hasDone: boolean
  cancel: () => void
}

export class AsyncStore {
  private [counterSymbol] = new_counter()
  private [dirpathSymbol]: string
  private [asyncStoreSetItemResultsSymbol] = new Map<
    string,
    AsyncStoreSetItemResult
  >()

  private constructor(dirpath: string) {
    if (!fs.existsSync(dirpath)) {
      fs.mkdirSync(dirpath)
    }
    this[dirpathSymbol] = dirpath
  }

  async clear(): Promise<void> {
    const fs = await readdir(this[dirpathSymbol])
    await Promise.all(fs.map(f => unlink(path.join(this[dirpathSymbol], f))))
  }

  async getItem(key: string): Promise<string | null> {
    const b = await readFile(this.keyToPath(key))
    return b ? b.toString() : null
  }

  async getObject<T>(key: string): Promise<T | null> {
    return JSON.parse((await this.getItem(key)) as string)
  }

  async key(index: number): Promise<string | null> {
    return readdir(this[dirpathSymbol]).then(fs => {
      if (index < fs.length) {
        return this.getItem(encodeURIComponent(fs[index]))
      } else {
        return null
      }
    })
  }

  async keys(): Promise<string[]> {
    return readdir(this[dirpathSymbol]).then(fs =>
      fs.map(f => decodeURIComponent(f)),
    )
  }

  async length(): Promise<number> {
    return readdir(this[dirpathSymbol]).then(fs => fs.length)
  }

  async removeItem(key: string): Promise<void> {
    return unlink(this.keyToPath(key))
  }

  setItem(key: string, value: string): AsyncStoreSetItemResult {
    const tasks: Map<string, AsyncStoreSetItemResult> =
      this[asyncStoreSetItemResultsSymbol]
    if (tasks.has(key)) {
      const task = tasks.get(key)
      if (task && !task.hasDone) {
        task.cancel()
      }
    }

    const filepath = this.keyToPath(key)
    const tmpfile =
      filepath + '.' + Date.now() + '.' + this[counterSymbol].next()
    const status = {
      hasCancel: false,
      hasDone: false,
    }
    const p = writeFile(tmpfile, value)
      .then(() => {
        if (status.hasCancel) {
          return unlink(tmpfile)
        } else {
          return rename(tmpfile, filepath)
        }
      })
      .then(() => {
        status.hasDone = true
      })
      .catch(e => {
        status.hasDone = true
        return Promise.reject(e)
      })
    const newTask = Object.assign(p, status, {
      cancel: () => {
        status.hasCancel = true
      },
    })
    tasks.set(key, newTask)
    newTask.then(() => tasks.delete(key))
    return newTask
  }

  async setObject(key: string, value: any): Promise<void> {
    if (value === undefined) {
      return this.removeItem(key)
    }
    await this.setItem(key, JSON.stringify(value))
  }

  private keyToPath(key: string) {
    return path.join(this[dirpathSymbol], encodeURIComponent(key))
  }

  static create(dirpath: string): AsyncStore {
    const store = new AsyncStore(dirpath)
    return proxyStore<Promise<string | null>, Promise<void>, AsyncStore>(store)
  }
}
