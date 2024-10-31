import { createServer } from 'net'

/** @description find a port that is available for server port */
export async function findPort(
  options:
    | { candidates: number[] }
    | {
        initialPort: number
        step: number
      },
) {
  if ('candidates' in options) {
    for (const port of options.candidates) {
      if (await testPort(port)) {
        return port
      }
    }
    throw new Error('no port available')
  }
  for (let port = options.initialPort; port <= 65535; port += options.step) {
    if (await testPort(port)) {
      return port
    }
  }
  throw new Error('no port available')
}

/** @description test if the port is available for server port */
export function testPort(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = createServer()
    server.on('error', () => resolve(false))
    server.listen(port, () => {
      server.close(error => {
        if (error) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  })
}
