try {
  throw new Error('testing error')
} catch (e) {
  //
} finally {
  console.log('finally with error')
}

try {
  //
} catch (e) {
  //
} finally {
  console.log('finally without error')
}
