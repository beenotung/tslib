import {CachedObjectStore} from "../src/cached-store";

let store = CachedObjectStore.create('data');
store.setObject('user', {id: 1, name: 'beeno'});
console.log('value:', store.getObject('user'));
console.log('value:', store.getObject('user'));
