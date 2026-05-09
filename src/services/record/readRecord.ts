import { Record } from '../../models/records/recordSchema.js';
import type { RecordFilter } from '../../models/records/types/recordFilter.js';

export async function readRecord(filter: RecordFilter) {
    try {
        const data = await Record.find(filter);
        return data;
    } catch (error) {
        throw error;
    }
}