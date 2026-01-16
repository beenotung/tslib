import { existsSync, unlinkSync } from 'fs'
import {
  read_xlsx_file,
  wrap_into_workbook,
  WrappedWorkbook,
  write_xlsx_file,
} from '../src/xlsx'
import { expect } from 'chai'

describe('xlsx.ts spec', () => {
  let users = [
    { uid: 1, name: 'Alice' },
    { uid: 2, name: 'Bob' },
    { uid: 3, name: 'Charlie' },
  ]
  let file = 'test.xlsx'
  before(() => {
    if (existsSync(file)) {
      unlinkSync(file)
    }
  })
  it('should write xlsx file', async () => {
    await write_xlsx_file(file, { Users: users })
    expect(existsSync(file)).to.equal(true, 'Excel file should exist')
  })
  it('should read xlsx file', async () => {
    let excel = await read_xlsx_file(file)
    let users = excel.get_sheet_as_json('Users')
    expect(users).to.deep.equal(users, 'Users should be read correctly')
  })
  describe('wrap into workbook', () => {
    let excel: WrappedWorkbook = null!
    before(async () => {
      excel = await wrap_into_workbook({ Users: users })
      expect(excel.workbook.SheetNames).to.deep.equal(
        ['Users'],
        'Workbook should have Users sheet',
      )
    })
    it('should read sheet by name', () => {
      expect(excel.get_sheet_as_json('Users')).to.deep.equal(
        users,
        'Users sheet should be read correctly',
      )
    })
    it('should read only one sheet by default', () => {
      expect(excel.get_sheet_as_json()).to.deep.equal(
        users,
        'The only Users sheet should be picked automatically',
      )
    })
  })
})
