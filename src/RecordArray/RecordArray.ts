import { compare } from "./methods/compare";
import { DEFAULT_OPTIONS } from "./RecordArray.consts";
import { ArrayOfRecords, RecordArrayOptions, RecordKey, RecordSortOrder, RecordType, RecordValue } from "./RecordArray.types";
import { sortASC, sortBy, sortDESC } from "./methods/sorting";
import { findBy } from "./methods/findBy";

/** RecordArray
 *
 * @description: An extension of Array that provides record processing related methods
 * @author Francis Carelse
 * @version 0.0.11
 */

export class RecordArray extends Array{
	/**
	 * @constructor
	 * @param {Array<Record>} array (optional)
	 * @param {Object} options (optional)
	 */
	constructor(array: Array<RecordType> = [], options: RecordArrayOptions = DEFAULT_OPTIONS) {
		super();
		if(!(options instanceof Object)) options = DEFAULT_OPTIONS;
		if(options.data instanceof Array) array = options.data;
		if(!(array instanceof Array)) array = [];
		array.forEach(record => this.push(Object.assign({}, record)));
	}

	static new(array: Array<RecordType> = [], options: RecordArrayOptions = DEFAULT_OPTIONS){
		return new RecordArray(array, options);
	}

	findBy(field: RecordKey, value: RecordValue, options = DEFAULT_OPTIONS): any {
		return findBy(this, field, value, options);
	}

	new(array: ArrayOfRecords){
		return new RecordArray(array);
	};
	
	async asyncEach(cb: Function){
		for(let i=0;i<this.length;i++){
			await cb(this[i], i);
		}
	};

	findByID(value: RecordValue, options: RecordArrayOptions = DEFAULT_OPTIONS) {
		return this.findBy("id", value, options);
	}
	
	public findByTag(value: RecordValue, options: RecordArrayOptions = DEFAULT_OPTIONS) {
		return this.findBy("tag", value, options);
	}

	findOne(key: RecordKey, value: RecordValue, options: RecordArrayOptions = DEFAULT_OPTIONS) {
		return this.findBy(key, value, {...options, returnFirst: true});
	}
	
	findOneByID(value: RecordValue, options: RecordArrayOptions = DEFAULT_OPTIONS) {
		return this.findBy('id', value, {...options, returnFirst: true});
	}
	
	findOneByTag(value: RecordValue, options: RecordArrayOptions = DEFAULT_OPTIONS) {
		return this.findBy('tag', value, {...options, returnFirst: true});
	}
	
	indexBy(field: RecordKey, value: RecordValue, options: RecordArrayOptions = DEFAULT_OPTIONS) {
		return this.findBy(field, value, {...options, returnIndex: true});
	}
	
	indexByID(value: RecordValue, options: RecordArrayOptions = DEFAULT_OPTIONS) {
		return this.indexBy("id", value, options);
	}
	
	indexByTag(value: RecordValue, options: RecordArrayOptions = DEFAULT_OPTIONS) {
		return this.indexBy("tag", value, options);
	}
	
	matchBy(key: RecordKey, values: Array<RecordValue>){
		var arr = new RecordArray();
		// Undefined values means no matches.
		if(values === undefined) return arr;
		// ensure values is an array. Insert into new array and assign if need be.
		if(!(values instanceof Array)) values = [values];
		// flatten values array;
		values = [...values];
		for(var i = 0; i < values.length; i++)
			arr[i] = this.findOne(key, values[i]);
		return arr;
	}
	
	sortBy(field: RecordKey, order: RecordSortOrder = 'ASC') {
		return sortBy(this, field, order);
	}
	
	sortASC(fields: Array<string> | string) {
		return sortASC(this, fields);
	}
	
	sortDESC(fields: Array<string> | string) {
		return sortDESC(this, fields)
	}

	/**
	 * Clone this RecordArray or supplied Array of records to a new RecordArray
	 * @param {Array} arr
	 */
	clone(arr: RecordArray | ArrayOfRecords) {
		// If no source array supplied then use this one
		arr = arr || this;
		// Create new RecordArray
		var clone = new RecordArray();
		for (var i = 0; i < arr.length; i++) clone.push(Object.assign({}, arr[i]));
		return clone;
	}
	
	/**
	 * @returns 'Array of cloned records'
	 */
	toArray() {
		// Clone to an Array
		return this.map(record => Object.assign({}, record));
	}
	
	getName(id: number | string) {
		var records = this.findBy("id", id);
		if (records.length === 0) return false;
		else if (records.length > 0) return records[0].name;
	};
	
	getNameByTag(tag: string) {
		var records = this.findBy("tag", tag);
		if (records.length === 0) return false;
		else if (records.length > 0) return records[0].name;
	};
	
	/**
	 * List all values of a specified field
	 * @param field string: Key to use for searching records
	 * @param options object (optional): Additional parameters for the list operation
	 * options parameter can be boolean and will be used for the trim option
	 */
	listValues(field: string = 'id') {
		// Test field is string primitive or string object.
		// Create a RecordArray to be returned
		var arr: Array<RecordValue> = [];
		// Use index 'i' for all index values
		for (let i = 0; i < this.length; i++){
			// stored value is not undefined
			if (!!this[i][field])
				// Then append value to returned array
				arr.push(this[i][field]);
		}
		// Return resultant RecordArray
		return arr;
	}
	
	// @ts-ignore TBD
	create(data: object, options?: object = {}) {
		throw Error("Function yet to be developed");
	}
	
	// @ts-ignore TBD
	read(data: object, options?: object = {}) {
		throw Error("Function yet to be developed");
	}
	
	// @ts-ignore TBD
	update(data: object, options?: object = {}) {
		throw Error("Function yet to be developed");
	}
	
	// @ts-ignore TBD
	delete(data: object, options?: object = {}) {
		throw Error("Function yet to be developed");
	}
	
	// @ts-ignore TBD
	list(data: object, options?: object = {}) {
		throw Error("Function yet to be developed");
	}
	
	// faulty. Comparing objects at the moment not keys or value.
	static compareRecords(record1: RecordType, record2: RecordType, strict: Boolean = true){
		// Default "strict" to true
		if(strict !== false) strict = true;
	
		// Compare Keys
		let keys1 = Object.keys(record1).sort();
		let keys2 = Object.keys(record2).sort();
		if(strict && keys1.length !== keys2.length) return false;
	
		// Compare keys
		if(!keys1.every((value, index) => value === keys2[index])) return false;
	
		// Compare values
		if(!keys1.every((key, index) => record1[key] === record2[key])) return false;
		return true;
	}

	// indexBy(field: string = 'id',value: any, strict: boolean = false){
	// 	return this.findBy(field, value, {returnIndex: true, strict});
	// }
	
	unique(field: string = 'id', strict: boolean = false) {
		// Compare current index with index of first occurence of record with field with that value)
		this.filter((e, i) => this.indexBy(field, e[field], {strict}) == i);
		return this;
	};
	
	uniqueBy(field: string, strict: boolean = false) {
		// Compare current index with index of first occurence of record with field with that value)
		return this.filter((record, i) => this.indexBy(field, record[field], {strict}) == i);
	};
	
	uniqueIDs(strict: boolean = true){
		return this.unique('id', strict).listValues('id');
	};
	
	hasRecord(record: RecordType){
		if(!!record.id)
			return !!this.findOneByID(record.id);
		else if(!!record.tag)
			return !!this.findOneByTag(record.tag);
		else
			return false;
	}
	
	/**
	 * Extend the RecordArray array by updating or creating based on matching ID
	 */
	extend(arr: RecordArray | ArrayOfRecords) {
		arr.forEach((record: RecordType)=>{
			if(this.hasRecord(record)) this.update(record);
			else this.push(record);
		});
		return this.sortASC('id');
	};
	
	topID(){
		// Iterate over this recordArray and reduce all IDs to the largest.
		return this.reduce((record, topID)=>
			topID>record.id?
				topID:
				record.id
		, 0);
	}
	
	merge(arr: Array<any>) {
		arr.forEach(r=>this.push(r));
		return this;
	};

	static compare(RA1: RecordArray, RA2: RecordArray, options?: any){
		return compare(RA1, RA2, options)
	}
}

export default RecordArray;