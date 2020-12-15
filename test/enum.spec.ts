import { expect } from 'chai'
import { test } from 'mocha'
import {
  Enum,
  enum_keys,
  enum_last_i,
  enum_last_s,
  enum_only_string,
  enum_set_string,
  enum_values,
} from '../src/enum'

describe('enum.ts', () => {
  enum Color {
    red,
    green,
    blue,
  }
  test('typescript compiled enum', () => {
    expect(Color).deep.eq({
      0: 'red',
      1: 'green',
      2: 'blue',
      red: 0,
      green: 1,
      blue: 2,
    })

    expect(Object.keys(Color)).deep.eq(['0', '1', '2', 'red', 'green', 'blue'])
  })

  test('library functions', () => {
    expect(enum_values(Color)).deep.eq([0, 1, 2])

    expect(enum_keys(Color)).deep.eq(['red', 'green', 'blue'])

    expect(enum_last_i(Color)).eq(2)
    expect(enum_last_s(Color)).eq('blue')

    enum_set_string(Color)
    expect(Color).deep.eq({
      0: 'red',
      1: 'green',
      2: 'blue',
      red: 'red',
      green: 'green',
      blue: 'blue',
    })

    enum_only_string(Color)
    expect(Color).deep.eq({
      red: 'red',
      green: 'green',
      blue: 'blue',
    })

    expect(enum_last_s(Color)).eq('blue')
    expect(enum_last_i(Color)).eq('blue')

    expect(enum_keys(Color)).deep.eq(['red', 'green', 'blue'])
  })
})
