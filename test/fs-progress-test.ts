import { iterateFileByLineWithProgress } from '../src/fs-progress'
import { startTimer } from '../src/node'

const timer = startTimer('scan large file by line')
iterateFileByLineWithProgress({
  file: 'res/db.txt',
  initCallback: totalSize =>
    timer.setProgress({
      totalTick: totalSize,
      estimateTime: true,
    }),
  eachLine: ({ line }) => {
    timer.tick(line.length)
  },
})
timer.end()
