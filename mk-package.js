var p = require('./package.json');
delete p.scripts;
delete p.devDependencies;
console.log(JSON.stringify(p,undefined,2));
