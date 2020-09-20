const assert = require('assert');
const RecordArray = require('../src/RecordArray.js');
const fs = require('fs'),
	fsp = fs.promise;


const testRA = new RecordArray(JSON.parse(fs.readFileSync(__dirname+'/testdata/names.json')));

describe('RecordArray', ()=>{
	describe('Test Data', ()=>{
		it('has 11 records', function() {
			assert.ok(testRA.length==11,'Test Data does not have 11 records')
		});
	});

	describe('RecordArray', ()=>{
		it('can be created by the new keyword', function() {
			const newRA = new RecordArray();
			assert.ok(newRA instanceof RecordArray,'Failed to be created with the new keyword')
		});

		it('can be created using the new method', function() {
			const newRA = RecordArray.new();
			assert.ok(newRA instanceof RecordArray,'Failed to be created with the new method')
		});
	});

	// FindBy tests start
	describe('findBy()', ()=>{
		it('should return empty RecordArray if no parameters supplied', function() {
			const res = testRA.findBy();
			assert.ok(res instanceof RecordArray, 'Returned must be RecordArray')
			assert.ok(res.length == 0, 'Returned must have no length')
		});
	});

	describe('findBy(field, value)', ()=>{
		it('should find records using non core field', function() {
			const test = testRA.findBy('key', 'red');
			assert.ok(test instanceof RecordArray);
			assert.strictEqual(test.length, 2);
			assert.strictEqual(test[0].id, 5);
			assert.strictEqual(test[1].id, 10);
			assert.deepStrictEqual(test, new RecordArray([
				{id: 5, name: 'Eddie', key: 'red'},
				{id: 10, name: 'John', key: 'red'}
			]), 'Failed to find records with key equal to value');
		})

		it('should find records using non core field default to no trim', function() {
			assert.deepStrictEqual(
				testRA.findBy('key', 'blue'),
				new RecordArray([
					{id: 3, name: 'Cat', key: 'blue'},
					{id: 9, name: 'Ian', key: 'blue'}
				]),
				'Failed to find records with trimmed key equal to value'
			);
		})

		it.skip('Should find records using non core field allowing trim option', function() {
			const res = testRA.findBy('key', 'blue', {trim: true});
			const expected = new RecordArray([
				{id: 3, name: 'Cat', key: 'blue'},
				{id: 6, name: 'Fred', key: ' blue '},
				{id: 7, name: 'Greg', key: ' blue'},
				{id: 8, name: 'Harry', key: 'blue '},
				{id: 9, name: 'Ian', key: 'blue'}
			]);
			console.log(res);
			console.log(expected);
			assert.ok( RecordArray.compareRecords(res, expected),
				'Failed to find records with trimmed key equal to value'
			);
		});
	});
	// FindBy tests end

	// FindByID tests start
	describe('findByID()', ()=>{
		it('Should return empty RecordArray if no parameters supplied', function() {
			const res = testRA.findByID();
			assert.ok(res instanceof RecordArray, 'Returned must be RecordArray')
			assert.ok(res.length == 0, 'Returned must have no length')
		});
	});

	describe('findByID(value)', ()=>{
		it('Should find records using ID field', function() {
			const test = testRA.findByID(5);
			assert.ok(test instanceof RecordArray);
			assert.strictEqual(test.length, 1);
			assert.strictEqual(test[0].id, 5);
			assert.deepStrictEqual(test, new RecordArray([
				{id: 5, name: 'Eddie', key: 'red'},
			]), 'Failed to find records with ID equal to value parameter');
		})

		it('Should find records using non core field default to no trim', function() {
			assert.deepStrictEqual(
				testRA.findBy('key', 'blue'),
				new RecordArray([
					{id: 3, name: 'Cat', key: 'blue'},
					{id: 9, name: 'Ian', key: 'blue'}
				]),
				'Failed to find records with trimmed key equal to value'
			);
		})

		it.skip('Should find records using non core field allowing trim option', function() {
			const res = testRA.findBy('key', 'blue', {trim: true});
			const expected = new RecordArray([
				{id: 3, name: 'Cat', key: 'blue'},
				{id: 6, name: 'Fred', key: ' blue '},
				{id: 7, name: 'Greg', key: ' blue'},
				{id: 8, name: 'Harry', key: 'blue '},
				{id: 9, name: 'Ian', key: 'blue'}
			]);
			console.log(res);
			console.log(expected);
			assert.ok( RecordArray.compareRecords(res, expected),
				'Failed to find records with trimmed key equal to value'
			);
		});
	});
	// FindByID tests end

	// FindByTag tests start
	// FindByTag tests end

	// FindOne tests start
	// FindOne tests end

	// FindOne tests start
	// FindOne tests end

	// FindOneByID tests start
	// FindOneByID tests end

	// FindOneByTag tests start
	// FindOneByTag tests end


});
