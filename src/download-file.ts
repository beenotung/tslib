/**
 * For Node
 * */

import * as fs from 'fs'
import type { IncomingMessage } from 'http'
import * as http from 'http'
import * as https from 'https'

/**
 * reference: https://stackoverflow.com/a/51624229/3156509
 * */
export const download_file = (url: string, file_path: string) =>
  new Promise<void>((resolve, reject) => {
    const callback = (response: IncomingMessage) =>
      response
        .pipe(fs.createWriteStream(file_path))
        // fs error
        .on('error', (err: any) => {
          reject(err)
        })
        .on('finish', () => {
          resolve()
        })
    if (url.startsWith('http://')) {
      return (
        http
          .get(url, callback)
          // network error
          .once('error', error => reject(error))
      )
    } else if (url.startsWith('https://')) {
      return (
        https
          .get(url, callback)
          // network error
          .once('error', error => reject(error))
      )
    } else {
      reject(new Error('unknown protocol, url: ' + url))
    }
  })
