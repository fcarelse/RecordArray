/** RecordArray
 *
 * @description: An extension of Array that provides record processing related methods
 * @author Francis Carelse
 * @version 0.0.6
 */

class RecordArray extends Array{
	/**
	 * @constructor
	 * @param {Array} array (optional)
	 */
	constructor(array) {
		if(!(array instanceof Array)) array = [];
		// Apply the superclass
		super();
		// If supplied array parameter is an Array
		if (array instanceof Array){
			// Then iterate over each object in it
			array.forEach(record => {
				// Push a duplicate of record
				this.push(Object.assign({}, record));
			});
		}
	}
}

RecordArray.defaultOptions = {};
Object.freeze(RecordArray.defaultOptions);

RecordArray.defaultRecord = {};
Object.freeze(RecordArray.defaultRecord);

// If you change this then remember to freeze as it should not change across your application.
RecordArray.recordClass = Object;

RecordArray.new = function(array){
	return new RecordArray(array);
};

RecordArray.prototype.asyncEach = async function(cb){
	for(let i=0;i<this.length;i++){
		await cb(this[i], i);
	}
};

module.exports = RecordArray;
// // Extend the Array class via old method.
// RecordArray.prototype = Object.create(Array.prototype);
// RecordArray.prototype.constructor = RecordArray;

/**
 * Find all by specified field equal to value
 * @param field string: Key to use for searching records
 * @param value any: Value to search for
 * @param options object (optional): Additional parameters for the find operation
 * options parameter can be boolean and will be used for the strict option
 */
RecordArray.prototype.findBy = function(field, value, options) {
	// Create a RecordArray to be returned
	let arr = new RecordArray();

	options = options instanceof Object? options: RecordArray.defaultOptions;

	// If no parameters then return empty RecordArray.
	if(value === undefined){
		if(options.returnIndex)
			return -1;
		else if(options.returnFirst){
			return this.findByID(0,options) ||
				this.findByTag('',options) ||
				(
					options.def !== undefined?
						options.def:
						RecordArray.defaultRecord
				);
		} else
			return arr;
	}



	// Test field is not string primitive or string object then return.
	if(typeof field != 'string' && !(field instanceof String)){
		if(options.returnIndex)
			return -1;
		else if(options.returnFirst){
			return this.findByID(0,options) ||
				this.findByTag('',options) ||
				(
					options.def !== undefined?
						options.def:
						RecordArray.defaultRecord
				);
		} else
			return arr;
	}

	// Ensure there is an options object
	if(!(options instanceof Object) || options == null){
		// Check if boolean to become the strict option
		if(options instanceof Boolean || typeof options == 'boolean')
			// Convert options to object with boolean value as strict option.
			options = {strict: options};
		else
			// Set options to new basic parameters object
			options = {};
	}

	// Force strict option to boolean
	options.strict = !!options.strict;

	// Force strict option to boolean
	options.nth = options.nth || 1;

	// If value not defined then just return the empty array
	if (value === undefined) return arr;

	// If null or undefined value to search for then enforce strict equality
	if (value === null) options.strict = true;

	// Go through all records
	for(let i=0;i<this.length;i++){
		record = this[i];

		// Find a matching field
		field = Object.keys(record).filter(key=>

			// Check the trim option
			options.trim?

				// Compare field with trimmed key
				key.trim()==field:

				// Otherwise compare field with key
				key==field
		)[0];

		const compared = options.trim?
			record[field].toString().trim():
			record[field];

		if(
			// field should not be undefined
			field !== undefined &&
			// stored value is not undefined
			compared !== undefined &&
			// and apply strictness in comparison as per option between stored value and matching value
			((!options.strict && compared == value) || Object.is(compared, value))
		// Then append record to return RecordArray
		){
			if(!--options.nth){
				if(options.returnIndex)
					return i;
				else if(options.returnFirst)
					return record;
			}
			arr.push(record);
		}
	}

	// Return resultant RecordArray or unfound return value.
	if(options.returnIndex)
		return -1;
	else if(options.returnFirst)
		return options.def !== undefined?
			options.def:
			{};
	else
		return arr;
}

RecordArray.prototype.findByID = function(value, options) {
	return this.findBy("id", value, options);
}

RecordArray.prototype.findByTag = function(value, options) {
	return this.findBy("tag", value, options);
}

RecordArray.prototype.findOne = function(key, value, options) {
	return this.findBy(key, value, {...options, returnFirst: true});
}

RecordArray.prototype.findOneByID = function(value, options) {
	return this.findBy('id', value, {...options, returnFirst: true});
}

RecordArray.prototype.findOneByTag = function(value, options) {
	return this.findBy('tag', value, {...options, returnFirst: true});
}

RecordArray.prototype.indexBy = function(field, value, options) {
	return this.findBy(field, value, {...options, returnIndex: true});
}

RecordArray.prototype.indexByID = function(value, options) {
	return this.indexBy("id", value, options);
}

RecordArray.prototype.indexByTag = function(value, options) {
	return this.indexBy("tag", value, options);
}

RecordArray.prototype.matchBy = function(key, values){
	var arr = new RecordArray();
	// Undefined values means no matches.
	if(values === undefined) return arr;
	// ensure values is an array. Insert into new array and assign if need be.
	if(!(values instanceof Array)) values = [values];
	// flatten values array;
	values = [].concat(values);
	for(var i = 0; i < values.length; i++)
		arr[i] = this.findOne(key, values[i]);
	return arr;
}

RecordArray.prototype.sortBy = function(field, order) {
	// Assert field parameter is a string.
	if (typeof field !== "string")
		throw new TypeError("String expected for first parameter.");
	// Assert order parameter is ASC or DESC
	if (
		typeof order !== "string" ||
		!(order.toLowerCase() === "asc" || order.toLowerCase() === "desc")
	)
		throw new TypeError(
			"'ASC' or 'DESC' String expected for second parameter."
		);
	// Return sorted using appropriate function
	return this.sort(order.toLowerCase() == "asc" ? sortFnASC : sortFnDESC);
	// Sorting Ascending Strategy
	function sortFnASC(a, b) {
		var c =
			// Evaluate to 0 f equal
			a[field] == b[field]?
				0:
				// 1 indicates wrong order. -1 indicates correct order
				a[field] > b[field]?
					1:
					-1;
		// This does not work if you do not assign to a variable before returning.
		return c;
	}
	// Sorting Descending Strategy (just reverse the testing parameters)
	function sortFnDESC(a, b) {
		return sortFnASC(b, a);
	}
}

/**
 * Sort this RecordArray by a set of fields in ascending order
 * Takes an array of strings or a space separated string of fieldnames
 * @param {Array<String> | String} fields
 */
RecordArray.prototype.sortASC = function(fields) {
	// If fields parameter is not already an Array
	if (!(fields instanceof Array))
		// Ensure is string and split space separated fieldnames
		fields = fields.toString().split(" ");
	// Throw out any non string fields
	fields = fields.filter(f => typeof f === "string");
	// If no fields left then abort
	if (!fields.length)
		throw new TypeError(
			'Parameter "fields" needs to be an array of strings or space separated list of field names'
		);
	// Return sort using item pair evaluation strategy
	return this.sort(function(a, b) {
		// Iterate over fields list
		for (var i = 0; i < fields.length; i++)
			// Sequentially check for the first instance of inequality
			if (a[fields[i]] != b[fields[i]])
				// If wrong order then pass back 1 otherwise -1
				return a[fields[i]] > b[fields[i]] ? 1 : -1;
		// All fields are equal so return 0 for matching
		return 0;
	});
}

/**
 * Sort this RecordArray by a set of fields in descending order
 * Takes an array of strings or a space separated string of fieldnames
 * @param {Array<String> | String} fields
 */
RecordArray.prototype.sortDESC = function(fields) {
	// If fields parameter is not already an Array
	if (!(fields instanceof Array))
		// Ensure is string and split space separated fieldnames
		fields = fields.toString().split(" ");
	// Throw out any non string fields
	fields = fields.filter(f => typeof f === "string");
	// If no fields left then abort
	if (!fields.length)
		throw new TypeError(
			'Parameter "fields" needs to be an array of strings or space separated list of field names'
		);
	// Return sort using item pair evaluation strategy
	return this.sort(function(a, b) {
		// Iterate over fields list
		for (var i = 0; i < fields.length; i++)
			// Sequentially check for the first instance of inequality
			if (a[fields[i]] != b[fields[i]])
				// If wrong order then pass back 1 otherwise -1
				return a[fields[i]] < b[fields[i]] ? 1 : -1;
		// All fields are equal so return 0 for matching;
		return 0;
	});
}

/**
 * Clone this RecordArray or supplied Array of reords to a new RecordArray
 * @param {Array} arr
 */
RecordArray.prototype.clone = function(arr) {
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
RecordArray.prototype.toArray = function() {
	// Clone to an Array
	return this.map(record => Object.assign({}, record));
}

RecordArray.prototype.getName = function(id) {
	var records = this.findBy("id", id);
	if (records.length === 0) return false;
	else if (records.length > 0) return records[0].name;
};

RecordArray.prototype.getNameByTag = function(tag) {
	var records = this.findBy("tag", tag);
	if (records.length === 0) return false;
	else if (records.length > 0) return records[0].name;
};

/**
 * List all values of a specified field
 * @param field string: Key to use for searching records
 * @param value any: Value to search for
 * @param options object (optional): Additional parameters for the find operation
 * options parameter can be boolean and will be used for the trim option
 */
RecordArray.prototype.listValues = function(field, options) {
	// Test field is string primitive or string object.
	if(typeof field != 'string' && !(field instanceof String))
		throw new TypeError('Field Name parameter required');
	// Create a RecordArray to be returned
	var arr = [];
	// Ensure there is an options object
	if(!(options instanceof Object)){
		// Check if boolean to become the strict option
		if(options instanceof Boolean || typeof options == 'boolean')
			// Convert options to object with boolean value as strict option.
			options = {trim: options};
		else
			// Set options to new basic parameters object
			options = {};
	}
	// Force strict option to boolean
	options.trim = !!options.trim;
	// Use index 'i' for all index values
	for (var i = 0; i < this.length; i++){
		// Evaluate the field dependant on the trim option
		let field = options.trim?
			// Trim and evaluate the field in the record indexed by 'i'
			this[i][key].toString().trim():
			// Simply evaluate the field in the record indexed by 'i'
			this[i][key];

		// stored value is not undefined
		if (field !== undefined)
			// Then append value to returned array
			arr.push(this[i][field]);
	}
	// Return resultant RecordArray
	return arr;
}

// TBD
RecordArray.prototype.create = function(options, filters) {
	throw Error("Function yet to be developed");
}

RecordArray.prototype.read = function(options, filters) {
	throw Error("Function yet to be developed");
}

RecordArray.prototype.update = function(options, filters) {
	throw Error("Function yet to be developed");
}

RecordArray.prototype.delete = function(options, filters) {
	throw Error("Function yet to be developed");
}

RecordArray.prototype.list = function(options, filters) {
	throw Error("Function yet to be developed");
}

// faulty. Comparing objects at the moment not keys or value.
RecordArray.compareRecords = (record1, record2, strict)=>{
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

/*
//// IndexBy function now handled by findBy function with option flag returnIndex

// Find the index of a record using it's "id"
RecordArray.prototype.indexBy = function(field, value, strict) {
	// Assert field not null
	if (field == null) return;
	// Assert field is a string
	if (typeof field !== "string") throw new TypeError("Field must be a string");
	// Assert field exists in the first record
	if (this[field] === undefined)
		throw new TypeError("First record does not have field");

	// Iterate index "i" for this recordarray
	for (let i = 0; i < this.length; i++)
		// If parameter strict is truthy then enforce type comparison
		if (this[i][field] == value && (!strict || this[i][field] === value))
			// exit function returning id as soon as found
			return i;
};

// Find the index of a record using it's "id"
RecordArray.prototype.indexByID = function(id, strict) {
	if (id == null) throw new TypeError("ID cannot be null or undefined");
	return RecordArray.prototype.call(this, "id", id, strict);
};

// Find the index of a record using it's "tag"
RecordArray.prototype.indexByTag = function(tag, strict) {
	if (tag == null) throw new TypeError("Tag cannot be null or undefined");
	return RecordArray.prototype.call(this, "tag", tag, strict);
};

//// IndexBy function now handled by findBy function with option flag returnIndex
*/

RecordArray.prototype.unique = function(field, strict) {
	// Default field to 'id'
	if (field == null) field = "id";
	// Compare current index with index of first occurence of record with field with that value)
	return this.filter((e, i) => this.indexBy(field, e[field], strict) == i);
};

RecordArray.prototype.uniqueBy = function(field, strict) {
	// Assert field is a string
	if (field == null || typeof field !== "string")
		throw new TypeError("Field required");
	// Compare current index with index of first occurence of record with field with that value)
	return this.filter((e, i) => this.indexFrom(field, e[field], strict) == i);
};

RecordArray.prototype.uniqueIDs = function(strict){
	return this.unique().listValues('id');
};

RecordArray.prototype.hasRecord = function(record){
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
RecordArray.prototype.extend = function(arr) {
	arr.forEach(record=>{
		if(this.hasRecord(record)) this.update(record);
		else this.push(record);
	});
	return this.sortASC('id');
};

RecordArray.prototype.topID = function(){
	// Iterate over this recordArray and reduce all IDs to the largest.
	return this.reduce((record, topID)=>
		topID>record.id?
			topID:
			record.id
	, 0);
}

RecordArray.prototype.merge = function(arr) {
	arr.forEach(r=>this.push(r));
	return this;
};

/*
 * @description: Comparing 2 RecordArrays
 * @author: Francis Carelse
 * @param RA1: RecordArray
 * @param RA2: RecordArray
 * @param strict: Boolean will enforce second RecordArray only has the same records
 * @param identical: Boolean will enforce each record by index is compared
 * @returns: Boolean true if equal
 * @note:
 */
RecordArray.compare = (RA1, RA2, options) => {
	// Assert RA1 is an Array
	if (!(RA1 instanceof Array))
		throw new TypeError("Parameter 1 must be Array or RecordArray");
	// Assert RA2 is an Array
	if (!(RA2 instanceof Array))
		throw new TypeError("Parameter 2 must be Array or RecordArray");

	// Ensure there is an options object
	if(!(options instanceof Object)){
		// Check if boolean to become the strict option
		if(options instanceof Boolean || typeof options == 'boolean')
			// Convert options to object with boolean value as strict option.
			options = {strict: options};
		else
			// Set options to new basic parameters object
			options = {};
	}

	// Force strict option to boolean
	options.strict = !!options.strict;

	// Force identical option to boolean
	options.identical = !!options.identical;

	// Compare Lengths of unique IDs.
	if (options.strict && RA1.uniqueIDs().length !== RA2.uniqueIDs().length) return false;

	// Compare records
	if (options.identical) {
		if ( !RA1.every( ( record, index) =>
			RecordArray.compareRecords(record, RA2[index], options.strict)
		)) return false;
	} else {
		if ( !RA1.every(record =>
			RecordArray.compareRecords(record, RA2.findOne("id", record.id), options.strict)
		)) return false;
	}

	return true;
};
