import RecordArray from "../RecordArray";
import { RecordKey, RecordSortOrder } from "../RecordArray.types";

export function sortBy(RA: RecordArray, field: RecordKey, order: RecordSortOrder = 'ASC') {
	// Assert field parameter is a string.
	if (typeof field !== "string")
		throw new TypeError("String expected for first parameter.");
	// Assert order parameter is ASC or DESC
	if (
		!['ASC','DESC'].includes(order)
	)
		throw new TypeError(
			"'ASC' or 'DESC' expected for second parameter."
		);
	// Return sorted using appropriate function
	return RA.sort(order.toUpperCase() == 'ASC' ? sortFnASC : sortFnDESC);
	// Sorting Ascending Strategy
	function sortFnASC(a: any, b: any) {
		return a[field] == b[field]? 
		0: ( a[field] > b[field]? 1: -1 );
	}
	// Sorting Descending Strategy (just reverse the testing parameters)
	function sortFnDESC(a: any, b: any) {
		return sortFnASC(b, a);
	}
}

/**
 * Sort this RecordArray by a set of fields in ascending order
 * Takes an array of strings or a space separated string of fieldnames
 * @param {Array<String> | String} fields
 */
export function sortASC(RA: RecordArray, fields: Array<string> | string) {
	// If fields parameter is not already an Array
	if (!(fields instanceof Array))
		// Ensure is string and split space separated fieldnames
		fields = String(fields).toString().split(" ");
	// Throw out any non string fields
	fields = fields.filter(f => typeof f === "string");
	// If no fields left then abort
	if (!fields.length)
		throw new TypeError(
			'Parameter "fields" needs to be an array of strings or space separated list of field names'
		);
	// Return sort using item pair evaluation strategy
	return RA.sort(function(a, b) {
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
export function sortDESC(RA: RecordArray, fields: Array<string> | string) {
	// If fields parameter is not already an Array
	if (!(fields instanceof Array))
		// Ensure is string and split space separated fieldnames
		fields = String(fields).toString().split(" ");
	// Throw out any non string fields
	fields = fields.filter(f => typeof f === "string");
	// If no fields left then abort
	if (!fields.length)
		throw new TypeError(
			'Parameter "fields" needs to be an array of strings or space separated list of field names'
		);
	// Return sort using item pair evaluation strategy
	return RA.sort(function(a, b) {
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

