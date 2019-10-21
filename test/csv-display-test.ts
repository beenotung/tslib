import { csv_to_table_text, json_to_csv } from '../src/csv';

console.log(csv_to_table_text(json_to_csv([{
  'short': 'long long text',
  'long long text': 'short',
}])));
