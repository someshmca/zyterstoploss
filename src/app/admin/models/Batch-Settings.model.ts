import { Time } from '@angular/common';

export interface IBatchDetails{     
    batchProcessId: number;
    batchProcess: number;
    description:string;
    status:string;
    batchStatusId: number;
    lastRun:Date;
    lastRunStatus:Date;
    nextScheduleRun:Date;
    frequency:string;
    createId: string;
    createDate: string;
    updateId: string;
    lastUpdateDate: string;
    batchType:string;
}
export interface IAllBatchIDs{     
    batchId: string;
    description:string;
    startTime:string;
    effectiveDate:Date;
    terminationDate:Date;
    frequency:string;
    day:string
    
}

export interface IBatchStatus{     
    batchStatusId:number;
    batchStatus:string
}

export interface IBatchHistoryDetails{     
    batchHistoryId: number;
    started: Date;
    completed:Date;
    scheduled:string;
    failed:string;
    failedReason:string;
    batchProcessId: number;
}

export interface IBatchPAdd{
    batchProcessId: number;
    batchProcess: string;
    description: string;
    status: string;
    batchStatusId: number;
    lastRun: string;
    lastRunStatus: string;
    nextScheduleRun: string;
    frequency: string;
    createId: string;
    createDate: string;
    updateId: string;
    lastUpdateDate: string;
    batchType:string;
}

export interface IBatchPAddSuccess{
    id: number;
    message: string;
}

export interface IBatchPUpdate{
    batchProcessId: number;
    batchProcess: string;
    description: string;
    batchStatusId: number;
    lastRun: string;
    lastRunStatus: string;
    nextScheduleRun: string;
    frequency: string;
    createId: string;
    createdOn: string;
    updateId: string;
    lastUpdateDate: string;
 batchType:string;
    // updateId: string;
    // lastUpdateDate: Date;
}

export interface IBatchPUpdateSuccess{
    id: number;
    message: string;
}
