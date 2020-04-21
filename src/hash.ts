import { createHash } from 'crypto'

export function hash(
  content: Buffer | string,
  algorithm = 'sha256',
): string | Buffer {
  const stream = createHash(algorithm)
  stream.write(content)
  stream.end()
  return stream.read()
}
