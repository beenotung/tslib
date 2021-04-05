// run php -S 127.0.0.1:3000 first
import { checkedFetch, fetch } from '../../src/fetch'

import { jsonToFormData, postMultipartFormData } from '../../src/form'
import { JsonObject } from '../../src/json'
import { is2xxResponse } from '../../src/response'

function onData(data: any) {
  console.log('data:', data)
}

function onError(err: any) {
  console.error('error:', err)
}

async function test(name: string, f: (json: JsonObject) => Promise<string>) {
  console.log(`== ${name} ==`)
  console.log(`=== 200 check ===`)
  // prettier-ignore
  await f({ data: 'the data' })
    .then(onData)
    .catch(onError)
  console.log(`=== 404 check ===`)
  // prettier-ignore
  await f({ data: '404 check' })
    .then(onData)
    .catch(onError)
}

const url = 'http://127.0.0.1:3000/test/form/form-test.php'

async function main() {
  await test('postMultipartFormData', json =>
    postMultipartFormData(url, json)
      // .then(res => res.data as string)
      .then(
        res =>
          (is2xxResponse(res)
            ? Promise.resolve(res.data)
            : Promise.reject(res.data)) as Promise<string>,
      ))

  await test('fetch', json =>
    fetch(url, {
      method: 'POST',
      body: jsonToFormData(json) as any,
    }).then(res =>
      is2xxResponse(res)
        ? res.text()
        : res.text().then(reason => Promise.reject(reason)),
    ))

  await test('checkedFetch', json =>
    checkedFetch({
      input: url,
      init: { method: 'POST', body: jsonToFormData(json) as any },
      on2xx: res => res.text(),
      non2xx: res => Promise.reject(res.statusText),
    }))
}

main().catch(err => console.error('main error:', err))
