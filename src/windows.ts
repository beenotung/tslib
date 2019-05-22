export function fixWindowsFilename(s: string): string {
  return (
    s
      /* replace : to Modifier Letter Colon (U+A789) */
      .replace(/:/g, '꞉')
      .replace(/</g, '＜')
      .replace(/>/g, '＞')
      .replace(/\|/g, '｜')
      .replace(/\?/g, '？')
      .replace(/\*/g, '＊')
      .replace(/"/g, "''")
      .replace('', '')
  );
}
