export function catchMain(p: Promise<any>): void {
  p.catch(e => {
    console.error(e);
    process.exit(1);
  });
}

export function eraseChars(writeStream: NodeJS.WriteStream, n: number) {
  if (n < 1) {
    return;
  }
  writeStream.write(' '.repeat(n));
  writeStream.moveCursor(-n, 0);
}

export type StartTimerOptions =
  | string
  | {
      name: string;
      writeStream?: NodeJS.WriteStream;
    };

const defaultWriteStream = () => process.stdout;

export function startTimer(options: StartTimerOptions) {
  let name: string;
  let writeStream: NodeJS.WriteStream;
  if (typeof options === 'string') {
    name = options;
    writeStream = defaultWriteStream();
  } else {
    name = options.name;
    writeStream = options.writeStream || defaultWriteStream();
  }
  let msgLen = 0;
  const print = (msg: string) => {
    writeStream.moveCursor(-msgLen, 0);
    writeStream.write(msg);
    const newMsgLen = msg.length;
    eraseChars(writeStream, msgLen - newMsgLen);
    msgLen = newMsgLen;
  };
  const start = () => {
    writeStream.write(new Date().toLocaleString() + ': ' + name);
    print(' ...');
    // tslint:disable-next-line no-console
    console.time(name);
  };
  start();
  const end = () => {
    print('');
    writeStream.moveCursor(-name.length, 0);
    // tslint:disable-next-line no-console
    console.timeEnd(name);
  };
  let total = 0;
  let tick = 0;
  const progress = (msg: string) => {
    print(msg);
  };
  return {
    end,
    next(newName: string) {
      end();
      name = newName;
      start();
    },
    progress,
    setProgress(totalTick: number, initialTick = 0) {
      total = totalTick;
      tick = initialTick;
    },
    tick() {
      tick++;
      progress(` (${tick}/${total})`);
    },
  };
}
