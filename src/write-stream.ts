import { WriteStream } from 'fs';
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
