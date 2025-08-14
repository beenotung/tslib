import { BinaryLike, createHash } from 'crypto'

/** only works in node.js (using crypto module) */
export function hash(content: BinaryLike, algorithm = 'sha256'): Buffer {
  return createHash(algorithm).update(content).digest()
}
