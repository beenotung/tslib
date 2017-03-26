import {Observable} from "rxjs";
import {Http} from "@angular/http";
import {createDefer} from "./async";
import {CustomBrowserXhr} from "./angular";
import * as typeStubHorizon from "../../typeStub-horizon-client/index";
import {DataType, OldRecord, TableObject} from "../../typeStub-horizon-client/index";
declare let Horizon: typeStubHorizon.Horizon;

/**
 * @remark Hbase style operation should be deprecated, since horizon support partial update
 * @example
 *   ```
 *   let id = (await hz.store({a:1, b:2}).toPromise()).id;
 *   hz.update({id:id, a:10})
 *   ```
 *   The resulting object will be {id:id, a:10, b:2}
 */

export abstract class Document<A> implements OldRecord {
  id: string;
  [key: string]: DataType;

  deleted: boolean;

  constructor(o?: OldRecord) {
    Object.assign(this, o);
  }
}
export abstract class Table<A> {
  tableObject: TableObject<A>;

  constructor(hz: typeStubHorizon.Horizon,
              public name: string,) {
    this.tableObject = hz<A>(name);
  }

  all(): Observable<A[]> {
    return this.tableObject
      .findAll(<A><any>{
        deleted: false
      })
      .fetch();
  }

  deletes(keyOrDoc: string | Document<A>): Observable<any> {
    let o = <Document<A>>{};
    if (typeof keyOrDoc == 'string') {
      o.id = keyOrDoc;
    } else {
      o.id = keyOrDoc.id;
    }
    o.deleted = true;
    return this.tableObject.update(<any><Document<A>>o);
  }
}

export async function newHorizonUUID(hz: typeStubHorizon.Horizon, tableName: string = 'uuid'): Promise<string> {
  return hz(tableName).store({}).toPromise().then(x => x.id);
}

export function removeAll(hz: typeStubHorizon.Horizon, tableName: string): Observable<string> {
  let table = hz<{ id: string }>(tableName);
  return table.fetch().mergeMap(xs => table.removeAll(xs).map(x => x.id));
}

/**
 * load horizon using angular http
 * will not auto retry
 * */
export let horizon_api_size = 266826;
export let is_debug_load_horizon = false;
export async function load_horizon_ng(http: Http, url: string = "http://localhost:8181/horizon/horizon.js", preF?: Function): Promise<void> {
  if (typeof preF === 'function') {
    preF();
  }

  /* as demo to monitor the progress */
  let sub = CustomBrowserXhr.progressEventEmitter.subscribe((event: any) => {
    if (is_debug_load_horizon)
      console.log(event.loaded, event.loaded / horizon_api_size * 100 + '%');
  });

  let defer = createDefer<void, string>();
  http.get(url)
    .map(res => res.text())
    .subscribe(
      data => {
        let script = document.createElement('script');
        script.innerText = data;
        document.head.appendChild(script);
        if (typeof Horizon != 'function') {
          defer.reject('failed to inject horizon script, loaded Horizon is not function');
        } else {
          horizon_api_size = data.length;
          defer.resolve(void 0);
        }
      }
      , defer.reject
      , () => sub.unsubscribe()
    );
  return defer.promise;
}

/**
 * load horizon without angular
 * will not auto retry
 * */
export async function load_horizon(url: string) {
  let data = await fetch(url).then(x => x.text());
  let script = document.createElement('script');
  script.innerText = data;
  document.head.appendChild(script);
  if (typeof Horizon != 'function') {
    throw new Error('failed to inject horizon script');
  }
  horizon_api_size = data.length;
  return 'ok';
}
