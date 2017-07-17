import {Http} from '@angular/http';
import {createDefer} from './async';
import {ProgressService} from './angular/progress';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/toPromise';
import {Horizon} from 'typestub-horizon-client';

/**
 * @remark Hbase style operation should be deprecated, since horizon support partial update
 * @example
 *   ```
 *   const id = (await hz.store({a:1, b:2}).toPromise()).id;
 *   hz.update({id:id, a:10})
 *   ```
 *   The resulting object will be {id:id, a:10, b:2}
 */

export async function newHorizonUUID(hz: Horizon, tableName: string = 'uuid'): Promise<string> {
  const defer = createDefer<string, any>();
  hz(tableName).store({}).subscribe(x => defer.resolve(x.id), e => defer.reject(e));
  return defer.promise;
}

export function removeAll(hz: Horizon, tableName: string): Observable<string> {
  const table = hz<{ id: string }>(tableName);
  return table.fetch().mergeMap(xs => table.removeAll(xs).map(x => x.id));
}

export function getHorizon(): Horizon {
  return window['Horizon'];
}

/**
 * load horizon using angular http
 * will not auto retry
 * */
export let horizon_api_size = 266826;
export const is_debug_load_horizon = false;

export async function load_horizon_ng(http: Http, progressService: ProgressService
  , url: string = 'http://localhost:8181/horizon/horizon.js', preF?: Function): Promise<void> {
  if (typeof preF === 'function') {
    preF();
  }

  /* as demo to monitor the progress */
  progressService.downloadProgress.subscribe(event => {
    if (is_debug_load_horizon) {
      console.log(event.loaded, event.loaded / horizon_api_size * 100 + '%');
    }
  });

  const defer = createDefer<void, string>();
  http.get(url)
    .map(res => res.text())
    .subscribe(
      data => {
        const script = document.createElement('script');
        script.innerText = data;
        document.head.appendChild(script);
        if (typeof getHorizon() != 'function') {
          defer.reject('failed to inject horizon script, loaded Horizon is not function');
        } else {
          horizon_api_size = data.length;
          defer.resolve(void 0);
        }
      }
      , defer.reject
      // , () => sub.unsubscribe()
    );
  return defer.promise;
}

/**
 * load horizon without angular
 * will not auto retry
 * */
export async function load_horizon(url: string) {
  const data = await fetch(url).then(x => x.text());
  const script = document.createElement('script');
  script.innerText = data;
  document.head.appendChild(script);
  if (typeof getHorizon() != 'function') {
    throw new Error('failed to inject horizon script');
  }
  horizon_api_size = data.length;
  return 'ok';
}
