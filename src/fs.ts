import * as fs from "fs";

/**
 * resolve :: Buffer
 * reject :: NodeJS.ErrnoException
 * */
export function readFile(filename): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
