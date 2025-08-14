/** works in browser and node.js (using crypto.subtle) */
export async function hashAsync(
  message: string | BufferSource,
  options?: {
    algorithm?: { name: string } | string
    outputFormat: 'hex'
  },
): Promise<string>
export async function hashAsync(
  message: string | BufferSource,
  options?: {
    algorithm?: { name: string } | string
    outputFormat: 'ArrayBuffer'
  },
): Promise<ArrayBuffer>
export async function hashAsync(
  message: string | BufferSource,
  options?: {
    algorithm?: { name: string } | string
    outputFormat: 'Uint8Array'
  },
): Promise<Uint8Array>
export async function hashAsync(
  message: string | BufferSource,
  options: {
    algorithm?: { name: string } | string
    outputFormat?: 'hex' | 'ArrayBuffer' | 'Uint8Array'
  } = {},
): Promise<string | ArrayBuffer | Uint8Array> {
  let algorithm = options.algorithm
  if (!algorithm || algorithm == 'sha256') {
    algorithm = 'SHA-256'
  }
  const outputFormat = options.outputFormat || 'hex'

  const input =
    typeof message === 'string' ? new TextEncoder().encode(message) : message
  const digest = await crypto.subtle.digest(algorithm, input)
  if (outputFormat == 'ArrayBuffer') {
    return digest
  }
  const hash = new Uint8Array(digest)
  if (outputFormat == 'Uint8Array') {
    return hash
  }
  let hex = ''
  for (let i = 0; i < 32; i++) {
    const byte = hash[i]
    const str = byte.toString(16)
    if (byte < 16) {
      hex += '0' + str
    } else {
      hex += str
    }
  }
  return hex
}
