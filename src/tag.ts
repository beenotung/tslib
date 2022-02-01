function splitTagBy(tags: Set<string>, separator: string) {
  const res = new Set<string>()
  tags.forEach(s => s.split(separator).forEach(s => res.add(s)))
  return res
}

export function splitTags(tags: string): string[]
export function splitTags(tags: string[]): string[]
export function splitTags(tags: string[], otherTags: string): string[]
export function splitTags(
  stringOrArray: string[] | string,
  otherTags?: string,
): string[] {
  let acc: Set<string>
  if (typeof stringOrArray == 'string') {
    acc = new Set([stringOrArray])
  } else if (Array.isArray(stringOrArray)) {
    acc = new Set(stringOrArray)
  } else {
    throw new TypeError('Invalid argument, should be string or array of string')
  }
  if (typeof otherTags == 'string') {
    acc.add(otherTags)
  }
  acc = splitTagBy(acc, ' ')
  acc = splitTagBy(acc, ',')
  acc = splitTagBy(acc, '.')
  acc = splitTagBy(acc, '，')
  acc = splitTagBy(acc, '。')
  acc = splitTagBy(acc, '#')
  acc = splitTagBy(acc, '＃')
  acc = splitTagBy(acc, '"')
  acc = splitTagBy(acc, "'")
  return Array.from(acc).filter(s => s.length >= 2)
}
