import { BinaryLike, createHash } from 'crypto'

export function hash(content: BinaryLike, algorithm = 'sha256'): Buffer {
  return createHash(algorithm).update(content).digest()
}
