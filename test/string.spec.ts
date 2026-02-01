import { expect } from 'chai'
import { test } from 'mocha'
import {
  capitalize,
  concat_words,
  first_char,
  is_ascii_char,
  last_char,
  lcfirst,
  normalizeForSearch,
  normalizeUnicode,
  removeAccents,
  strToCapWords,
  ucfirst,
} from '../src/string'
import {
  compare_string,
  split_string_num,
  string_to_chars,
} from '../src/string'

describe('string.ts TestSuit', () => {
  test('string_to_chars', () => {
    let str = '9876543210123456789'
    expect(string_to_chars(str)).to.deep.equals(str.split(''))
  })

  test('split_string_num', () => {
    expect(split_string_num('varchar_10')).to.deep.equals(['varchar_', 10])
    expect(split_string_num('1')).to.deep.equals([1])
    expect(split_string_num('10')).to.deep.equals([10])
    expect(split_string_num('0')).to.deep.equals([0])
    expect(split_string_num('00')).to.deep.equals([0])
  })

  test('compare_string', () => {
    expect(
      ['varchar_10', 'varchar_20', 'varchar_16', 'varchar_64'].sort(
        compare_string,
      ),
    ).to.deep.equals(['varchar_10', 'varchar_16', 'varchar_20', 'varchar_64'])

    expect(
      ['1', '2', '10', '20', '0', '00'].sort(compare_string),
    ).to.deep.equals(['0', '00', '1', '2', '10', '20'])
  })

  test('strToCapWords', () => {
    expect(strToCapWords('change the words')).to.equals('Change The Words')
  })

  test('capitalize', () => {
    expect(capitalize('word')).to.equals('Word')
    expect(capitalize('WORD')).to.equals('Word')
  })

  test('perl-style case switching functions', () => {
    expect(ucfirst('toString')).to.equals('ToString')
    expect(lcfirst('ToString')).to.equals('toString')
  })

  const emoji = '😀'

  test('first_char', () => {
    expect(emoji[0]).not.to.equals(emoji)
    expect(first_char(emoji)).to.equals(emoji)
    expect(first_char(`1${emoji}2`)).to.equals('1')
  })

  test('last_char', () => {
    expect(emoji[0]).not.to.equals(emoji)
    expect(last_char(emoji)).to.equals(emoji)
    expect(last_char(`1${emoji}2`)).to.equals('2')
  })

  test('is_ascii_char', () => {
    expect(is_ascii_char(null)).to.be.false
    expect(is_ascii_char(emoji)).to.be.false
    expect(is_ascii_char('a')).to.be.true
  })

  test('concat_words', () => {
    expect(concat_words('apple', 'tree')).to.equals('apple tree')
    expect(concat_words('apple!', 'tree.')).to.equals('apple! tree.')
    expect(concat_words(emoji, emoji)).to.equals(emoji + emoji)
    expect(concat_words('預約', '體驗班')).to.equals('預約體驗班')
  })

  test('normalizeUnicode', () => {
    // Preserves case
    expect(normalizeUnicode('HELLO')).to.equals('HELLO')
    expect(normalizeUnicode('Café')).to.equals('Café')

    // Unicode equivalence (same visual character, different representations)
    const name1 = '\u0041\u006d\u00e9\u006c\u0069\u0065' // é as single code point
    const name2 = '\u0041\u006d\u0065\u0301\u006c\u0069\u0065' // e + combining accent
    expect(name1).not.to.equals(name2) // Different before normalization
    expect(normalizeUnicode(name1)).to.equals(normalizeUnicode(name2)) // Same after NFC
  })

  test('removeAccents', () => {
    // Preserves case
    expect(removeAccents('Café')).to.equals('Cafe')
    expect(removeAccents('CAFÉ')).to.equals('CAFE')

    // Removes various accents
    expect(removeAccents('résumé')).to.equals('resume')
    expect(removeAccents('Amélie')).to.equals('Amelie')
    expect(removeAccents('München')).to.equals('Munchen')
    expect(removeAccents('naïve')).to.equals('naive')
  })

  test('normalizeForSearch', () => {
    // Basic accent removal + lowercase
    expect(normalizeForSearch('Café')).to.equals('cafe')
    expect(normalizeForSearch('résumé')).to.equals('resume')
    expect(normalizeForSearch('Amélie')).to.equals('amelie')
    expect(normalizeForSearch('München')).to.equals('munchen')
    expect(normalizeForSearch('naïve')).to.equals('naive')

    // Case normalization
    expect(normalizeForSearch('HELLO')).to.equals('hello')
    expect(normalizeForSearch('HeLLo WoRLD')).to.equals('hello world')

    // Trimming
    expect(normalizeForSearch('  hello  ')).to.equals('hello')

    // Unicode equivalence (same visual character, different representations)
    const name1 = '\u0041\u006d\u00e9\u006c\u0069\u0065' // é as single code point
    const name2 = '\u0041\u006d\u0065\u0301\u006c\u0069\u0065' // e + combining accent
    expect(name1).not.to.equals(name2) // Different before normalization
    expect(normalizeForSearch(name1)).to.equals(normalizeForSearch(name2)) // Same after normalization
    expect(normalizeForSearch(name1)).to.equals('amelie')
  })
})
