/**
 * Using @e965/xlsx instead of xlsx for vulnerability fixes
 */
import type {
  Sheet2CSVOpts,
  Sheet2FormulaOpts,
  Sheet2HTMLOpts,
  Sheet2JSONOpts,
  WritingOptions,
} from '@e965/xlsx'

export async function write_xlsx_file(
  file: string,
  data: object[] | Record<string, object[]>,
  options: WritingOptions = {},
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
  function get_sheet(name: string) {
    const sheet = workbook.Sheets[name]
    if (!sheet) {
      throw new Error(`Sheet ${name} not found`)
    }
    return sheet
  }
  /** Converts a worksheet object to an array of JSON objects */
  function get_sheet_as_json(name: string, options?: Sheet2JSONOpts) {
    return XLSX.utils.sheet_to_json(get_sheet(name), options)
  }
  /** Generate delimited-separated-values output */
  function get_sheet_as_csv(name: string, options?: Sheet2CSVOpts) {
    return XLSX.utils.sheet_to_csv(get_sheet(name), options)
  }
  /** Generate UTF16 Formatted Text */
  function get_sheet_as_text(name: string, options?: Sheet2CSVOpts) {
    return XLSX.utils.sheet_to_txt(get_sheet(name), options)
  }
  /** Generate HTML */
  function get_sheet_as_html(name: string, options?: Sheet2HTMLOpts) {
    return XLSX.utils.sheet_to_html(get_sheet(name), options)
  }
  /** Generate a list of the formulae (with value fallbacks) */
  function get_sheet_as_formulae(name: string, options?: Sheet2FormulaOpts) {
    return XLSX.utils.sheet_to_formulae(get_sheet(name), options)
  }
  return {
    workbook,
    get_sheet,
    get_sheet_as_json,
    get_sheet_as_csv,
    get_sheet_as_text,
    get_sheet_as_html,
    get_sheet_as_formulae,
  }
}
