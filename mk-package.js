let p = require('./package.json');
p.scripts={};
p.devDependencies={};
console.log(JSON.stringify(p,undefined,2));
