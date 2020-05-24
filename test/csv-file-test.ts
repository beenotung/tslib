import fs from 'fs'
import {
  read_csv_file,
  read_csv_file_sync,
  write_csv_file,
  write_csv_file_sync,
} from '../src/csv-file'
import { catchMain } from '../src/node'

type Datum = {
  id: string
  name: string
}
const data: Datum[] = []
for (let i = 0; i < 1000; i++) {
  data.push({ id: i.toString(), name: 'user-' + i })
}
const filename = 'test.csv'
fs.writeFileSync(filename, '')

let parsed: Array<Record<string, string>>
let text: string
catchMain(
  (async () => {
    // sync write
    await write_csv_file_sync(filename, data, { wrap_line: true })
    text = fs.readFileSync(filename).toString()
    console.log('sync write:', text.length)

    // sync read
    parsed = []
    for (const record of read_csv_file_sync(filename, { wrap_line: true })) {
      parsed.push(record)
    }
    console.log('sync match:', JSON.stringify(data) === JSON.stringify(parsed))

    // async write
    await write_csv_file(filename, data, { wrap_line: true })
    text = fs.readFileSync(filename).toString()
    console.log('async write:', text.length)

    // async read
    parsed = []
    for await (const record of read_csv_file(filename, { wrap_line: true })) {
      parsed.push(record)
    }
    console.log('async match:', JSON.stringify(data) === JSON.stringify(parsed))
  })(),
)
