import {Horizon, TableObject, OldRecord, DataType, CreatedObject} from "../../typeStub-horizon-client/index";
import {Observable} from "rxjs";

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

  constructor(hz: Horizon,
              public name: string,) {
    this.tableObject = hz<A>(name);
  }

  all(): Observable<A[]> {
    return this.tableObject
      .findAll({
        deleted: false
      })
      .fetch();
  }

  deletes(keyOrDoc: string|Document<A>): Observable<any> {
    let o = <Document<A>>{};
    if (typeof keyOrDoc == 'string') {
      o.id = keyOrDoc;
    } else {
      o.id = keyOrDoc.id;
    }
    o.deleted = true;
    return this.tableObject.update(o);
  }
}
export async function newHorizonUUID(hz: Horizon, tableName: string = 'uuid'): Promise<string> {
  return hz(tableName).store({}).toPromise().then(x => x.id);
}
