import { Stream } from 'stream'

/**
 * @description lineNum start from 0
 * */
export function readStreamByLine(
  stream: NodeJS.ReadableStream,
  _onLine?: (line: string, lineNum: number) => void,
  _onError?: (e: Error) => void,
  _onComplete?: () => void,
) {
  const _lineStream = new Stream()
  let _lineNum = -1
  let acc = ''

  const onLine = (line: string) => {
    _lineNum++
    const data = { line, lineNum: _lineNum }
    _lineStream.emit('data', data)
    if (_onLine) {
      _onLine(line, _lineNum)
    }
  }
  const onError = (e: any) => {
    _lineStream.emit('error', e)
    if (_onError) {
      _onError(e)
    }
  }
  const onComplete = () => {
    if (acc !== '') {
      console.warn('stream ends without newline')
      onLine(acc)
    }
    _lineStream.emit('end')
    if (_onComplete) {
      _onComplete()
    }
  }

  stream.on('data', s => {
    acc += s
    const ss = acc.split('\n')
    if (ss.length === 1) {
      return
    }
    const n = ss.length - 1
    for (let i = 0; i < n; i++) {
      onLine(ss[i])
    }
    acc = ss[n]
  })
  stream.on('error', onError)
  stream.on('end', onComplete)

  return _lineStream
}

export function readStreamAllLine(
  stream: NodeJS.ReadableStream,
): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    const lines: string[] = []
    readStreamByLine(
      stream,
      line => lines.push(line),
      e => reject(e),
      () => resolve(lines),
    )
  })
}

export function readStreamAsString(
  stream: NodeJS.ReadableStream,
  lineFeed = '\n',
): Promise<string> {
  return readStreamAllLine(stream).then(lines => lines.join(lineFeed))
}
