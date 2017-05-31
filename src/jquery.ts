import {createDefer} from './async';

export function $ToPromise<A>(p: JQueryPromise<A>): Promise<A> {
  const defer = createDefer<A, any>();
  p.done(defer.resolve)
    .fail(defer.reject);
  // p.done((data,textStatus,jqXHR)=>defer.resolve({data:data,textStatus:textStatus,jqXHR:jqXHR}))
  //   .fail((req,status,error)=>defer.reject({req:req,status:status,error:error}));
  return defer.promise;
}
