const assert = require('assert');
const RecordArray = require('../src/RecordArray.js');
const fs = require('fs'),
	fsp = fs.promise;
const testData = require('./genTestData.js');


const testRA = new RecordArray(JSON.parse(
	fs.readFileSync(__dirname+'/testdata/names.json')
));
const testRA2 = new RecordArray(JSON.parse(
	fs.readFileSync(__dirname+'/testdata/namesAndDefault.json')
));
const countries = new RecordArray(JSON.parse(
	fs.readFileSync(__dirname+'/testdata/countries.json')
));


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

	// findBy tests start
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
				{id: 5, tag: 'eddie', name: 'Eddie', key: 'red'},
				{id: 10, tag: 'john', name: 'John', key: 'red'}
			]), 'Failed to find records with key equal to value');
		})

		it('should find records using non core field default to no trim', function() {
			assert.deepStrictEqual(
				testRA.findBy('key', 'blue'),
				new RecordArray([
					{id: 3, tag: 'cat', name: 'Cat', key: 'blue'},
					{id: 9, tag: 'ian', name: 'Ian', key: 'blue'}
				]),
				'Failed to find records with trimmed key equal to value'
			);
		})

		it.skip('Should find records using non core field allowing trim option', function() {
			const res = testRA.findBy('key', 'blue', {trim: true});
			const expected = new RecordArray([
				{id: 3, tag: 'cat', name: 'Cat', key: 'blue'},
				{id: 6, tag: 'fred', name: 'Fred', key: ' blue '},
				{id: 7, tag: 'greg', name: 'Greg', key: ' blue'},
				{id: 8, tag: 'harry', name: 'Harry', key: 'blue '},
				{id: 9, tag: 'ian', name: 'Ian', key: 'blue'}
			]);
			console.log(res);
			console.log(expected);
			assert.ok( RecordArray.compareRecords(res, expected),
				'Failed to find records with trimmed key equal to value'
			);
		});
	});
	// findBy tests end

	// findByID tests start
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
				{id: 5, tag: 'eddie', name: 'Eddie', key: 'red'},
			]), 'Failed to find records with ID equal to value parameter');
		})

		it('Should find records using non core field default to no trim', function() {
			assert.deepStrictEqual(
				testRA.findBy('key', 'blue'),
				new RecordArray([
					{id: 3, tag: 'cat', name: 'Cat', key: 'blue'},
					{id: 9, tag: 'ian', name: 'Ian', key: 'blue'}
				]),
				'Failed to find records with trimmed key equal to value'
			);
		})
	});
	// findByID tests end

	// findByTag tests start
	describe('findByTag()',()=>{
		it('Should return empty RecordArray if no parameters supplied',()=>{
			const res = testRA.findByTag();
			assert.ok(res instanceof RecordArray, 'Returned must be RecordArray')
			assert.ok(res.length == 0, 'Returned must have no length')
		});
	});

	describe('findByTag(value)', ()=>{
		it('Should find records using Tag field', ()=>{
			const test = testRA.findByTag('eddie');
			assert.ok(test instanceof RecordArray);
			assert.strictEqual(test.length, 1);
			assert.strictEqual(test[0].tag, 'eddie');
			assert.deepStrictEqual(test, new RecordArray([
				{id: 5, tag: 'eddie', name: 'Eddie', key: 'red'},
			]), 'Failed to find records with ID equal to value parameter');
		})

		it('Should find records using non core field default to no trim', function() {
			assert.deepStrictEqual(
				testRA.findBy('key', 'blue'),
				new RecordArray([
					{id: 3, tag: 'cat', name: 'Cat', key: 'blue'},
					{id: 9, tag: 'ian', name: 'Ian', key: 'blue'}
				]),
				'Failed to find records with trimmed key equal to value'
			);
		})
	});
	// findByTag tests end

	/* findOne Test Sections */

	// findOne tests start
	describe('findOne()',()=>{
		// Find none.
		it('find none if no default record',()=>{
			assert.deepStrictEqual( testRA.findOne() , RecordArray.defaultRecord );
		});
		// Find default.
		it('find default record',()=>{
			assert.deepStrictEqual( testRA2.findOne() , testRA2[0] );
		});
	});
	describe('findOne(field, value)',()=>{
		// Find first.
		it('first record matching',()=>{
			assert.deepStrictEqual( testRA.findOne('key','blue') , testRA[2] );
		});
		// Find nth.
		it('nth record matching without trim as default option',()=>{
			assert.deepStrictEqual( testRA.findOne('key','blue',{nth:0}) , testRA[2] );
			assert.deepStrictEqual( testRA.findOne('key','blue',{nth:1}) , testRA[2] );
			assert.deepStrictEqual( testRA.findOne('key','blue',{nth:2}) , testRA[8] );
		});
		// Find nth with trim.
		it('nth record matching with trim',()=>{
			assert.deepStrictEqual( testRA.findOne('key','blue',{nth:0,trim:true}) , testRA[2] );
			assert.deepStrictEqual( testRA.findOne('key','blue',{nth:1,trim:true}) , testRA[2] );
			assert.deepStrictEqual( testRA.findOne('key','blue',{nth:2,trim:true}) , testRA[5] );
			assert.deepStrictEqual( testRA.findOne('key','blue',{nth:3,trim:true}) , testRA[6] );
			assert.deepStrictEqual( testRA.findOne('key','blue',{nth:4,trim:true}) , testRA[7] );
			assert.deepStrictEqual( testRA.findOne('key','blue',{nth:5,trim:true}) , testRA[8] );
		});
	});
	// findOne tests end

	// findOneByID tests start
	describe('findOneByID()',()=>{
		// Find none.
		it('find none if no default record',()=>{
			assert.deepStrictEqual( testRA.findOneByID() , RecordArray.defaultRecord );
		});
		// Find default.
		it('find default record',()=>{
			assert.deepStrictEqual( testRA2.findOneByID() , testRA2[0] );
		});
	});
	describe('findOneByID(field, value)',()=>{
		// Find first.
		it('record matching by ID',()=>{
			assert.deepStrictEqual( testRA.findOneByID(4) , testRA[3] );
		});
		// Find nth.
		it('nth record matching, 0 defaults to 1',()=>{
			assert.deepStrictEqual( testRA.findOneByID(4,{nth:0}) , testRA[3] );
			assert.deepStrictEqual( testRA.findOneByID(4,{nth:1}) , testRA[3] );
		});
		it('return empty if nth record not matching',()=>{
			assert.deepStrictEqual( testRA.findOneByID(4,{nth:2}) , {} );
		});
	});
	// findOneByID tests end

	// findOneByTag tests start
	describe('findOneByTag()',()=>{
		// Find none.
		it('find none if no default record',()=>{
			assert.deepStrictEqual( testRA.findOneByTag() , RecordArray.defaultRecord );
		});
		// Find default.
		it('find default record',()=>{
			assert.deepStrictEqual( testRA2.findOneByTag() , testRA2[0] );
		});
	});
	describe('findOneByTag(field, value)',()=>{
		// Find first.
		it('first record matching',()=>{
			assert.deepStrictEqual( testRA.findOneByTag('eddie') , testRA[4] );
		});
		// Find nth.
		it('nth record matching, 0 defaults to 1',()=>{
			assert.deepStrictEqual( testRA.findOneByTag('eddie',{nth:0}) , testRA[4] );
			assert.deepStrictEqual( testRA.findOneByTag('eddie',{nth:1}) , testRA[4] );
		});
		it('return empty if nth record not matching',()=>{
			assert.deepStrictEqual( testRA.findOneByTag('eddie',{nth:2}) , {} );
		});
	});
	// findOneByTag tests end

	/* findOne Test Sections End*/



	/* indexBy Test Sections */

	// indexBy tests start
	describe('indexBy()',()=>{
		// Find none.
		it('find none if no default record',()=>{
			assert.deepStrictEqual( testRA.indexBy() , -1 );
		});
	});
	describe('indexBy(field, value)',()=>{
		// Find first.
		it('first record matching',()=>{
			assert.deepStrictEqual( testRA.indexBy('key','blue') , 2 );
		});
		// Find nth.
		it('nth record matching without trim as default option',()=>{
			assert.deepStrictEqual( testRA.indexBy('key','blue',{nth:0}) , 2 );
			assert.deepStrictEqual( testRA.indexBy('key','blue',{nth:1}) , 2 );
			assert.deepStrictEqual( testRA.indexBy('key','blue',{nth:2}) , 8 );
		});
		// Find nth with trim.
		it('nth record matching with trim',()=>{
			assert.deepStrictEqual( testRA.indexBy('key','blue',{nth:0,trim:true}) , 2 );
			assert.deepStrictEqual( testRA.indexBy('key','blue',{nth:1,trim:true}) , 2 );
			assert.deepStrictEqual( testRA.indexBy('key','blue',{nth:2,trim:true}) , 5 );
			assert.deepStrictEqual( testRA.indexBy('key','blue',{nth:3,trim:true}) , 6 );
			assert.deepStrictEqual( testRA.indexBy('key','blue',{nth:4,trim:true}) , 7 );
			assert.deepStrictEqual( testRA.indexBy('key','blue',{nth:5,trim:true}) , 8 );
		});
	});
	// indexBy tests end

	// indexByID tests start
	describe('indexByID()',()=>{
		// Find none.
		it('find none if no default record',()=>{
			assert.deepStrictEqual( testRA.indexByID() , -1 );
		});
	});
	describe('indexByID(field, value)',()=>{
		// Find first.
		it('record matching by ID',()=>{
			assert.deepStrictEqual( testRA.indexByID(4) , 3 );
		});
		// Find nth.
		it('nth record matching, 0 defaults to 1',()=>{
			assert.deepStrictEqual( testRA.indexByID(4,{nth:0}) , 3 );
			assert.deepStrictEqual( testRA.indexByID(4,{nth:1}) , 3 );
		});
		it('return empty if nth record not matching',()=>{
			assert.deepStrictEqual( testRA.indexByID(4,{nth:2}) , -1 );
		});
	});
	// indexByID tests end

	// indexByTag tests start
	describe('indexByTag()',()=>{
		// Find none.
		it('find none if no default record',()=>{
			assert.deepStrictEqual( testRA.indexByTag() , -1 );
		});
	});
	describe('indexByTag(field, value)',()=>{
		// Find first.
		it('first record matching',()=>{
			assert.deepStrictEqual( testRA.indexByTag('eddie') , 4 );
		});
		// Find nth.
		it('nth record matching, 0 defaults to 1',()=>{
			assert.deepStrictEqual( testRA.indexByTag('eddie',{nth:0}) , 4 );
			assert.deepStrictEqual( testRA.indexByTag('eddie',{nth:1}) , 4 );
		});
		it('return empty if nth record not matching',()=>{
			assert.deepStrictEqual( testRA.indexByTag('eddie',{nth:2}) , -1 );
		});
	});
	// indexByTag tests end


});
