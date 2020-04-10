import fs from 'fs'
import { readStreamByLine } from '../src/stream'
const stream = fs.createReadStream('package.json') as NodeJS.ReadableStream
readStreamByLine(
  stream,
  (line, lineNum) => console.log({ line, lineNum }),
  e => console.error({ e }),
  () => console.log('finished'),
)
  .on('data', data => console.log({ data }))
  .on('error', error => console.error({ error }))
