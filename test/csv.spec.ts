import { expect } from 'chai'
import { csv_to_json, from_csv, to_csv } from '../src/csv'

describe('csv.ts TestSuit', () => {
  it('should parse basic rows', () => {
    let text = `
a,b
1,2
3,4
`.trim()
    let rows = from_csv(text)
    let json = csv_to_json(rows)
    expect(json).to.deep.equals([
      { a: '1', b: '2' },
      { a: '3', b: '4' },
    ])
  })
  it('should parse with quotation mark', () => {
    let text = `
"a","b"
1,2
`.trim()
    let rows = from_csv(text)
    let json = csv_to_json(rows)
    expect(json).to.deep.equals([{ a: '1', b: '2' }])
  })
  it('should parse empty column', () => {
    let text = `
"a","b"
,2
`.trim()
    let rows = from_csv(text)
    let json = csv_to_json(rows)
    expect(json).to.deep.equals([{ a: '', b: '2' }])
  })
  it('should parse value of multiple line', () => {
    let text = `
"a","b"
,"line1
line2
line3"
`.trim()
    let rows = from_csv(text)
    let json = csv_to_json(rows)
    expect(json).to.deep.equals([
      {
        a: '',
        b: `line1
line2
line3`,
      },
    ])
  })
})
