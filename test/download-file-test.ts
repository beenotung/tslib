import { download_file } from '../src/download-file'

let url = 'http://localhost:8080/package.json'
let file = 'out.json'

url = 'http://localhost:5500/pnpm-lock.yaml'
file = 'out.yaml'

download_file(url, file, progress => console.log(progress))
  .catch(err => {
    console.error('failed to download_file, error:', err)
  })
  .then(() => {
    console.log('download_file passed')
  })
