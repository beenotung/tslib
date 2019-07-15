export function to_plural(word: string): string {
  if (word.endsWith('y')) {
    switch (word[word.length - 1 - 1]) {
      case 'a':
      case 'e':
      case 'i':
      case 'o':
      case 'u':
        break;
      default:
        return word.replace(/y$/, 'ies');
    }
  }
  return word + 's';
}
