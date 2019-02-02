import * as fs from 'fs';
import { WriteStream } from 'fs';
import * as util from 'util';

export type readOptions =
  | { encoding?: string | null; flag?: string }
  | string
  | undefined
  | null;

/**
 * resolve :: Buffer
 * reject :: NodeJS.ErrnoException
 * */
export function readFile(filename: string): Promise<Buffer>;
export function readFile(
  filename: string,
  options: readOptions,
): Promise<string | Buffer>;
export function readFile(
  filename: string,
  options?: readOptions,
): Promise<string | Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, options, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

export type writeOptions =
  | { encoding?: string | null; mode?: number | string; flag?: string }
  | string
  | undefined
  | null;

export function writeFile(
  filename: string,
  data,
  options?: writeOptions,
): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, options, err => {
      err ? reject(err) : resolve();
    });
  });
}

export let readdir: typeof fs.readdir.__promisify__ = util.promisify(
  fs.readdir,
);
export let unlink: typeof fs.unlink.__promisify__ = util.promisify(fs.unlink);
export let rename: typeof fs.rename.__promisify__ = util.promisify(fs.rename);

export namespace writeStream {
  export function write(
    stream: WriteStream,
    chunk,
    encoding?: string,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (encoding) {
        const res = stream.write(chunk, encoding, err =>
          err ? reject(err) : resolve(res),
        );
      } else {
        const res = stream.write(chunk, err =>
          err ? reject(err) : resolve(res),
        );
      }
    });
  }
}
