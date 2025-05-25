export type RecordArrayOptions = {
    data?: object;
    returnIndex?: boolean;
    returnFirst?: boolean;
    def?: any;
    strict?: boolean;
    nth?: number;
    trim?: boolean;
};
export type RecordKey = string;
export type RecordValue = string | number | object | null;
export type RecordType = Record<RecordKey, RecordValue>;
export type ArrayOfRecords = Array<RecordType>;
export type RecordSortOrder = 'ASC' | 'DESC';
