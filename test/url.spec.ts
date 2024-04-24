import { expect } from 'chai'
import { isIP, parseURLSearchParams } from '../src/url'

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

  describe('isIP()', () => {
    it('should remove protocol prefix', () => {
      expect(isIP('http://127.0.0.1')).to.be.true
      expect(isIP('https://127.0.0.1')).to.be.true
      expect(isIP('ftp://127.0.0.1')).to.be.true
      expect(isIP('ipfs://127.0.0.1')).to.be.true
      expect(isIP('http://example.net')).to.be.false
    })
    it('should remove tailing pathname', () => {
      expect(isIP('127.0.0.1/')).to.be.true
      expect(isIP('127.0.0.1/about-us')).to.be.true
      expect(isIP('example.net/')).to.be.false
      expect(isIP('example.net/about-us')).to.be.false
    })
    it('should remove port number', () => {
      expect(isIP('127.0.0.1:8100')).to.be.true
      expect(isIP('example.net:8100')).to.be.false
    })
    it('should detect IPv4', () => {
      expect(isIP('127.0.0.1')).to.be.true
    })
    it('should detect IPv6', () => {
      expect(isIP('2001:0000:130F:0000:0000:09C0:876A:130B')).to.be.true
      expect(isIP('::127.0.0.1')).to.be.true
      expect(isIP('[2001:0000:130F:0000:0000:09C0:876A:130B]:8100')).to.be.true
    })
    it('should not confuse with domain having numbers', () => {
      expect(isIP('163.com')).to.be.false
    })
  })
})
