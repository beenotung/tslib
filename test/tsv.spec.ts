import { expect } from 'chai'
import { from_csv } from '../src/csv'
import { THROW, from_tsv, to_tsv } from '../src/tsv'

describe('tsv.ts TestSuit', () => {
  it('should serialize with tabs and no quoting', () => {
    let rows = [
      ['name', 'note'],
      ['Paul', 'He said "hi", ok'],
    ]
    expect(to_tsv(rows)).to.equals('name\tnote\r\nPaul\tHe said "hi", ok\r\n')
  })

  it('should treat quote as literal when parsing', () => {
    let text = 'name\tnote\nPaul\t"quoted"\n'
    expect(from_tsv(text)).to.deep.equals([
      ['name', 'note'],
      ['Paul', '"quoted"'],
    ])
  })

  it('should round-trip rows without tabs or newlines', () => {
    let rows = [
      ['a', 'b', 'c'],
      ['1', '2', '3'],
    ]
    expect(from_tsv(to_tsv(rows))).to.deep.equals(rows)
  })

  it('should terminate records with CRLF', () => {
    expect(to_tsv([['a']])).to.equals('a\r\n')
    expect(to_tsv([['a'], ['b']])).to.equals('a\r\nb\r\n')
  })

  it('should parse without a trailing newline', () => {
    expect(from_tsv('a\tb\n1\t2')).to.deep.equals([
      ['a', 'b'],
      ['1', '2'],
    ])
  })

  it('should parse CRLF line endings', () => {
    expect(from_tsv('a\tb\r\n1\t2\r\n')).to.deep.equals([
      ['a', 'b'],
      ['1', '2'],
    ])
  })

  it('should strip a leading BOM', () => {
    expect(from_tsv('\uFEFFa\tb\n1\t2\n')).to.deep.equals([
      ['a', 'b'],
      ['1', '2'],
    ])
  })

  it('should ignore leading and trailing blank lines', () => {
    expect(from_tsv('\na\tb\n1\t2\n\n\n')).to.deep.equals([
      ['a', 'b'],
      ['1', '2'],
    ])
  })

  it('should return no rows for whitespace-only input', () => {
    expect(from_tsv('   \n  ')).to.deep.equals([])
  })

  it('should treat a newline as end of record', () => {
    expect(from_tsv('a\tb\nl1\nl2\t2\n')).to.deep.equals([
      ['a', 'b'],
      ['l1'],
      ['l2', '2'],
    ])
  })

  it('should differ from the quoted-tab dialect of from_csv', () => {
    // from_csv with TAB preserves a quoted newline; strict tsv splits on it
    expect(from_csv('a\tb\n"l1\nl2"\t2\n', '\t')).to.deep.equals([
      ['a', 'b'],
      ['l1\nl2', '2'],
    ])
    expect(from_tsv('a\tb\n"l1\nl2"\t2\n')).to.deep.equals([
      ['a', 'b'],
      ['"l1'],
      ['l2"', '2'],
    ])
  })

  it('should treat an undefined cell as an empty field', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(to_tsv([['x', undefined as any]])).to.equals('x\t\r\n')
  })

  it('should reject a field containing a tab', () => {
    expect(() => to_tsv([['a\tb']])).to.throw()
  })

  it('should reject a field containing a newline', () => {
    expect(() => to_tsv([['a\nb']])).to.throw()
  })

  it('should reject a field containing a carriage return', () => {
    expect(() => to_tsv([['a\rb']])).to.throw()
  })

  describe('options', () => {
    it('should restore substituted markers when the same options are given', () => {
      const rows = [
        ['a', 'b'],
        ['has\ttab', 'has\nnewline'],
      ]
      const options = { tab: '<tab>', newline: '<br>' }
      const text = to_tsv(rows, options)
      expect(text).to.equal('a\tb\r\nhas<tab>tab\thas<br>newline\r\n')
      expect(from_tsv(text, options)).to.deep.equal(rows)
    })

    it('should not restore markers when options are omitted', () => {
      const text = to_tsv([['has\ttab']], { tab: '<tab>' })
      expect(from_tsv(text)).to.deep.equal([['has<tab>tab']])
    })

    it('should normalise CRLF to LF when restoring a newline marker', () => {
      const text = to_tsv([['a\r\nb']], { newline: '\\n' })
      expect(text).to.equal('a\\nb\r\n')
      expect(from_tsv(text, { newline: '\\n' })).to.deep.equal([['a\nb']])
    })

    it('should be lossy when the marker collides with real content', () => {
      // a real space is indistinguishable from a newline replaced by a space
      const text = to_tsv([['a b\nc']], { newline: ' ' })
      expect(text).to.equal('a b c\r\n')
      expect(from_tsv(text, { newline: ' ' })).to.deep.equal([['a\nb\nc']])
    })

    it('should substitute a tab with a space', () => {
      expect(to_tsv([['a\tb']], { tab: ' ' })).to.equals('a b\r\n')
    })

    it('should substitute a tab with a pattern', () => {
      expect(to_tsv([['a\tb']], { tab: '\\t' })).to.equals('a\\tb\r\n')
      expect(to_tsv([['a\tb']], { tab: '<tab>' })).to.equals('a<tab>b\r\n')
      expect(to_tsv([['a\tb']], { tab: '[tab]' })).to.equals('a[tab]b\r\n')
    })

    it('should substitute a newline with a space', () => {
      expect(to_tsv([['a\nb']], { newline: ' ' })).to.equals('a b\r\n')
      expect(to_tsv([['a\rb']], { newline: ' ' })).to.equals('a b\r\n')
    })

    it('should treat CRLF as a single line break', () => {
      // one replacement, not two
      expect(to_tsv([['a\r\nb']], { newline: ' ' })).to.equals('a b\r\n')
    })

    it('should substitute a newline with a pattern', () => {
      expect(to_tsv([['a\nb']], { newline: '\\n' })).to.equals('a\\nb\r\n')
      expect(to_tsv([['a\nb']], { newline: '<br>' })).to.equals('a<br>b\r\n')
    })

    it('should keep throwing when the option is THROW', () => {
      expect(() => to_tsv([['a\tb']], { tab: THROW })).to.throw()
      expect(() => to_tsv([['a\nb']], { newline: THROW })).to.throw()
    })

    it('should accept "throws" as an alias of THROW', () => {
      expect(() => to_tsv([['a\tb']], { tab: 'throws' })).to.throw()
      expect(() => to_tsv([['a\nb']], { newline: 'throws' })).to.throw()
    })

    it('should only substitute the option that is set', () => {
      // tab substituted, newline still strict -> throws
      expect(() => to_tsv([['a\tb\nc']], { tab: ' ' })).to.throw()
      // newline substituted, tab still strict -> throws
      expect(() => to_tsv([['a\tb']], { newline: ' ' })).to.throw()
      // each works on its own character
      expect(to_tsv([['a\tb']], { tab: ' ' })).to.equals('a b\r\n')
      expect(to_tsv([['a\nb']], { newline: ' ' })).to.equals('a b\r\n')
    })
  })
})
