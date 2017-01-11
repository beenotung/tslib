import {createDefer} from "./async";
/**
 * external API powered by surge.sh
 */
export namespace externalAPI {
  const hostListUrl = 'http://host-list.surge.sh/list';
  interface HostRecord {
    name: string;
    ip: string;
    port: number;
  }
  /**
   * @example line : 192.168.1.2:8181 freedom-coin-server
   * */
  export async function getHostList(): Promise<HostRecord[]> {
    let text = await (fetch(hostListUrl).then(x => x.text()));
    return text.split('\n')
      .filter(x => x.length != 0)
      .map(line => {
        let record = <HostRecord>{};
        let xs = line.split(' ');
        record.name = xs[1];
        xs = xs[0].split(':');
        if (xs.length == 2) {
          record.port = Number(xs[1]);
        }
        record.ip = xs[0];
        return record;
      })
  }

  export async function getHostByName(name: string): Promise<HostRecord> {
    let text = (await fetch(hostListUrl).then(x => x.text()));
    /* not using `getHostList().filter()` for speed */
    let found: HostRecord;
    let defer = createDefer<HostRecord,any>();
    try {
      text.split('\n')
        .filter(x => x.length != 0)
        .forEach(line => {
          let xs = line.split(' ');
          if (xs[1] == name) {
            found = <HostRecord>{};
            found.name = xs[1];
            xs = xs[0].split(':');
            if (xs.length == 2) {
              found.port = Number(xs[1]);
            }
            found.ip = xs[0];
            throw new Error('found');
          }
        });
      defer.reject('not found');
    } catch (e) {
      if (found)
        defer.resolve(found);
      else
        defer.reject(e);
    }
    return defer.promise;
  }
}
