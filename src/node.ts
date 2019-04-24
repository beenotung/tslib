export function catchMain(p: Promise<any>) {
  return p.catch(e => {
    console.error(e);
    process.exit(1);
  });
}
