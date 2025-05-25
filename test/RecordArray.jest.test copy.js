// import assert from require('assert');
// import RecordArray from '../lib/index.js';

// const assert = require('assert');
const {default: RecordArray} = require('../lib/RecordArray.js');

const deepStrictEqual = (a,b)=>{
	if(a instanceof Array){
		if(!(b instanceof Array)) return false;
		if(a.length != b.length) return false;
		for(let i=0;i<a.length;i++){
			if(!deepStrictEqual(a[i],b[i])) return false;
		}
		return true;
	}
	switch(typeof(a)){
		case 'object': {
			// Same Keys
			const c = new Set(Object.keys(a));
			const d = new Set(Object.keys(b));
			if (c.size !== d.size) return false;
			for (const val of c){
				if (!d.has(val)) return false;
				if (!deepStrictEqual(a[val], b[val])) return false;
			}
			return true;
		}
		default: return a===b;
	}
}

// const expect = 0;

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
			expect(testRA.length==11,'Test Data does not have 11 records').toBe(true)
		});
	});

	describe('RecordArray', ()=>{
		it('can be created by the new keyword', function() {
			const newRA = new RecordArray();
			expect(newRA instanceof RecordArray,'Failed to be created with the new keyword').toBe(true)
		});

		it('can be created using the new method', function() {
			const newRA = RecordArray.new();
			expect(newRA instanceof RecordArray,'Failed to be created with the new method').toBe(true)
		});
	});

	// findBy tests start
	describe('findBy()', ()=>{
		it('should return empty RecordArray if no parameters supplied', function() {
			const res = testRA.findBy();
			expect(res instanceof RecordArray, 'Returned must be RecordArray').toBe(true)
			expect(res.length == 0, 'Returned must have no length').toBe(true)
		});
	});

	describe('findBy(field, value)', ()=>{
		it('should find records using non core field', function() {
			const test = testRA.findBy('key', 'red');
			expect(test instanceof RecordArray).toBe(true);
			expect(test.length=== 2).toBe(true);
			expect(test[0].id=== 5).toBe(true);
			expect(test[1].id=== 10).toBe(true);
			expect.deepStrictEqual(test, new RecordArray([
				{id: 5, tag: 'eddie', name: 'Eddie', key: 'red'},
				{id: 10, tag: 'john', name: 'John', key: 'red'}
			]), 'Failed to find records with key equal to value');
		})

		it('should find records using non core field default to no trim', function() {
			expect.deepStrictEqual(
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
			expect( RecordArray.compareRecords(res, expected).toBe(true),
				'Failed to find records with trimmed key equal to value'
			);
		});
	});
	// findBy tests end

	// findByID tests start
	describe('findByID()', ()=>{
		it('Should return empty RecordArray if no parameters supplied', function() {
			const res = testRA.findByID();
			expect(res instanceof RecordArray, 'Returned must be RecordArray').toBe(true)
			expect(res.length == 0, 'Returned must have no length').toBe(true)
		});
	});

	describe('findByID(value)', ()=>{
		it('Should find records using ID field', function() {
			const test = testRA.findByID(5);
			expect(test instanceof RecordArray).toBe(true);
			expect(test.length=== 1).toBe(true);
			expect(test[0].id=== 5).toBe(true);
			expect.deepStrictEqual(test, new RecordArray([
				{id: 5, tag: 'eddie', name: 'Eddie', key: 'red'},
			]), 'Failed to find records with ID equal to value parameter');
		})

		it('Should find records using non core field default to no trim', function() {
			expect.deepStrictEqual(
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
			expect(res instanceof RecordArray, 'Returned must be RecordArray').toBe(true)
			expect(res.length == 0, 'Returned must have no length').toBe(true)
		});
	});

	describe('findByTag(value)', ()=>{
		it('Should find records using Tag field', ()=>{
			const test = testRA.findByTag('eddie');
			expect(test instanceof RecordArray).toBe(true);
			expect(test.length=== 1).toBe(true);
			expect(test[0].tag=== 'eddie').toBe(true);
			expect.deepStrictEqual(test, new RecordArray([
				{id: 5, tag: 'eddie', name: 'Eddie', key: 'red'},
			]), 'Failed to find records with ID equal to value parameter');
		})

		it('Should find records using non core field default to no trim', function() {
			expect.deepStrictEqual(
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
			expect( testRA.findOne() === RecordArray.defaultRecord ).toBe(true);
		});
		// Find default.
		it('find default record',()=>{
			expect(deepStrictEqual( testRA2.findOne() , testRA2[0] )).toBe(true);
		});
	});
	describe('findOne(field, value)',()=>{
		// Find first.
		it('first record matching',()=>{
			expect(deepStrictEqual( testRA.findOne('key','blue') , testRA[2] )).toBe(true);
		});
		// Find nth.
		it('nth record matching without trim as default option',()=>{
			expect(deepStrictEqual( testRA.findOne('key','blue',{nth:0}) , testRA[2] )).toBe(true);
			expect(deepStrictEqual( testRA.findOne('key','blue',{nth:1}) , testRA[2] )).toBe(true);
			expect(deepStrictEqual( testRA.findOne('key','blue',{nth:2}) , testRA[8] )).toBe(true);
		});
		// Find nth with trim.
		it('nth record matching with trim',()=>{
			expect(deepStrictEqual( testRA.findOne('key','blue',{nth:0,trim:true}) , testRA[2] )).toBe(true);
			expect(deepStrictEqual( testRA.findOne('key','blue',{nth:1,trim:true}) , testRA[2] )).toBe(true);
			expect(deepStrictEqual( testRA.findOne('key','blue',{nth:2,trim:true}) , testRA[5] )).toBe(true);
			expect(deepStrictEqual( testRA.findOne('key','blue',{nth:3,trim:true}) , testRA[6] )).toBe(true);
			expect(deepStrictEqual( testRA.findOne('key','blue',{nth:4,trim:true}) , testRA[7] )).toBe(true);
			expect(deepStrictEqual( testRA.findOne('key','blue',{nth:5,trim:true}) , testRA[8] )).toBe(true);
		});
	});
	// findOne tests end

	// findOneByID tests start
	describe('findOneByID()',()=>{
		// Find none.
		it('find none if no default record',()=>{
			expect(deepStrictEqual( testRA.findOneByID() , RecordArray.defaultRecord )).toBe(true);
		});
		// Find default.
		it('find default record',()=>{
			expect(deepStrictEqual( testRA2.findOneByID() , testRA2[0] )).toBe(true);
		});
	});
	describe('findOneByID(field, value)',()=>{
		// Find first.
		it('record matching by ID',()=>{
			expect(deepStrictEqual( testRA.findOneByID(4) , testRA[3] )).toBe(true);
		});
		// Find nth.
		it('nth record matching, 0 defaults to 1',()=>{
			expect(deepStrictEqual( testRA.findOneByID(4,{nth:0}) , testRA[3] )).toBe(true);
			expect(deepStrictEqual( testRA.findOneByID(4,{nth:1}) , testRA[3] )).toBe(true);
		});
		it('return empty if nth record not matching',()=>{
			expect(deepStrictEqual( testRA.findOneByID(4,{nth:2}) , {} )).toBe(true);
		});
	});
	// findOneByID tests end

	// findOneByTag tests start
	describe('findOneByTag()',()=>{
		// Find none.
		it('find none if no default record',()=>{
			expect(deepStrictEqual( testRA.findOneByTag() , RecordArray.defaultRecord )).toBe(true);
		});
		// Find default.
		it('find default record',()=>{
			expect(deepStrictEqual( testRA2.findOneByTag() , testRA2[0] )).toBe(true);
		});
	});
	describe('findOneByTag(field, value)',()=>{
		// Find first.
		it('first record matching',()=>{
			expect(deepStrictEqual( testRA.findOneByTag('eddie') , testRA[4] )).toBe(true);
		});
		// Find nth.
		it('nth record matching, 0 defaults to 1',()=>{
			expect(deepStrictEqual( testRA.findOneByTag('eddie',{nth:0}) , testRA[4] )).toBe(true);
			expect(deepStrictEqual( testRA.findOneByTag('eddie',{nth:1}) , testRA[4] )).toBe(true);
		});
		it('return empty if nth record not matching',()=>{
			expect(deepStrictEqual( testRA.findOneByTag('eddie',{nth:2}) , {} )).toBe(true);
		});
	});
	// findOneByTag tests end

	/* findOne Test Sections End*/

	/* indexBy Test Sections */

	// indexBy tests start
	describe('indexBy()',()=>{
		// Find none.
		it('find none if no default record',()=>{
			expect(deepStrictEqual( testRA.indexBy() , -1 )).toBe(true);
		});
	});
	describe('indexBy(field, value)',()=>{
		// Find first.
		it('first record matching',()=>{
			expect(deepStrictEqual( testRA.indexBy('key','blue') , 2 )).toBe(true);
		});
		// Find nth.
		it('nth record matching without trim as default option',()=>{
			expect(deepStrictEqual( testRA.indexBy('key','blue',{nth:0}) , 2 )).toBe(true);
			expect(deepStrictEqual( testRA.indexBy('key','blue',{nth:1}) , 2 )).toBe(true);
			expect(deepStrictEqual( testRA.indexBy('key','blue',{nth:2}) , 8 )).toBe(true);
		});
		// Find nth with trim.
		it('nth record matching with trim',()=>{
			expect(deepStrictEqual( testRA.indexBy('key','blue',{nth:0,trim:true}) , 2 )).toBe(true);
			expect(deepStrictEqual( testRA.indexBy('key','blue',{nth:1,trim:true}) , 2 )).toBe(true);
			expect(deepStrictEqual( testRA.indexBy('key','blue',{nth:2,trim:true}) , 5 )).toBe(true);
			expect(deepStrictEqual( testRA.indexBy('key','blue',{nth:3,trim:true}) , 6 )).toBe(true);
			expect(deepStrictEqual( testRA.indexBy('key','blue',{nth:4,trim:true}) , 7 )).toBe(true);
			expect(deepStrictEqual( testRA.indexBy('key','blue',{nth:5,trim:true}) , 8 )).toBe(true);
		});
	});
	// indexBy tests end

	// indexByID tests start
	describe('indexByID()',()=>{
		// Find none.
		it('find none if no default record',()=>{
			expect(deepStrictEqual( testRA.indexByID() , -1 )).toBe(true);
		});
	});
	describe('indexByID(field, value)',()=>{
		// Find first.
		it('record matching by ID',()=>{
			expect(deepStrictEqual( testRA.indexByID(4) , 3 )).toBe(true);
		});
		// Find nth.
		it('nth record matching, 0 defaults to 1',()=>{
			expect(deepStrictEqual( testRA.indexByID(4,{nth:0}) , 3 )).toBe(true);
			expect(deepStrictEqual( testRA.indexByID(4,{nth:1}) , 3 )).toBe(true);
		});
		it('return empty if nth record not matching',()=>{
			expect(deepStrictEqual( testRA.indexByID(4,{nth:2}) , -1 )).toBe(true);
		});
	});
	// indexByID tests end

	// indexByTag tests start
	describe('indexByTag()',()=>{
		// Find none.
		it('find none if no default record',()=>{
			expect(deepStrictEqual( testRA.indexByTag() , -1 )).toBe(true);
		});
	});
	describe('indexByTag(field, value)',()=>{
		// Find first.
		it('first record matching',()=>{
			expect(deepStrictEqual( testRA.indexByTag('eddie') , 4 )).toBe(true);
		});
		// Find nth.
		it('nth record matching, 0 defaults to 1',()=>{
			expect(deepStrictEqual( testRA.indexByTag('eddie',{nth:0}) , 4 )).toBe(true);
			expect(deepStrictEqual( testRA.indexByTag('eddie',{nth:1}) , 4 )).toBe(true);
		});
		it('return empty if nth record not matching',()=>{
			expect(deepStrictEqual( testRA.indexByTag('eddie',{nth:2}) , -1 )).toBe(true);
		});
	});
	// indexByTag tests end

	/* indexBy Test Sections End */

	if(1==2){ // Skipping
		/* matchBy Test Sections */

		// matchBy tests start
		describe('matchBy()',()=>{
			// Find none.
			it('find none if no default record',()=>{
				expect(deepStrictEqual( testRA.matchBy() , -1 )).toBe(true);
			});
		});
		describe('matchBy(field, value)',()=>{
			// Find first.
			it('first record matching',()=>{
				expect(deepStrictEqual( testRA.matchBy('key','blue') , 2 )).toBe(true);
			});
			// Find nth.
			it('nth record matching without trim as default option',()=>{
				expect(deepStrictEqual( testRA.matchBy('key','blue',{nth:0}) , 2 )).toBe(true);
				expect(deepStrictEqual( testRA.matchBy('key','blue',{nth:1}) , 2 )).toBe(true);
				expect(deepStrictEqual( testRA.matchBy('key','blue',{nth:2}) , 8 )).toBe(true);
			});
			// Find nth with trim.
			it('nth record matching with trim',()=>{
				expect(deepStrictEqual( testRA.matchBy('key','blue',{nth:0,trim:true}) , 2 )).toBe(true);
				expect(deepStrictEqual( testRA.matchBy('key','blue',{nth:1,trim:true}) , 2 )).toBe(true);
				expect(deepStrictEqual( testRA.matchBy('key','blue',{nth:2,trim:true}) , 5 )).toBe(true);
				expect(deepStrictEqual( testRA.matchBy('key','blue',{nth:3,trim:true}) , 6 )).toBe(true);
				expect(deepStrictEqual( testRA.matchBy('key','blue',{nth:4,trim:true}) , 7 )).toBe(true);
				expect(deepStrictEqual( testRA.matchBy('key','blue',{nth:5,trim:true}) , 8 )).toBe(true);
			});
		});
		// matchBy tests end

		// matchByID tests start
		describe('matchByID()',()=>{
			// Find none.
			it('find none if no default record',()=>{
				expect(deepStrictEqual( testRA.matchByID() , -1 )).toBe(true);
			});
		});
		describe('matchByID(field, value)',()=>{
			// Find first.
			it('record matching by ID',()=>{
				expect(deepStrictEqual( testRA.matchByID(4) , 3 )).toBe(true);
			});
			// Find nth.
			it('nth record matching, 0 defaults to 1',()=>{
				expect(deepStrictEqual( testRA.matchByID(4,{nth:0}) , 3 )).toBe(true);
				expect(deepStrictEqual( testRA.matchByID(4,{nth:1}) , 3 )).toBe(true);
			});
			it('return empty if nth record not matching',()=>{
				expect(deepStrictEqual( testRA.matchByID(4,{nth:2}) , -1 )).toBe(true);
			});
		});
		// matchByID tests end

		// matchByTag tests start
		describe('matchByTag()',()=>{
			// Find none.
			it('find none if no default record',()=>{
				expect(deepStrictEqual( testRA.matchByTag() , -1 )).toBe(true);
			});
		});
		describe('matchByTag(field, value)',()=>{
			// Find first.
			it('first record matching',()=>{
				expect(deepStrictEqual( testRA.matchByTag('eddie') , 4 )).toBe(true);
			});
			// Find nth.
			it('nth record matching, 0 defaults to 1',()=>{
				expect(deepStrictEqual( testRA.matchByTag('eddie',{nth:0}) , 4 )).toBe(true);
				expect(deepStrictEqual( testRA.matchByTag('eddie',{nth:1}) , 4 )).toBe(true);
			});
			it('return empty if nth record not matching',()=>{
				expect(deepStrictEqual( testRA.matchByTag('eddie',{nth:2}) , -1 )).toBe(true);
			});
		});
		// matchByTag tests end

		/* matchBy Test Sections End */

	}; // Skipping End

});
