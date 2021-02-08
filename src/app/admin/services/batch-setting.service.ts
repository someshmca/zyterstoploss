import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import {IBatchDetails, IAllBatchIDs,IBatchStatus, IBatchHistoryDetails, IBatchPAdd, IBatchPAddSuccess, IBatchPUpdate, IBatchPUpdateSuccess} from '../models/Batch-Settings.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import {Paths} from '../admin-paths';
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class BatchSettingService {

  constructor(private http: HttpClient) { }
  getBatchStatusList(){    
    return this.http.get<IBatchStatus[]>(Paths.BatchStatusPath).pipe(catchError(this.handleError.bind(this)));
  }

getBatchProcessDetails(status: string): Observable<IBatchDetails[]> {
  
    //const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<IBatchDetails[]>(Paths.BatchProcessPath+status).pipe(catchError(this.handleError.bind(this)));
 }

 getBatchHistoryProcessDetails(no:number): Observable<IBatchHistoryDetails[]> {
  
    //const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<IBatchHistoryDetails[]>(Paths.BatchHistoryPath+no).pipe(catchError(this.handleError.bind(this)));
 }

 addBatchProcess(formData:IBatchPAdd ): Observable<IBatchPAddSuccess>{
  const body = JSON.stringify(formData);
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.post<IBatchPAdd
   >(Paths.BatchProcessAdd, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
  
  }
  updateBatchProcess(formData:IBatchPUpdate ): Observable<IBatchPUpdateSuccess>{
    const body = JSON.stringify(formData);
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
     return this.http.put<IBatchPUpdate
     >(Paths.BatchProcessUpdate, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
    
    }
    calculateOnStart(batchid:any,userid:string,startDate:any,lastRunTime:any,frequency:string,nextScheduleRun:any){ 
      let params = new HttpParams();
      params=params.set('batchId',batchid).set('userId',userid).set('startDate',startDate).set('lastRunTime',lastRunTime).set('frequency',frequency).set('nextScheduleRun',nextScheduleRun);
      console.log(params.toString());
   
      return this.http.get(Paths.BatchProcessCalculate,{params}).pipe(catchError(this.handleError.bind(this)));
      debugger;
    }
 handleError(errorResponse: HttpErrorResponse) {
  if (errorResponse.error instanceof ErrorEvent) {
    console.error('Client Side Error :', errorResponse.error.message);
  } else {
    console.error('Server Side Error :', errorResponse);
  }

// return an observable with a meaningful error message to the end user
return throwError('There is a problem with the service.We are notified &   working on it.Please try again later.');
}
}
