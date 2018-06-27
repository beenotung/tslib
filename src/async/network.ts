import * as fetch from "isomorphic-fetch";

export function fetch_no_cache (url: string, method = "GET"): Promise<Response> {
  const req: Request | string = typeof Request === "function" ? new Request(url) : url;
  const headers = new Headers();
  headers.append("pragma", "no-cache");
  headers.append("cache-control", "no-cache");
  const init = {
    method
    , cache: "no-cache" as RequestCache
    , headers,
  };
  return fetch(req, init);
}

export const fetch_retry = (url: string, num_remind = 1, e?): Promise<Response> =>
  num_remind <= 0
    ? Promise.reject(e)
    : fetch(url).catch((e) => fetch_retry(url, num_remind - 1, e));
