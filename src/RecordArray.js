/** RecordArray
 *
 * @description: An extension of Array that provides record processing related methods
 * @author Francis Carelse
 * @version 0.0.1
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
	// Test field is string primitive or string object.
	if(typeof field != 'string' && !(field instanceof String))
		throw new TypeError('Field Name parameter required');
	// Create a RecordArray to be returned
	var arr = new RecordArray();
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
	// If value not defined then just return the empty array
	if (value === undefined) return arr;
	// If null or undefined value to search for then enforce strict equality
	if (value === null) options.strict = true;
	// Use index 'i' for all index values
	for (var i = 0; i < this.length; i++){
		// Evaluate the field dependant on the trim option
		let field = options.trim?
			// Trim and evaluate the field in the record indexed by 'i'
			this[i][key].toString().trim():
			// Simply evaluate the field in the record indexed by 'i'
			this[i][key];

		if (
			// stored value is not undefined
			field !== undefined &&
			// and apply strictness in comparison as per option
			((!options.strict && field == value) || Object.equal(field === value))
		// Then append record to return RecordArray
		) arr.push(Object.assign({},this[i]));
	}
	// Return resultant RecordArray
	return arr;
}

RecordArray.prototype.findById = function(value, options) {
	return this.findBy("id", value, options);
}

RecordArray.prototype.findByTag = function(value, options) {
	return this.findBy("tag", value, options);
}

RecordArray.prototype.findOne = function(key, value, options) {
	var arr = this;
	strict = !!strict;
	if (value === null) return false;
	if (value === undefined) return false;
	for (var i = 0; i < arr.length; i++)
		if (
			arr[i][key] &&
			((!strict && arr[i][key] == value) || arr[i][key] === value)
		)
			return arr[i];
	return false;
}

RecordArray.prototype.findOneById = function(value, strict) {
	return this.findOne("id", value, strict);
}

RecordArray.prototype.findOneByTag = function(value, strict) {
	return this.findOne("tag", value, strict);
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

// RecordArray.prototype.clone = function(){
// 	var arr = this; //
// 	var clone = [];
// 	for(var i = 0; i < arr.length; i++)
// 		clone.push( Object.assign({}, arr[i]) );
// 	return clone;
// };

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

RecordArray.prototype.unique = function(field, strict) {
	// Default field to 'id'
	if (field == null) field = "id";
	// Compare current index with index of first occurence of record with field with that value)
	return this.filter((e, i) => this.indexFrom(field, e[field], strict) == i);
};

RecordArray.prototype.uniqueBy = function(field, strict) {
	// Assert field is a string
	if (field == null || typeof field !== "string")
		throw new TypeError("Field required");
	// Compare current index with index of first occurence of record with field with that value)
	return this.filter((e, i) => this.indexFrom(field, e[field], strict) == i);
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
RecordArray.compare = (RA1, RA2, strict, identical) => {
	// Assert RA1 is an Array
	if (!(RA1 instanceof Array))
		throw new TypeError("Parameter 1 must be Array or RecordArray");
	// Assert RA2 is an Array
	if (!(RA2 instanceof Array))
		throw new TypeError("Parameter 2 must be Array or RecordArray");

	// Default "strict" to true
	if (strict !== false) strict = true;

	// Compare Lengths of unique IDs.
	if (strict && RA1.uniqueIDs.length !== RA2.uniqueIDs.length) return false;

	// Compare records
	if (identical) {
		if (
			!RA1.every((record, index) => Records.compare(record, RA2[index], strict))
		)
			return false;
	} else {
		if (
			!RA1.every(record =>
				Records.compare(record, RA2.findOne("id", record.id), strict)
			)
		);
		return false;
	}

	return true;
};
