import * as fs from 'fs'
import { iterateFileByLine, IterateFileByLineOptions } from './fs'

export function iterateFileByLineWithProgressSync(
  options: {
    file: string
    initCallback?: (totalSize: number) => void
    eachLine: (args: {
      line: string
      totalSize: number
      lineNumber: number // starts at 0
      offset: number // by chars, not by bytes
    }) => void | 'break'
  } & IterateFileByLineOptions,
) {
  const stat = fs.statSync(options.file)
  const totalSize = stat.size
  options.initCallback?.(totalSize)
  let lineNumber = 0
  let offset = 0
  for (const line of iterateFileByLine(options.file)) {
    const result = options.eachLine({
      line,
      totalSize,
      lineNumber,
      offset,
    })
    lineNumber++
    offset += line.length + 1 // +1 for linefeed
    if (result === 'break') {
      break
    }
  }
}

export async function iterateFileByLineWithProgressAsync(
  options: {
    file: string
    initCallback?: (totalSize: number) => void
    eachLine: (args: {
      line: string
      totalSize: number
      lineNumber: number // starts at 0
      offset: number // by chars, not by bytes
    }) => Promise<void | 'break'>
  } & IterateFileByLineOptions,
) {
  const stat = fs.statSync(options.file)
  const totalSize = stat.size
  options.initCallback?.(totalSize)
  let lineNumber = 0
  let offset = 0
  for (const line of iterateFileByLine(options.file)) {
    const result = await options.eachLine({
      line,
      totalSize,
      lineNumber,
      offset,
    })
    lineNumber++
    offset += line.length + 1 // +1 for linefeed
    if (result === 'break') {
      break
    }
  }
}

/** @deprecated use sync/async version explicitly */
export let iterateFileByLineWithProgress = iterateFileByLineWithProgressSync
