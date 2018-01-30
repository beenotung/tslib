import * as event_stream from "event-stream";

export function readStreamByLine(stream: NodeJS.ReadableStream, onLine: (line: string) => void, onError: (e: Error) => void, onComplete: () => void) {
  stream
    .pipe(event_stream.split('\n'))
    .pipe(event_stream.mapSync((line: string) => {
      if (line) {
        onLine(line)
      }
    }))
    .on('error', onError)
    .on('end', onComplete)
}
