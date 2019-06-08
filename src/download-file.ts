/**
 * For Node
 * */

import axios from 'axios';
import * as fs from 'fs';

/**
 * source: https://stackoverflow.com/a/51624229/3156509
 * */
export const download_file = (url: string, image_path: string) =>
  axios({
    url,
    responseType: 'stream',
  })
    .then(response => {
      response.data.pipe(fs.createWriteStream(image_path));

      return {
        status: true,
        error: '',
      };
    })
    .catch(error => ({
      status: false,
      error: 'Error: ' + error.message,
    }));
