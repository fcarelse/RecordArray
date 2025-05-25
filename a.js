const RecordArray = require('./lib/cjs/RecordArray.js').default;
console.log(RecordArray);
const RA = new RecordArray([{tag: 'a', name: 'Blah'}]);
console.log(RA);
console.log(Object.keys(RA));
// console.log(RA.findByTag('a'));