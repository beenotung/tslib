/**
 * reference: https://github.com/miguelmota/arraybuffer-to-buffer
 * modified to access Buffer only in run-time
 * (original implementation access it in init time)
 * */

const isArrayBufferSupported = (): boolean =>
  new Buffer(new Uint8Array([1]).buffer)[0] === 1

function arrayBufferToBufferAsArgument(ab: ArrayBuffer) {
  return new Buffer(ab)
}

function arrayBufferToBufferCycle(ab: ArrayBuffer) {
  const buffer = new Buffer(ab.byteLength)
  const view = new Uint8Array(ab)
  for (let i = 0; i < buffer.length; ++i) {
    buffer[i] = view[i]
  }
  return buffer
}

export function arrayBufferToBuffer(arrayBuffer: ArrayBuffer): Buffer {
  if (isArrayBufferSupported()) {
    return arrayBufferToBufferAsArgument(arrayBuffer)
  } else {
    return arrayBufferToBufferCycle(arrayBuffer)
  }
}
