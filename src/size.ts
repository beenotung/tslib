export const KB = 1024
export const MB = 1024 * KB
export const GB = 1024 * MB

export const byteUnits = {
  B: 1,
  KB,
  MB,
  GB,
}
export type BytesUnit = keyof typeof byteUnits

export function parseByteSize(
  sizeText: string,
  defaultUnit: BytesUnit = 'B',
): number {
  const sizeNum = parseFloat(sizeText)
  const numText = sizeNum.toString()
  let unitText = sizeText.replace(numText, '').toUpperCase() as BytesUnit
  if (unitText !== 'B' && unitText.length === 1) {
    unitText += 'B'
  }
  const unit: number =
    byteUnits[unitText as BytesUnit] || byteUnits[defaultUnit] || 1
  return sizeNum * unit
}
