export function parseURLSearchParams(
  search = location.search,
  options?: {
    parse?: 'json';
  },
) {
  if (search.startsWith('http://') || search.startsWith('https://')) {
    search = search.replace(/.*\?/, '');
  }
  if (search.startsWith('?')) {
    search = search.substring(1);
  }
  if (search.includes('%')) {
    search = decodeURIComponent(search);
  }
  const params = {} as Record<string, string>;
  search.split('&').forEach(s => {
    let [key, value] = s.split('=');
    if (options?.parse === 'json') {
      try {
        key = JSON.parse(key);
      } catch (e) {
        // the key is not json
      }
      try {
        value = JSON.parse(value);
      } catch (e) {
        // the value is not json
      }
    }
    params[key] = value;
  });
  return params;
}
