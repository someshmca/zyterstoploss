import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import {IReimbursement} from '../models/reimbursement.model';
import {IReimbursementSearch,IReimbursementReportsModel,IReimbursementUpdate} from '../models/reimbursement.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Paths} from '../admin-paths';

import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReimbursementService {

  constructor(private http: HttpClient) { }
  reimbursementSearchInit:IReimbursementSearch={
    slReimbursementId: 0,
  requestStartDate: '',
  slGrpId: '',
  requestEndDate: '',
  slCategoryReport: '',
  slFrequencyType: '',
  slReimbursementMinAmt: 0,
  slReimbursementMaxAmt: 0,
  slApprovalInd: '',
  slReimbursementSeqId: 0,
  slFundingRequestDate:'',
 

  }
  reimbursementSearchRequest=new BehaviorSubject<IReimbursementSearch>(this.reimbursementSearchInit);
  setReimbursementSearchRequest(request:IReimbursementSearch){
    
    this.reimbursementSearchRequest.next(request);
    this.reimbursementSearchRequest.asObservable();
  }
  private slReimbursementId = new BehaviorSubject<string>('');
    selectedReimbursementId = this.slReimbursementId.asObservable();
    setReimbursementId(slReimbursementId: string) {
       this.slReimbursementId.next(slReimbursementId)
     }
  resetReimbursementSearch(){
    this.setReimbursementSearchRequest(this.reimbursementSearchInit); 
  }
  getReimbursementSearch(slGrpId:string,slReimbursementId:string,slReimbursementSeqId:string,slReimbursementMinAmt:string,slReimbursementMaxAmt:string,slCategoryReport:string,slFrequencyType:string,slApprovalInd:string,requestStartDate:string,requestEndDate:string): Observable<IReimbursementReportsModel[]> {
    let params = new HttpParams();
    
    params=params.set('slGrpId',slGrpId).set('slReimbursementId',slReimbursementId).set('slReimbursementSeqId',slReimbursementSeqId).set('slReimbursementMinAmt',slReimbursementMinAmt).set('slReimbursementMaxAmt',slReimbursementMaxAmt).set('slCategoryReport',slCategoryReport).set('slFrequencyType',slFrequencyType).set('slApprovalInd', slApprovalInd).set('requestStartDate', requestStartDate).set('requestEndDate',requestEndDate);
   
    return this.http.get<IReimbursementReportsModel[]>(Paths.GetReimbursementdetail,{params}).pipe(catchError(this.handleError.bind(this)));
 }

 updateReimbursement(rid, indicator, reasonText, userId) {
 // const body = JSON.stringify(formData);
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  let updateUrl = Paths.updateReimbursement+"?reimbursementId="+rid+"&indicator="+indicator+"&reasonText="+reasonText+"&userId="+userId;
  
  return this.http.put(updateUrl,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
  
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