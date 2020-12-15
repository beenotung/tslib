import { execSync } from 'child_process'

export function countFileLineSync(file: string): number {
  const res = execSync(`wc -l ${JSON.stringify(file)}`).toString()
  const size = parseInt(res, 10)
  return size
}
