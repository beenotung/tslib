export function catchMain(p: Promise<any>): void {
  p.catch(e => {
    console.error(e)
    process.exit(1)
  })
}

export function eraseChars(writeStream: NodeJS.WriteStream, n: number) {
  if (n < 1) {
    return
  }
  writeStream.write(' '.repeat(n))
  if (writeStream.moveCursor) {
    writeStream.moveCursor(-n, 0)
  }
}
