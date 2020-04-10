/**
 * external API powered by surge.sh
 */
import { createDefer } from './async/defer'

export namespace externalAPI {
  const hostListUrl = 'http://host-list.surge.sh/list'

  export interface HostRecord {
    name: string
    ip: string
    port?: number
  }

  /**
   * @example line : 192.168.1.2:8181 freedom-coin-server
   * */
  export async function getHostList(): Promise<HostRecord[]> {
    const text = await fetch(hostListUrl).then(x => x.text())
    return text
      .split('\n')
      .filter(x => x.length !== 0)
      .map(line => {
        const record = {} as HostRecord
        let xs = line.split(' ')
        record.name = xs[1]
        xs = xs[0].split(':')
        if (xs.length === 2) {
          record.port = Number(xs[1])
        }
        record.ip = xs[0]
        return record
      })
  }

  export async function getHostByName(name: string): Promise<HostRecord> {
    const text = await fetch(hostListUrl).then(x => x.text())
    /* not using `getHostList().filter()` for speed */
    let found: HostRecord | undefined
    const defer = createDefer<HostRecord, any>()
    try {
      text
        .split('\n')
        .filter(x => x.length !== 0)
        .forEach(line => {
          let xs = line.split(' ')
          if (xs[1] === name) {
            const name = xs[1]
            let port: number | undefined
            xs = xs[0].split(':')
            if (xs.length === 2) {
              port = Number(xs[1])
            }
            const ip = xs[0]
            found = { name, ip, port }
            throw new Error('found')
          }
        })
      defer.reject(`no host record named '${name}'`)
    } catch (e) {
      if (found) {
        defer.resolve(found)
      } else {
        defer.reject(e)
      }
    }
    return defer.promise
  }
}
