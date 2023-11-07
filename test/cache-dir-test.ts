import { CacheDir } from '../src/cache-dir'

let cache = new CacheDir()

let result = cache.runSync({
  filename: 'task-1.txt',
  fn: () => 'version 1',
})

console.assert(result == 'version 1', 'task 1 should run')

result = cache.runSync({
  filename: 'task-1.txt',
  fn: () => 'version 2',
})

console.assert(result == 'version 1', 'task 1 should be cached')

result = cache.runSync({
  filename: 'task-2.txt',
  fn: () => 'version 3',
})

console.assert(result == 'version 3', 'task 2 should run')

result = cache.runSync({
  filename: 'task-1.txt',
  fn: () => 'version 4',
})

console.assert(result == 'version 1', 'task 1 should still be cached')
