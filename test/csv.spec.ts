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
      expect(text).to.equals(`a,b\r\n,"line1\nline2\nline3"\r\n`)
    })
  })
  describe('unescaped quote', () => {
    let text = `
1546,S" SUM,10/10/2019
1550,"SAER",8/10/2019
`.trim()
    let rows: string[][]
    it('should not get stuck', () => {
      rows = from_csv(text)
    })
    it('should not merge value until next quote', () => {
      expect(rows).to.have.lengthOf(2)
      expect(rows[0]).to.have.lengthOf(3)
      expect(rows[1]).to.have.lengthOf(3)
      expect(rows[1]).to.deep.equals(['1550', 'SAER', '8/10/2019'])
    })
    it('should parse value with unescaped quote', () => {
      expect(rows[0]).to.deep.equals(['1546', 'S" SUM', '10/10/2019'])
    })
  })
  describe('tailing empty value', () => {
    let text = `
a,b,c
a1,b1,c1
a2,b2,
a3,b3,
`
    let json: any[]
    it('should parse without error', () => {
      let rows = from_csv(text)
      json = csv_to_json(rows)
      expect(json).to.have.lengthOf(3)
      expect(json[0]).to.deep.equals({ a: 'a1', b: 'b1', c: 'c1' })
    })
    it('should parse non-last empty value', () => {
      expect(json[1]).to.deep.equals({ a: 'a2', b: 'b2', c: '' })
    })
    it('should parse last empty value', () => {
      expect(json[2]).to.deep.equals({ a: 'a3', b: 'b3', c: '' })
    })
  })
})
