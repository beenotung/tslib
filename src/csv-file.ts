/**
 * for processing large data set, then will run out of memory if use csv.ts directly
 * */
import fs from 'fs'
import {
  csv_to_json,
  from_csv,
  json_to_csv,
  json_to_csv_titles,
  to_csv,
} from './csv'
import { stream_lines } from './generator'

function wrapLine(s: string): string {
  return s.replace(/\n/g, '\\n')
}

function unwrapLine(s: string): string {
  return s.replace(/\\n/g, '\n')
}

function wrapObjectLine(o: object, titles: string[]): object {
  const res: any = {}
  for (const key of titles) {
    let value = (o as any)[key]
    if (typeof value === 'string') {
      value = wrapLine(value)
    }
    res[key] = value
  }
  return res
}

function unwrapObjectLine(o: object, titles: string[]): void {
  for (const key of titles) {
    let value = (o as any)[key]
    if (typeof value === 'string') {
      value = unwrapLine(value)
      ; (o as any)[key] = value
    }
  }
}

export function write_csv_file(
  filename: string,
  records: object[],
  options?: {
    titles?: string[]
    separator?: string
    delimiter?: string
    wrap_line?: boolean
    skip_titles?: boolean
  },
) {
  return new Promise<any>((resolve, reject) => {
    let stream: fs.WriteStream | undefined
    try {
      stream = fs.createWriteStream(filename)
      const is_wrap_line = options?.wrap_line
      const separator = options?.separator
      const delimiter = options?.delimiter
      let titles = options?.titles || json_to_csv_titles(records)
      if (is_wrap_line) {
        titles = titles.map(wrapLine)
      }
      let first = true
      for (let record of records) {
        if (is_wrap_line) {
          record = wrapObjectLine(record, titles)
        }
        let rows = json_to_csv([record], titles)
        if (first) {
          first = false // include titles
          if (options?.skip_titles) {
            rows = [rows[1]] // skip titles
          }
        } else {
          rows = [rows[1]] // skip titles
        }
        const text = to_csv(rows, separator, delimiter)
        stream.write(text)
      }
      stream.close()
      stream.on('close', resolve)
      stream.on('error', reject)
    } catch (e) {
      stream?.close()
      reject(e)
    }
  })
}

export function write_csv_file_sync(
  filename: string,
  records: object[],
  options?: {
    titles?: string[]
    separator?: string
    delimiter?: string
    wrap_line?: boolean
    skip_titles?: boolean
  },
) {
  const is_wrap_line = options?.wrap_line
  const separator = options?.separator
  const delimiter = options?.delimiter
  let titles = options?.titles || json_to_csv_titles(records)
  if (is_wrap_line) {
    titles = titles.map(wrapLine)
  }
  let first = true
  fs.writeFileSync(filename, '')
  for (let record of records) {
    if (is_wrap_line) {
      record = wrapObjectLine(record, titles)
    }
    let rows = json_to_csv([record], titles)
    if (first) {
      first = false // include titles
      if (options?.skip_titles) {
        rows = [rows[1]] // skip titles
      }
    } else {
      rows = [rows[1]] // skip titles
    }
    const text = to_csv(rows, separator, delimiter)
    fs.appendFileSync(filename, text)
  }
}

export async function* read_csv_file(
  filename: string,
  options?: {
    separator?: string
    delimiter?: string
    wrap_line?: boolean
  },
) {
  const separator = options?.separator
  const delimiter = options?.delimiter
  const is_wrap_line = options?.wrap_line
  const stream = fs.createReadStream(filename)
  let titles!: string[]
  let first = true
  for await (const line of stream_lines(stream)) {
    if (first) {
      titles = from_csv(line, separator, delimiter)[0]
      if (is_wrap_line) {
        titles = titles.map(unwrapLine)
      }
      first = false
      continue
    }
    const text = line + '\n'
    const records = csv_to_json(from_csv(text, separator, delimiter), titles)
    const record = records[0]
    if (record) {
      if (is_wrap_line) {
        unwrapObjectLine(record, titles)
      }
      yield record
    }
  }
  stream.close()
}

export function* read_csv_file_sync(
  filename: string,
  options?: {
    separator?: string
    delimiter?: string
    wrap_line?: boolean
  },
) {
  const separator = options?.separator
  const delimiter = options?.delimiter
  const is_wrap_line = options?.wrap_line

  const text = fs.readFileSync(filename).toString()
  const lines = text.split('\n')
  let titles = from_csv(lines[0])[0]
  if (is_wrap_line) {
    titles = titles.map(unwrapLine)
  }
  for (let i = 1; i < lines.length; i++) {
    const text = lines[i] + '\n'
    const records = csv_to_json(from_csv(text, separator, delimiter), titles)
    const record = records[0]
    if (record) {
      if (is_wrap_line) {
        unwrapObjectLine(record, titles)
      }
      yield record
    }
  }
}
