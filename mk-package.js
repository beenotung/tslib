let p = require('./package.json');
p.scripts={};
p.devDependencies={};
p.main='index.js';
p.types='index.d.ts';
console.log(JSON.stringify(p,undefined,2))
