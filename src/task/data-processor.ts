import { then } from '../result';

/**
 * TODO auto adjust concurrent size to optimize concurrency
 * currently solely relay on maxConcurrent
 *
 * data loading can be in arbitrary order,
 * data processing must be in order
 *
 * this impl is faster than TaskPool for large number of keys
 *
 * @param args.maxConcurrent: manually adjust to avoid out of memory
 * */
export async function batchProcess<K, D>(args: {
  keys: K[];
  loader: (key: K) => Promise<D>;
  processor: (datum: D, key: K) => void | Promise<void>;
  maxConcurrent?: number;
}): Promise<void> {
  const { keys, loader, processor } = args;
  const maxConcurrent = args.maxConcurrent || Number.MAX_SAFE_INTEGER;
  if (maxConcurrent < 1) {
    throw new Error('require at least 1 maxConcurrent');
  }
  /*
  // this is bad, because it will hold all the data in memory before consuming them
  // also, it waste the processor resources by waiting for all IO to finish before processing
  return Promise.all(keys.map(key => loader(key))).then(data => data.forEach(datum => processor(datum)));
  */
  return new Promise<void>((resolve, reject) => {
    let nLoading = 0;
    const fail = (e: any) => {
      nLoading = Number.MAX_SAFE_INTEGER;
      reject(e);
    };
    let nextLoadIndex = 0;
    let nextProcessIndex = 0;

    const loadedDataBuffer = new Map<number, { key: K; datum: D }>();
    const onLoad = (datum: D, key: K): void => {
      then(
        processor(datum, key),
        () => {
          // finished processing
          nextProcessIndex++;
          if (nextProcessIndex >= keys.length) {
            resolve();
          } else {
            const record = loadedDataBuffer.get(nextProcessIndex);
            if (record) {
              const { key, datum } = record;
              loadedDataBuffer.delete(nextProcessIndex);
              onLoad(datum, key);
            }
          }
        },
        fail,
      );
    };
    const load = () => {
      if (nextLoadIndex >= keys.length) {
        return;
      }
      const loadingIndex = nextLoadIndex;
      nextLoadIndex++;
      const key = keys[loadingIndex];
      loader(key)
        .then(datum => {
          if (loadingIndex === nextProcessIndex) {
            // can process immediately
            onLoad(datum, key);
          } else {
            // cannot process yet, store to buffer
            loadedDataBuffer.set(loadingIndex, { key, datum });
          }
          load();
        })
        .catch(fail);
    };
    for (let i = 0; i < maxConcurrent; i++) {
      load();
    }
  });
}
