import { expect } from 'chai'
import { test } from 'mocha'
import { capitalize, lcfirst, ucfirst } from '../src/string'
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

  test('capitalize', () => {
    expect(capitalize('word')).to.equals('Word')
    expect(capitalize('WORD')).to.equals('Word')
  })

  test('perl-style case switching functions', () => {
    expect(ucfirst('toString')).to.equals('ToString')
    expect(lcfirst('ToString')).to.equals('toString')
  })
})
