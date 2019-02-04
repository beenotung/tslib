import {CachedObjectStore} from "../src/cached-store";

let store = new CachedObjectStore('data');
store.setObject('user', {id: 1, name: 'beeno'});
let value = store.getObject('user');
console.log('value:', value);
