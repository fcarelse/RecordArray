"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_RECORD = exports.DEFAULT_OPTIONS = void 0;
exports.DEFAULT_OPTIONS = {};
Object.freeze(exports.DEFAULT_OPTIONS);
exports.DEFAULT_RECORD = {};
Object.freeze(exports.DEFAULT_RECORD);
/** RecordArray
 *
 * @description: An extension of Array that provides record processing related methods
 * @author Francis Carelse
 * @version 0.0.11
 */
class RecordArray extends Array {
    /**
     * @constructor
     * @param {Array<Record>} array (optional)
     * @param {Object} options (optional)
     */
    constructor(array = [], options = exports.DEFAULT_OPTIONS) {
        super();
        if (!(options instanceof Object))
            options = exports.DEFAULT_OPTIONS;
        if (options.data instanceof Array)
            array = options.data;
        if (!(array instanceof Array))
            array = [];
        array.forEach(record => this.push(Object.assign({}, record)));
    }
    static new(array = [], options = exports.DEFAULT_OPTIONS) {
        return new RecordArray(array, options);
    }
    findBy(field, value, options = exports.DEFAULT_OPTIONS) {
        // Create a RecordArray to be returned
        let arr = new RecordArray();
        options = options instanceof Object ?
            Object.assign({}, exports.DEFAULT_OPTIONS, options) :
            exports.DEFAULT_OPTIONS;
        // If no parameters then return empty RecordArray.
        if (value === undefined) {
            if (options.returnIndex)
                return -1;
            else if (options.returnFirst) {
                return this.findByID(0, options) ||
                    this.findByTag('', options) ||
                    (options.def !== undefined ?
                        options.def :
                        exports.DEFAULT_RECORD);
            }
            // If value not defined then just return the empty array
            return arr;
        }
        // Force strict option to boolean
        options.strict = !!options.strict;
        // If null or undefined value to search for then enforce strict equality
        if (value === null)
            options.strict = true;
        // set which result to return;
        let nth = options.nth || 1;
        // Go through all records
        for (let i = 0; i < this.length; i++) {
            let record = this[i];
            // Find a matching field
            field = Object.keys(record).filter(key => 
            // Check the trim option
            options.trim ?
                // Compare field with trimmed key
                key.trim() == field :
                // Otherwise compare field with key
                key == field)[0];
            const compared = options.trim ?
                String(record[field]).trim() :
                record[field];
            if (
            // field should not be undefined
            field !== undefined &&
                // stored value is not undefined
                compared !== undefined &&
                // and apply strictness in comparison as per option between stored value and matching value
                ((!options.strict && compared == value) || Object.is(compared, value))
            // Then append record to return RecordArray
            ) {
                if (!--nth || options.returnFirst) {
                    if (options.returnIndex)
                        return i;
                    else
                        return record;
                }
                arr.push(record);
            }
        }
        // Return resultant RecordArray or unfound return value.
        if (options.returnIndex)
            return -1;
        else if (options.returnFirst)
            return options.def !== undefined ?
                options.def :
                {};
        else
            return arr;
    }
    new(array) {
        return new RecordArray(array);
    }
    ;
    async asyncEach(cb) {
        for (let i = 0; i < this.length; i++) {
            await cb(this[i], i);
        }
    }
    ;
    findByID(value, options = exports.DEFAULT_OPTIONS) {
        return this.findBy("id", value, options);
    }
    findByTag(value, options = exports.DEFAULT_OPTIONS) {
        return this.findBy("tag", value, options);
    }
    findOne(key, value, options = exports.DEFAULT_OPTIONS) {
        return this.findBy(key, value, { ...options, returnFirst: true });
    }
    findOneByID(value, options = exports.DEFAULT_OPTIONS) {
        return this.findBy('id', value, { ...options, returnFirst: true });
    }
    findOneByTag(value, options = exports.DEFAULT_OPTIONS) {
        return this.findBy('tag', value, { ...options, returnFirst: true });
    }
    indexBy(field, value, options = exports.DEFAULT_OPTIONS) {
        return this.findBy(field, value, { ...options, returnIndex: true });
    }
    indexByID(value, options = exports.DEFAULT_OPTIONS) {
        return this.indexBy("id", value, options);
    }
    indexByTag(value, options = exports.DEFAULT_OPTIONS) {
        return this.indexBy("tag", value, options);
    }
    matchBy(key, values) {
        var arr = new RecordArray();
        // Undefined values means no matches.
        if (values === undefined)
            return arr;
        // ensure values is an array. Insert into new array and assign if need be.
        if (!(values instanceof Array))
            values = [values];
        // flatten values array;
        values = [...values];
        for (var i = 0; i < values.length; i++)
            arr[i] = this.findOne(key, values[i]);
        return arr;
    }
    sortBy(field, order = 'ASC') {
        // Assert field parameter is a string.
        if (typeof field !== "string")
            throw new TypeError("String expected for first parameter.");
        // Assert order parameter is ASC or DESC
        if (!['ASC', 'DESC'].includes(order))
            throw new TypeError("'ASC' or 'DESC' expected for second parameter.");
        // Return sorted using appropriate function
        return this.sort(order.toUpperCase() == 'ASC' ? sortFnASC : sortFnDESC);
        // Sorting Ascending Strategy
        function sortFnASC(a, b) {
            return a[field] == b[field] ?
                0 : (a[field] > b[field] ? 1 : -1);
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
    sortASC(fields) {
        // If fields parameter is not already an Array
        if (!(fields instanceof Array))
            // Ensure is string and split space separated fieldnames
            fields = fields.toString().split(" ");
        // Throw out any non string fields
        fields = fields.filter(f => typeof f === "string");
        // If no fields left then abort
        if (!fields.length)
            throw new TypeError('Parameter "fields" needs to be an array of strings or space separated list of field names');
        // Return sort using item pair evaluation strategy
        return this.sort(function (a, b) {
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
    sortDESC(fields) {
        // If fields parameter is not already an Array
        if (!(fields instanceof Array))
            // Ensure is string and split space separated fieldnames
            fields = fields.toString().split(" ");
        // Throw out any non string fields
        fields = fields.filter(f => typeof f === "string");
        // If no fields left then abort
        if (!fields.length)
            throw new TypeError('Parameter "fields" needs to be an array of strings or space separated list of field names');
        // Return sort using item pair evaluation strategy
        return this.sort(function (a, b) {
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
    clone(arr) {
        // If no source array supplied then use this one
        arr = arr || this;
        // Create new RecordArray
        var clone = new RecordArray();
        for (var i = 0; i < arr.length; i++)
            clone.push(Object.assign({}, arr[i]));
        return clone;
    }
    /**
     * @returns 'Array of cloned records'
     */
    toArray() {
        // Clone to an Array
        return this.map(record => Object.assign({}, record));
    }
    getName(id) {
        var records = this.findBy("id", id);
        if (records.length === 0)
            return false;
        else if (records.length > 0)
            return records[0].name;
    }
    ;
    getNameByTag(tag) {
        var records = this.findBy("tag", tag);
        if (records.length === 0)
            return false;
        else if (records.length > 0)
            return records[0].name;
    }
    ;
    /**
     * List all values of a specified field
     * @param field string: Key to use for searching records
     * @param options object (optional): Additional parameters for the list operation
     * options parameter can be boolean and will be used for the trim option
     */
    listValues(field = 'id') {
        // Test field is string primitive or string object.
        // Create a RecordArray to be returned
        var arr = [];
        // Use index 'i' for all index values
        for (let i = 0; i < this.length; i++) {
            // stored value is not undefined
            if (!!this[i][field])
                // Then append value to returned array
                arr.push(this[i][field]);
        }
        // Return resultant RecordArray
        return arr;
    }
    // @ts-ignore TBD
    create(data, options = {}) {
        throw Error("Function yet to be developed");
    }
    // @ts-ignore TBD
    read(data, options = {}) {
        throw Error("Function yet to be developed");
    }
    // @ts-ignore TBD
    update(data, options = {}) {
        throw Error("Function yet to be developed");
    }
    // @ts-ignore TBD
    delete(data, options = {}) {
        throw Error("Function yet to be developed");
    }
    // @ts-ignore TBD
    list(data, options = {}) {
        throw Error("Function yet to be developed");
    }
    // faulty. Comparing objects at the moment not keys or value.
    static compareRecords(record1, record2, strict) {
        // Default "strict" to true
        if (strict !== false)
            strict = true;
        // Compare Keys
        let keys1 = Object.keys(record1).sort();
        let keys2 = Object.keys(record2).sort();
        if (strict && keys1.length !== keys2.length)
            return false;
        // Compare keys
        if (!keys1.every((value, index) => value === keys2[index]))
            return false;
        // Compare values
        if (!keys1.every((key, index) => record1[key] === record2[key]))
            return false;
        return true;
    }
    // indexBy(field: string = 'id',value: any, strict: boolean = false){
    // 	return this.findBy(field, value, {returnIndex: true, strict});
    // }
    unique(field = 'id', strict = false) {
        // Compare current index with index of first occurence of record with field with that value)
        this.filter((e, i) => this.indexBy(field, e[field], { strict }) == i);
        return this;
    }
    ;
    uniqueBy(field, strict = false) {
        // Compare current index with index of first occurence of record with field with that value)
        return this.filter((record, i) => this.indexBy(field, record[field], { strict }) == i);
    }
    ;
    uniqueIDs(strict) {
        return this.unique('id', strict).listValues('id');
    }
    ;
    hasRecord(record) {
        if (!!record.id)
            return !!this.findOneByID(record.id);
        else if (!!record.tag)
            return !!this.findOneByTag(record.tag);
        else
            return false;
    }
    /**
     * Extend the RecordArray array by updating or creating based on matching ID
     */
    extend(arr) {
        arr.forEach(record => {
            if (this.hasRecord(record))
                this.update(record);
            else
                this.push(record);
        });
        return this.sortASC('id');
    }
    ;
    topID() {
        // Iterate over this recordArray and reduce all IDs to the largest.
        return this.reduce((record, topID) => topID > record.id ?
            topID :
            record.id, 0);
    }
    merge(arr) {
        arr.forEach(r => this.push(r));
        return this;
    }
    ;
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
    static compare = (RA1, RA2, options) => {
        // Assert RA1 is an Array
        if (!(RA1 instanceof Array))
            throw new TypeError("Parameter 1 must be Array or RecordArray");
        // Assert RA2 is an Array
        if (!(RA2 instanceof Array))
            throw new TypeError("Parameter 2 must be Array or RecordArray");
        // Ensure there is an options object
        if (!(options instanceof Object)) {
            // Check if boolean to become the strict option
            if (options instanceof Boolean || typeof options == 'boolean')
                // Convert options to object with boolean value as strict option.
                options = { strict: options };
            else
                // Set options to new basic parameters object
                options = {};
        }
        // Force strict option to boolean
        options.strict = !!options.strict;
        // Force identical option to boolean
        options.identical = !!options.identical;
        // Compare Lengths of unique IDs.
        if (options.strict && RA1.unique().length !== RA2.unique().length)
            return false;
        // Compare records
        if (options.identical) {
            if (!RA1.every((record, index) => RecordArray.compareRecords(record, RA2[index], options.strict)))
                return false;
        }
        else {
            if (!RA1.every(record => RecordArray.compareRecords(record, RA2.findOne("id", record.id), options.strict)))
                return false;
        }
        return true;
    };
}
exports.default = RecordArray;
