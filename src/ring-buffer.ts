import { getMaxArraySize } from './array';

export class RingBuffer<T> {
  private readonly xs: T[];
  private start = 0;
  private end = 0;
  private count = 0;

  constructor(public readonly size: number = getMaxArraySize()) {
    this.xs = new Array(size);
  }

  get length(): number {
    return this.count;
  }

  enqueue(x: T): void {
    if (this.count === this.size) {
      throw new Error('buffer is full');
    }
    this.count++;
    this.end = (this.end + 1) % this.size;
    this.xs[this.end] = x;
  }

  push(x: T): void {
    this.enqueue(x);
  }

  dequeue(): T {
    if (this.count === 0) {
      throw new Error('buffer is empty');
    }
    this.count--;
    const x = this.xs[this.start];
    this.start = (this.start + 1) % this.size;
    return x;
  }

  unshift(): T {
    return this.dequeue();
  }
}
