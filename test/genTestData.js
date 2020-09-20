const RecordArray = require('../src/RecordArray');

const testRA = [
	{id: 1, name: 'Adam', key: 'g'},
	{id: 2, name: 'Bob', key: 'great'},
	{id: 3, name: 'Cat', key: 'blue'},
	{id: 4, name: 'Dave', key: 'green'},
	{id: 5, name: 'Eddie', key: 'red'},
	{id: 6, name: 'Fred', key: ' blue '},
	{id: 7, name: 'Greg', key: ' blue'},
	{id: 8, name: 'Harry', key: 'blue '},
	{id: 9, name: 'Ian', key: 'blue'},
	{id: 10, name: 'John', key: 'red'},
	{id: 11, name: 'Karl', key: 'green'}
];

require('fs').writeFileSync(
	__dirname+'/testdata/names.json',
	JSON.stringify(testRA,null,1)
);
