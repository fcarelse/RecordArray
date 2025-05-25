import { RecordArrayOptions, RecordKey, RecordSortOrder, RecordType, RecordValue } from "./RecordArray.types";
export declare const DEFAULT_OPTIONS: RecordArrayOptions;
export declare const DEFAULT_RECORD: Record<RecordKey, RecordValue>;
/** RecordArray
 *
 * @description: An extension of Array that provides record processing related methods
 * @author Francis Carelse
 * @version 0.0.11
 */
export default class RecordArray extends Array {
    /**
     * @constructor
     * @param {Array<Record>} array (optional)
     * @param {Object} options (optional)
     */
    constructor(array?: Array<RecordType>, options?: RecordArrayOptions);
    static new(array?: Array<RecordType>, options?: RecordArrayOptions): RecordArray;
    findBy(field: RecordKey, value: RecordValue, options?: RecordArrayOptions): any;
    new(array: any): RecordArray;
    asyncEach(cb: any): Promise<void>;
    findByID(value: RecordValue, options?: RecordArrayOptions): any;
    findByTag(value: RecordValue, options?: RecordArrayOptions): any;
    findOne(key: RecordKey, value: RecordValue, options?: RecordArrayOptions): any;
    findOneByID(value: RecordValue, options?: RecordArrayOptions): any;
    findOneByTag(value: RecordValue, options?: RecordArrayOptions): any;
    indexBy(field: RecordKey, value: RecordValue, options?: RecordArrayOptions): any;
    indexByID(value: RecordValue, options?: RecordArrayOptions): any;
    indexByTag(value: RecordValue, options?: RecordArrayOptions): any;
    matchBy(key: RecordKey, values: Array<RecordValue>): RecordArray;
    sortBy(field: RecordKey, order?: RecordSortOrder): this;
    /**
     * Sort this RecordArray by a set of fields in ascending order
     * Takes an array of strings or a space separated string of fieldnames
     * @param {Array<String> | String} fields
     */
    sortASC(fields: any): this;
    /**
     * Sort this RecordArray by a set of fields in descending order
     * Takes an array of strings or a space separated string of fieldnames
     * @param {Array<String> | String} fields
     */
    sortDESC(fields: any): this;
    /**
     * Clone this RecordArray or supplied Array of reords to a new RecordArray
     * @param {Array} arr
     */
    clone(arr: any): RecordArray;
    /**
     * @returns 'Array of cloned records'
     */
    toArray(): any[];
    getName(id: any): any;
    getNameByTag(tag: any): any;
    /**
     * List all values of a specified field
     * @param field string: Key to use for searching records
     * @param options object (optional): Additional parameters for the list operation
     * options parameter can be boolean and will be used for the trim option
     */
    listValues(field?: string): RecordValue[];
    create(data: object, options?: object): void;
    read(data: object, options?: object): void;
    update(data: object, options?: object): void;
    delete(data: object, options?: object): void;
    list(data: object, options?: object): void;
    static compareRecords(record1: any, record2: any, strict: any): boolean;
    unique(field?: string, strict?: boolean): this;
    uniqueBy(field: string, strict?: boolean): any[];
    uniqueIDs(strict: any): RecordValue[];
    hasRecord(record: any): boolean;
    /**
     * Extend the RecordArray array by updating or creating based on matching ID
     */
    extend(arr: any): this;
    topID(): any;
    merge(arr: any): this;
    static compare: (RA1: RecordArray, RA2: RecordArray, options: any) => boolean;
}
