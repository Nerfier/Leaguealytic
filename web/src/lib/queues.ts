import {
    QUEUES as queueGroups,
    getQueueLabel as getLabel,
    getQueueRange as getRange
} from "../../../src/db/queues.ts";

export const QUEUES = queueGroups;
export const getQueueLabel = getLabel;
export const getQueueRange = getRange;