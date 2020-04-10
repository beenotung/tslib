export function dos2unix(s: string): string {
  return s.replace(/\r\n/g, '\n')
}

export function unix2dos(s: string): string {
  return s.replace(/\n/g, '\r\n')
}
