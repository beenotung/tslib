/**
 * For Node
 * */

import { createWriteStream } from 'fs'
import { Readable } from 'stream'
import { finished } from 'stream/promises'

/**
 * reference: https://stackoverflow.com/a/51302466
 * */
export async function download_file(url: string, file_path: string) {
  const res = await fetch(url)
  if (!(200 <= res.status && res.status <= 299)) {
    throw res
  }
  await finished(
    Readable.fromWeb(res.body as any).pipe(createWriteStream(file_path)),
  )
}
