import { Time } from '@angular/common';

export interface IBatchDetails{     
    batchProcessId: number;
    batchProcess: number;
    description:string;
    status:string;
    lastRun:Date;
    lastRunStatus:Date;
    NextScheduleRun:Date;
    frequency:string

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
    //batchProcessId: 0;
    batchProcess: string;
    description: string;
    status: string;
    //lastRun: Date;
    //lastRunStatus: string;
    nextScheduleRun: Date;
    frequency: string;
    createId: string;
    createDate: Date;
    // updateId: string;
    // lastUpdateDate: Date;
}

export interface IBatchPAddSuccess{
    id: number;
    message: string;
}

export interface IBatchPUpdate{
    batchProcessId: number;
    batchProcess: string;
    description: string;
    status: string;
    //lastRun: Date;
    //lastRunStatus: string;
    nextScheduleRun: Date;
    frequency: string;
    createId: string;
    createDate: Date;
    updateId: string;
   lastUpdateDate: Date;
 
    // updateId: string;
    // lastUpdateDate: Date;
}

export interface IBatchPUpdateSuccess{
    id: number;
    message: string;
}
