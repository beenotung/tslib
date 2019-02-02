import * as fs from 'fs';
import * as path from 'path';
import { readdir, readFile, rename, unlink, writeFile } from './fs';
import { new_counter } from './uuid';

export class AsyncStore {
  counter = new_counter();

  constructor(public dirpath: string) {
    if (!fs.existsSync(dirpath)) {
      fs.mkdirSync(dirpath);
    }
  }

  async clear(): Promise<void> {
    const fs = await readdir(this.dirpath);
    await Promise.all(fs.map(f => unlink(path.join(this.dirpath, f))));
  }

  async getItem(key: string): Promise<string | null> {
    const b = await readFile(this.keyToPath(key));
    return b ? b.toString() : null;
  }

  async getObject<T>(key: string): Promise<T | null> {
    return JSON.parse(await this.getItem(key));
  }

  async key(index: number): Promise<string | null> {
    return readdir(this.dirpath).then(fs => {
      if (index < fs.length) {
        return this.getItem(encodeURIComponent(fs[index]));
      } else {
        return null;
      }
    });
  }

  async keys(): Promise<string[]> {
    return readdir(this.dirpath).then(fs => fs.map(f => decodeURIComponent(f)));
  }

  async length(): Promise<number> {
    return readdir(this.dirpath).then(fs => fs.length);
  }

  async removeItem(key: string): Promise<void> {
    return unlink(this.keyToPath(key));
  }

  async setItem(key: string, value: string): Promise<void> {
    const filepath = this.keyToPath(key);
    const tmpfile = filepath + '.' + Date.now() + '.' + this.counter.next();
    await writeFile(tmpfile, value);
    await rename(tmpfile, filepath);
  }

  async setObject(key: string, value): Promise<void> {
    if (value === undefined) {
      return this.removeItem(key);
    }
    await this.setItem(key, JSON.stringify(value));
  }

  private keyToPath(key: string) {
    return path.join(this.dirpath, encodeURIComponent(key));
  }
}
