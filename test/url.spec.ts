import { expect } from 'chai'
import { parseURLSearchParams } from '../src/url'

describe('url.ts TestSuit', () => {
  describe('parseURLSearchParams()', () => {
    it('should decode % escaped characters', () => {
      let url =
        'https://stackoverflow.com/questions/38600436/how-to-url-encode-chinese-characters?q=%E4%B8%AD%E6%96%87'
      let output = parseURLSearchParams(url, { parse: 'json' })
      expect(output).to.deep.equals({ q: '中文' })
    })
    it('should parse numbers', () => {
      let url = '?name=Alice&age=18&weight=1.2&height=1.2.3&foo[0]=1&foo[2]=2'
      let output = parseURLSearchParams(url, { parse: 'json' })
      expect(output).to.deep.equals({
        'name': 'Alice',
        'age': 18,
        'weight': 1.2,
        'height': '1.2.3',
        'foo[0]': 1,
        'foo[2]': 2,
      })
    })
    it('should parse string', () => {
      let url = 'a=b&c="d"'
      let output = parseURLSearchParams(url, { parse: 'json' })
      expect(output).to.deep.equals({ a: 'b', c: 'd' })
    })
  })
})
