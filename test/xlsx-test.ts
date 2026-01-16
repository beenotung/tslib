import { read_xlsx_file, write_xlsx_file } from '../src/xlsx'

async function main() {
  let users = [
    { uid: 1, name: 'Alice' },
    { uid: 2, name: 'Bob' },
    { uid: 3, name: 'Charlie' },
  ]
  try {
    await write_xlsx_file('test.xlsx', { Users: users })
    console.log('Xlsx file written successfully')
  } catch (error) {
    console.log('Failed to write xlsx file:', error)
  }

  try {
    let excel = await read_xlsx_file('test.xlsx')
    let users = excel.get_sheet_as_json('Users')
    console.log('Users.length:', users.length)
    console.log('Users[0]:', users[0])
  } catch (error) {
    console.log('Failed to read xlsx file:', error)
  }
}
main().catch(e => console.error(e))
