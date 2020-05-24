import { ReadStream } from 'fs'

export async function* stream_lines(stream: ReadStream) {
  let acc = ''
  for await (const chunk of stream) {
    acc += chunk
    for (;;) {
      const idx = acc.indexOf('\n')
      if (idx === -1) {
        break
      }
      const line = acc.slice(0, idx)
      yield line
      acc = acc.slice(idx + 1)
    }
  }
  if (acc.length > 0) {
    yield acc
  }
}
