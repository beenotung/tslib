import { iterateFileByLineWithProgressSync } from '../src/fs-progress'
import { startTimer } from '../src/node'

const timer = startTimer('scan large file by line')
iterateFileByLineWithProgressSync({
  file: 'res/db.txt',
  initCallback: totalSize =>
    timer.setProgress({
      totalTick: totalSize,
      sampleOver: totalSize / 100,
      estimateTime: true,
    }),
  eachLine: ({ line }) => {
    timer.tick(line.length)
  },
})
timer.end()
