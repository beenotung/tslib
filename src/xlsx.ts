/**
 * Using @e965/xlsx instead of xlsx for vulnerability fixes
 */
import type {
  Sheet2CSVOpts,
  Sheet2FormulaOpts,
  Sheet2HTMLOpts,
  Sheet2JSONOpts,
  WorkBook,
  WorkSheet,
  WritingOptions,
} from '@e965/xlsx'
export type * from '@e965/xlsx'

export async function wrap_into_workbook(
  data: object[] | Record<string, object[]>,
) {
  const XLSX = await import('@e965/xlsx')

  const workbook = XLSX.utils.book_new()
  if (Array.isArray(data)) {
    const worksheet = XLSX.utils.json_to_sheet(data)
    XLSX.utils.book_append_sheet(workbook, worksheet)
  } else {
    for (const [sheet_name, rows] of Object.entries(data)) {
      const worksheet = XLSX.utils.json_to_sheet(rows)
      XLSX.utils.book_append_sheet(workbook, worksheet, sheet_name)
    }
  }

  return wrap_workbook(workbook, XLSX)
}

export async function write_xlsx_file(
  file: string,
  data: object[] | Record<string, object[]>,
  options: WritingOptions = {},
) {
  const { workbook, XLSX } = await wrap_into_workbook(data)
  await new Promise<void>((resolve, reject) => {
    XLSX.writeFileAsync(file, workbook, options, function() {
      const error = arguments[0]
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

export async function read_xlsx_file(file: string) {
  const XLSX = await import('@e965/xlsx')
  const workbook = XLSX.readFile(file)
  return wrap_workbook(workbook, XLSX)
}

export type WrappedWorkbook = Awaited<ReturnType<typeof wrap_workbook>>

async function wrap_workbook(
  workbook: WorkBook,
  XLSX: typeof import('@e965/xlsx'),
) {
  function get_default_sheet_name() {
    const sheet_names = workbook.SheetNames
    if (sheet_names.length === 1) {
      return sheet_names[0]
    }
    if (sheet_names.length === 0) {
      throw new Error('No sheets exist in the workbook')
    }
    throw new Error(
      `Multiple sheets exist in the workbook, please specify the sheet name: ${sheet_names.join(', ')}`,
    )
  }
  function get_sheet(name: string = get_default_sheet_name()) {
    const sheet = workbook.Sheets[name]
    if (!sheet) {
      throw new Error(`Sheet ${name} not found`)
    }
    return sheet
  }
  /** Converts a worksheet object to an array of JSON objects */
  function get_sheet_as_json(name?: string, options?: Sheet2JSONOpts) {
    return XLSX.utils.sheet_to_json(get_sheet(name), options)
  }
  /** Generate delimited-separated-values output */
  function get_sheet_as_csv(name?: string, options?: Sheet2CSVOpts) {
    return XLSX.utils.sheet_to_csv(get_sheet(name), options)
  }
  /** Generate UTF16 Formatted Text */
  function get_sheet_as_text(name?: string, options?: Sheet2CSVOpts) {
    return XLSX.utils.sheet_to_txt(get_sheet(name), options)
  }
  /** Generate HTML */
  function get_sheet_as_html(name?: string, options?: Sheet2HTMLOpts) {
    return XLSX.utils.sheet_to_html(get_sheet(name), options)
  }
  /** Generate a list of the formulae (with value fallbacks) */
  function get_sheet_as_formulae(name?: string, options?: Sheet2FormulaOpts) {
    return XLSX.utils.sheet_to_formulae(get_sheet(name), options)
  }
  return {
    workbook,
    get_default_sheet_name,
    get_sheet,
    get_sheet_as_json,
    get_sheet_as_csv,
    get_sheet_as_text,
    get_sheet_as_html,
    get_sheet_as_formulae,
    XLSX,
  }
}

export function get_worksheet_headers(worksheet: WorkSheet) {
  const headers = []
  for (const key of Object.keys(worksheet)) {
    const col = parse_column_range(key)
    const row = key.slice(col.length)
    if (row != '1') continue
    const cell = worksheet[key]
    const value = cell.v
    headers.push({ col, value })
  }
  return headers
}

function parse_column_range(cell: string) {
  // e.g. 'L5' -> 'L'
  return cell
    .split('')
    .filter(c => !is_digit(c))
    .join('')
}

function is_digit(c: string) {
  return c >= '0' && c <= '9'
}
