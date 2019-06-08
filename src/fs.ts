import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import { Result } from './result';

/** @deprecated use native typing instead */
export type readOptions =
  | { encoding?: string | null; flag?: string }
  | string
  | undefined
  | null;

/**
 * resolve :: Buffer
 * reject :: NodeJS.ErrnoException
 * */
export let readFile: typeof fs.readFile.__promisify__ = util.promisify(
  fs.readFile,
);
export let writeFile: typeof fs.writeFile.__promisify__ = util.promisify(
  fs.writeFile,
);
export let readdir: typeof fs.readdir.__promisify__ = util.promisify(
  fs.readdir,
);
export let unlink: typeof fs.unlink.__promisify__ = util.promisify(fs.unlink);
export let rename: typeof fs.rename.__promisify__ = util.promisify(fs.rename);
/** Does not dereference symbolic links. */
export let lstat: typeof fs.lstat.__promisify__ = util.promisify(fs.lstat);
/** Does dereference symbolic links */
export let stat: typeof fs.stat.__promisify__ = util.promisify(fs.stat);
export let mkdir: typeof fs.mkdir.__promisify__ = util.promisify(fs.mkdir);

function isNoFileError(e): true | Promise<any> {
  if (e.code === 'ENOENT') {
    return true;
  }
  return Promise.reject(e);
}

function not<T>(e: true | T): false | T {
  return e === true ? false : e;
}

export function exist(filename: string): Promise<boolean> {
  return stat(filename)
    .then(() => true)
    .catch(e => not(isNoFileError(e)));
}

export function hasFile(filename: string): Promise<boolean> {
  return stat(filename)
    .then(stat => stat.isFile())
    .catch(e => not(isNoFileError(e)));
}

export function hasDirectory(filename: string): Promise<boolean> {
  return stat(filename)
    .then(stat => stat.isDirectory())
    .catch(e => not(isNoFileError(e)));
}

/** @deprecated moved to write-stream.ts */
export { writeStream } from './write-stream';

export async function scanRecursively(args: {
  entryPath: string;
  onFile?: (filename: string, basename: string) => Result<void>;
  onDir?: (dirname: string, basename: string) => Result<void>;
  onComplete?: () => Result<void>;
  dereferenceSymbolicLinks?: boolean;
}) {
  const {
    entryPath,
    onFile,
    onDir,
    onComplete,
    dereferenceSymbolicLinks,
  } = args;
  const checkStat = dereferenceSymbolicLinks ? stat : lstat;
  const check = async (pathname: string, basename: string) => {
    const stat = await checkStat(pathname);
    if (stat.isDirectory()) {
      if (onDir) {
        await onDir(pathname, basename);
      }
      const names = await readdir(pathname);
      for (const basename of names) {
        const childPathname = path.join(pathname, basename);
        await check(childPathname, basename);
      }
      return;
    }
    if (onFile && stat.isFile()) {
      await onFile(pathname, basename);
      return;
    }
  };
  await check(entryPath, path.basename(entryPath));
  if (onComplete) {
    await onComplete();
  }
}
