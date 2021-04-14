import { csv_to_table_text, json_to_csv } from '../src/csv'

console.log()
console.log(
  csv_to_table_text(
    json_to_csv([
      {
        short: 'long long text',
        'long long text': 'short',
      },
    ]),
  ),
)
console.log()

console.log('-'.repeat(12))

console.log()
console.log(
  csv_to_table_text(
    json_to_csv(
      new Array(10).fill(0).map((_, i) => ({ id: i + 1, val: Math.random() })),
    ),
    { markdown: true },
  ),
)
console.log()
