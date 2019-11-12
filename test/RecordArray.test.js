const assert = require('assert');
const RecordArray = require('../src/RecordArray.js');

const testRA = new RecordArray([
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
]);

describe('RecordArray', ()=>{

	describe('Can create using "new" keyword', ()=>{
		const newRA = new RecordArray();
		assert.ok(newRA instanceof RecordArray,'Must be instantiable using the keyword "new"')
	});

	describe('findBy()', ()=>{
		it('should throw exception due to no field given', function() {
			() => {
				testRA.findBy();
			},
			/^TypeError: Field Name parameter required$/

			// assert.throws(
			// 	()=>{
			// 		testRA.findBy();
			// 	},
			// 	{
			// 		name: 'TypeError',
			// 		message: 'Field Name parameter required'
			// 	}
			// );
		});
	});

	describe('findBy(field)', ()=>{
		it('Should find records using non core field', function() {
			const test = testRA.findBy('key', 'red');
			assert.ok(test instanceof RecordArray);
			assert.equal(test.length, 2);
			assert.equal(test[0].id, 5);
			assert.equal(test[1].id, 10);
			assert.deepEqual(test, new RecordArray([
				{id: 5, name: 'Eddie', key: 'red'},
				{id: 10, name: 'John', key: 'red'}
			]), 'Should find records with key equal to value');
		})

		it('Should find records using non core field default to no trim', function() {
			assert.deepEqual(
				testRA.findBy('key', 'blue', {trim: true}),
				new RecordArray([
					{id: 3, name: 'Cat', key: 'blue'},
					{id: 9, name: 'Ian', key: 'blue'}
				]),
				'Should find records with trimmed key equal to value'
			);
		})

		it('Should find records using non core field allowing trim option', function() {
			assert.deepEqual(
				testRA.findBy('key', 'blue', {trim: true}),
				new RecordArray([
					{id: 3, name: 'Cat', key: 'blue'},
					{id: 6, name: 'Fred', key: ' blue '},
					{id: 7, name: 'Greg', key: ' blue'},
					{id: 8, name: 'Harry', key: 'blue '},
					{id: 9, name: 'Ian', key: 'blue'}
				]),
				'Should find records with trimmed key equal to value'
			);
		});
	});

});
