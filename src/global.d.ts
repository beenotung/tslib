interface SymbolConstructor {
  /* used by Store */
  storage: symbol;
  /* used by AsyncStore */
  counter: symbol;
  dirpath: symbol;
  /* used by CachedObjectStore */
  objectCache: symbol;
  cacheSize: symbol;
  store: symbol;
  asyncStore: symbol;
  maxCacheSize: symbol;
}
