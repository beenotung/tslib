import { readStreamByLine } from '../src';

var fs = require('fs');
var stream = fs.createReadStream('package.json') as NodeJS.ReadableStream;
readStreamByLine(stream,
  (line, lineNum) => console.log({ line, lineNum }),
  e => console.error({ e }),
  () => console.log('finished'),
)
  .on('data', data => console.log({ data }))
  .on('error', error => console.error({ error }))
;
