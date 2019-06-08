import { scanRecursively } from '../src/fs';
import { catchMain } from '../src/node';
import * as path from 'path';

let separator = ' | ';
catchMain(scanRecursively({
  entryPath: path.join(process.env.HOME, 'Music'),
  dereferenceSymbolicLinks: true,
  onDir: (dirname, basename) => {
    console.log(['onDir', basename, dirname].join(separator));
  },
  onFile: (filename, basename) => {
    console.log(['onFile', basename, filename].join(separator));
  },
  onComplete: () => {
    console.log('onComplete');
  },
}));

