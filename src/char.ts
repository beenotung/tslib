/** count how many full-width characters in the given string */
export function countFullWidthChars(str: string): number {
  let count = 0
  for (const char of str) {
    const code = char.charCodeAt(0)
    // Full-width characters range
    if (
      (code >= 0x1100 && code <= 0x115f) || // Hangul Jamo
      (code >= 0x2e80 && code <= 0xa4cf) || // CJK, Yi, etc.
      (code >= 0xac00 && code <= 0xd7a3) || // Hangul Syllables
      (code >= 0xf900 && code <= 0xfaff) || // CJK Compatibility Ideographs
      (code >= 0xfe10 && code <= 0xfe6f) || // Vertical, Compatibility forms
      (code >= 0xff00 && code <= 0xff60) || // Fullwidth ASCII variants
      (code >= 0xffe0 && code <= 0xffe6) // Fullwidth symbol variants
    ) {
      count++
    }
  }
  return count
}
