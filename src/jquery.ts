export declare interface JQueryPromise<A> {
  done<B> (f: (a: A) => B): JQueryPromise<B>;

  fail<B> (f: (e: B) => B): JQueryPromise<B>;
}

export function $ToPromise<A> (p: JQueryPromise<A>): Promise<A> {
  return new Promise<A>((resolve, reject) => p.done(resolve).fail(reject));
  // p.done((data,textStatus,jqXHR)=>defer.resolve({data:data,textStatus:textStatus,jqXHR:jqXHR}))
  //   .fail((req,status,error)=>defer.reject({req:req,status:status,error:error}));
}
