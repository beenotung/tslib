import { mkdir, writeFile } from '../src/fs';
import { VoidResultPool } from '../src/result-pool';
import { Result, then } from '../src/result';
import path = require('path');

const outDir = 'dist';

function writeF(i: number): Result<void> {
  // const writeF = fs.writeFileSync;
  const writeF = writeFile;
  return writeF(path.join(outDir, i.toString()), i.toString());
}

function genF(i: number): () => Result<void> {
  return () => {
    console.log('start:', i);
    return then(writeF(i), () => {
      console.log('end:', i);
    });
  };
}

async function test() {
  const poolSize = 8000;
  const pool = new VoidResultPool(poolSize);
  await mkdir(outDir).catch(e => e);
  const n = poolSize * 100;
  for (let i = 0; i < n; i++) {
    const f = genF(i);
    pool.run(f);
  }
}

test();
