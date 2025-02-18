/**
 * For Node
 * */

import { createWriteStream } from 'fs'
import { Readable } from 'stream'
import { finished } from 'stream/promises'

export type Options = {
  url: string
  file: string
  onProgress?: (progress: Progress) => void
}

type Progress = {
  total?: number
  current: number
  chunk: number
}

export async function download_file(
  url: string,
  file: string,
  onProgress?: (progress: Progress) => void,
): Promise<void>
export async function download_file(options: Options): Promise<void>
export async function download_file(
  arg1: string | Options,
  arg2?: string,
  arg3?: (progress: Progress) => void,
): Promise<void> {
  const url = typeof arg1 === 'string' ? arg1 : arg1.url
  const file = typeof arg1 === 'string' ? arg2! : arg1.file
  const onProgress = typeof arg1 === 'string' ? arg3 : arg1.onProgress
  const res = await fetch(url)
  if (!(200 <= res.status && res.status <= 299)) {
    throw res
  }
  if (!onProgress) {
    // reference: https://stackoverflow.com/a/51302466
    await finished(
      Readable.fromWeb(res.body as any).pipe(createWriteStream(file)),
    )
    return
  }

  const total = Number(res.headers.get('content-length')) || undefined
  let current = 0
  const stream = createWriteStream(file)
  for await (const chunk of res.body as any) {
    stream.write(chunk)
    current += chunk.length
    onProgress({ total, current, chunk: chunk.length })
  }
  stream.close()
}
