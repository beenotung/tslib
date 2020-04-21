import { postMultipartFormData } from '../../src/form'
import { is2xxResponse } from '../../src/response'

const url = 'http://localhost:3000/file/single'

const input = document.createElement('input')
input.type = 'file'
input.onchange = () => {
  for (let i = 0; i < input.files!.length; i++) {
    const file = input.files!.item(i)!
    const formData = new FormData()
    formData.append('file', file)
    postMultipartFormData(url, { file })
      .then(res => {
        if (is2xxResponse(res)) {
          return 'ok: ' + JSON.stringify(res)
        } else {
          return 'error: ' + JSON.stringify(res)
        }
      })
      .then(res => {
        console.log(res)
        const p = document.createElement('p')
        p.textContent = res
        document.body.appendChild(p)
      })
  }
}
document.body.appendChild(input)
