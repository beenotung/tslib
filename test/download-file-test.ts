import { download_file } from '../src/download-file'

download_file('http://localhost:8080/package.json', 'out.json')
  .catch(err => {
    console.error('failed to download_file, error:', err)
  })
  .then(() => {
    console.log('download_file passed')
  })
