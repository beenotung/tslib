export function catchMain(p: Promise<any>): void {
  p.catch(e => {
    console.error(e);
    process.exit(1);
  });
}
