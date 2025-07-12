

import RecordArray from "../RecordArray";

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
export function compare(RA1: RecordArray, RA2: RecordArray, options?: any) {
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
	if (options.strict && RA1.unique().length !== RA2.unique().length) return false;

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