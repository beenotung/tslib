/**
 * For Node
 * */

import axios from 'axios';
import * as fs from 'fs';

/**
 * reference: https://stackoverflow.com/a/51624229/3156509
 * */
export const download_file = (url: string, file_path: string) =>
  axios({
    url,
    responseType: 'stream',
  }).then(
    response =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(file_path))
          .on('finish', () => resolve())
          .on('error', (e: any) => reject(e));
      }),
  );
