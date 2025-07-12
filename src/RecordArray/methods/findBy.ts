import RecordArray from "../RecordArray";
import { DEFAULT_OPTIONS, DEFAULT_RECORD } from "../RecordArray.consts";
import { RecordKey, RecordType, RecordValue } from "../RecordArray.types";

export function findBy(RA: RecordArray, field: RecordKey, value: RecordValue, options = DEFAULT_OPTIONS): any {
	// Create a RecordArray to be returned
	let arr = new RecordArray();

	options = options instanceof Object?
		Object.assign({}, DEFAULT_OPTIONS, options):
		DEFAULT_OPTIONS;

	// If no parameters then return empty RecordArray.
	if(value === undefined){
		if(options.returnIndex)
			return -1;
		else if(options.returnFirst){
			return RA.findByID(0,options) ||
				RA.findByTag('',options) ||
				(
					options.def !== undefined?
						options.def:
						DEFAULT_RECORD
				);
		}
		// If value not defined then just return the empty array
		return arr;
	}

	// Force strict option to boolean
	options.strict = !!options.strict;

	// If null or undefined value to search for then enforce strict equality
	if (value === null) options.strict = true;

	// set which result to return;
	let nth = options.nth || 1;

	// Go through all records
	for(let i=0;i<RA.length;i++){
		let record: RecordType = RA[i];

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
			String(record[field]).trim():
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
			if(!--nth || options.returnFirst){
				if(options.returnIndex) return i;
				else return record;
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

