import { expect } from 'chai'
import { csv_to_json, from_csv, to_csv, json_to_csv } from '../src/csv'

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
  describe('multiple line handling', () => {
    let sampleText = `
"a","b"
,"line1
line2
line3"
`.trim()
    let sampleJSON = [
      {
        a: '',
        b: `line1
line2
line3`,
      },
    ]
    it('should parse value of multiple line', () => {
      let rows = from_csv(sampleText)
      let json = csv_to_json(rows)
      expect(json).to.deep.equals(sampleJSON)
    })
    it('should encode value of multiple line', () => {
      let rows = json_to_csv(sampleJSON)
      let text = to_csv(rows)
      expect(text).to.equals(`a,b\r\n"","line1\nline2\nline3"\r\n`)
    })
  })
})
