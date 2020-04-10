type Callback = () => void

export class WaitGroup {
  total = 0
  done = 0
  callbacks: Callback[] = []

  add(): Callback {
    this.total++
    return () => {
      this.done++
      this.check()
    }
  }

  waitAll(cb: Callback) {
    if (this.total === this.done) {
      cb()
      return
    }
    this.callbacks.push(cb)
  }

  private check() {
    if (this.total === this.done) {
      this.noticeAll()
    }
  }

  private noticeAll() {
    this.callbacks.forEach(cb => cb())
    this.callbacks = []
  }
}
