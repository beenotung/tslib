import { WriteStream } from 'fs'

export namespace writeStream {
  export function write(
    stream: WriteStream,
    // string or buffer only?
    chunk: any,
    encoding?: BufferEncoding,
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (encoding) {
        const res: boolean = stream.write(chunk, encoding, (err: any) =>
          err ? reject(err) : resolve(res),
        )
      } else {
        const res: boolean = stream.write(chunk, (err: any) =>
          err ? reject(err) : resolve(res),
        )
      }
    })
  }
}
