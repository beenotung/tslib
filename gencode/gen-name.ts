let names = `
Alice
Bob
Charlie
David
Eve
Frank
Grace
Heidi
Ivan
Judy
Micheal
Niaj
Oscar
Paul
Rupert
Sybil
Ted
Victor
Wendy
`.split('\n')
  .filter(s => s);
console.log(`
export let allNames = ${JSON.stringify(names)};

export let names = {
  ${names.map(s => `${s}: '${s}'`).join(',')}
};
`);
