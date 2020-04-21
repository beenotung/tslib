import { filesForEach } from '../src/file'
import { compressMobilePhoto } from '../src/image'

const meta = document.createElement('meta')
meta.name = 'viewport'
meta.content =
  'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'
document.head.appendChild(meta)

const input = document.createElement('input')
input.type = 'file'
input.onchange = () => {
  const files = input.files
  if (!files) {
    return
  }
  filesForEach(files, file => {
    compressMobilePhoto({ image: file }).then(base64 => {
      const image = document.createElement('img')
      image.src = base64
      image.style.maxWidth = '100%'
      document.body.appendChild(image)
    })
  })
}
document.body.appendChild(input)
document.body.appendChild(document.createElement('br'))
