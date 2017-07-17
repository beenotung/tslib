import {Observable} from 'rxjs';
import {CreatedObject, DataType, Horizon, OldRecord, TableObject} from 'typestub-horizon-client';

/**
 * @remark Hbase style operation should be deprecated, since horizon support partial update
 * @example
 *   ```
 *   const id = (await hz.store({a:1, b:2}).toPromise()).id;
 *   hz.update({id:id, a:10})
 *   ```
 *   The resulting object will be {id:id, a:10, b:2}
 */

export abstract class Document implements OldRecord {
  id: string;
  [key: string]: DataType;

  deleted: boolean;

  constructor(o?: OldRecord) {
    Object.assign(this, o);
  }
}

export abstract class Table<D extends Document> {
  tableObject: TableObject<D>;

  constructor(hz: Horizon, public name: string) {
    this.tableObject = hz<D>(name);
  }

  all(): Observable<D[]> {
    return <any>this.tableObject
      .findAll(<D>{
        deleted: false
      })
      .fetch();
  }

  deletes(keyOrDoc: string | D): Observable<CreatedObject> {
    const o = <D>{};
    if (typeof keyOrDoc == 'string') {
      o.id = keyOrDoc;
    } else {
      o.id = keyOrDoc.id;
    }
    o.deleted = true;
    return <any>this.tableObject.update(o);
  }
}


