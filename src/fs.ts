import * as fs from "fs";

/**
 * resolve :: Buffer
 * reject :: NodeJS.ErrnoException
 * */
export function readFile(filename: string): Promise<Buffer> ;
export function readFile(filename: string,
                         options: { encoding?: string | null; flag?: string; } | string | undefined | null): Promise<string | Buffer> ;
export function readFile(filename: string,
                         options?: { encoding?: string | null; flag?: string; } | string | undefined | null): Promise<string | Buffer> {
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

export function writeFile(filename: string,
                          data,
                          options: { encoding?: string | null; mode?: number | string; flag?: string; } | string | undefined | null): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, options, err => {
      err ? reject(err) : resolve();
    });
  });
}
