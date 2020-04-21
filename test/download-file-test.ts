import { download_file } from '../src/download-file'

download_file('http://127.0.0.4:80', 'out.html')
  .catch(err => {
    console.error('caught err:', err)
  })
  .then(() => {
    console.log('still can run other logics')
  })
