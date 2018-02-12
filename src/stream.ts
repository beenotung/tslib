import * as event_stream from "event-stream";

/**
 * lineNum start from 0
 * */
export function readStreamByLine(stream: NodeJS.ReadableStream
  , onLine: (line: string, lineNum: number) => void
  , onError: (e: Error) => void
  , onComplete: () => void) {
  let lineNum = -1;
  let hasFail = false;
  stream
    .pipe(event_stream.split("\n"))
    .pipe(event_stream.mapSync((line: string) => {
      if (hasFail) {
        return;
      }
      lineNum++;
      if (line) {
        try {
          onLine(line, lineNum);
        } catch (e) {
          hasFail = true;
          onError(e);
        }
      }
    }))
    .on("error", onError)
    .on("end", onComplete);
}
