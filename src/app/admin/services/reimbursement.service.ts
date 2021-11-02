import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import {IReimbursement, IReimbursementAudit} from '../models/reimbursement.model';
import {IReimbursementSearch,IReimbursementReportsModel,IReimbursementUpdate,IReimbursementAdd} from '../models/reimbursement.model';
import {IContract, IContractIDRequest, IContractsByClient, IContractAdd, IAddContractSuccess, IContractUpdate, IUpdateContractSuccess, IActiveClient, IContractAudit} from '../models/contracts-model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Paths} from '../admin-paths';

import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ReimbursementService {

  constructor(private http: HttpClient) { }
  // reimbursementSearchInit:IReimbursementSearch={
  //   slReimbursementId: 0,
  // requestStartDate: '',
  // slGrpId: '',
  // requestEndDate: '',
  // slCategoryReport: '',
  // slFrequencyType: '',
  // slReimbursementMinAmt: 0,
  // slReimbursementMaxAmt: 0,
  // slApprovalInd: '',
  // slReimbursementSeqId: 0,
  // slFundingRequestDate:'',
 

  // }
  // reimbursementSearchRequest=new BehaviorSubject<IReimbursementSearch>(this.reimbursementSearchInit);
  // setReimbursementSearchRequest(request:IReimbursementSearch){
    
  //   this.reimbursementSearchRequest.next(request);
  //   this.reimbursementSearchRequest.asObservable();
  // }
  // private slReimbursementId = new BehaviorSubject<string>('');
  //   selectedReimbursementId = this.slReimbursementId.asObservable();
  //   setReimbursementId(slReimbursementId: string) {
  //      this.slReimbursementId.next(slReimbursementId)
  //    }
  // resetReimbursementSearch(){
  //   this.setReimbursementSearchRequest(this.reimbursementSearchInit); 
  // }
  getAllClients(){
    return this.http.get<IActiveClient[]>(Paths.activeClients
      ).pipe(catchError(this.handleError.bind(this)));
  }p
  getReimbursementSearch(slGrpId:string,slReimbursementId:string,slReimbursementSeqId:string,slReimbursementMinAmt:string,slReimbursementMaxAmt:string,slCategoryReport:string,slFrequencyType:string,slApprovalInd:string,requestStartDate:string,requestEndDate:string): Observable<IReimbursementReportsModel[]> {
    let params = new HttpParams();
    
    params=params.set('clientId',slGrpId).set('SlReimbursementId',slReimbursementId).set('SlReimbursementSeqId',slReimbursementSeqId).set('SlReimbursementMinAmt',slReimbursementMinAmt).set('SlReimbursementMaxAmt',slReimbursementMaxAmt).set('SlCategoryReport',slCategoryReport).set('SlFrequencyType',slFrequencyType).set('SlApprovalInd', slApprovalInd).set('RequestStartDate', requestStartDate).set('RequestEndDate',requestEndDate);
   
    return this.http.get<IReimbursementReportsModel[]>(Paths.GetReimbursementdetail,{params}).pipe(catchError(this.handleError.bind(this)));
 }

 updateReimbursement(rid, indicator, reasonText, userId) {
 // const body = JSON.stringify(formData);
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  let updateUrl = Paths.updateReimbursement+"?reimbursementId="+rid+"&indicator="+indicator+"&reasonText="+reasonText+"&userId="+userId;
  
  return this.http.put(updateUrl,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
  
  }
  addReimbursement(formData){

    
    const body = JSON.stringify(formData);
    
    
    
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    
     return this.http.post(Paths.ReimbursementAdd, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
  
    }
    getReimbursementAudits(reimbursementId: number){
      console.log(Paths.reimbursementAudits);
      return this.http.get<IReimbursementAudit[]>(Paths.reimbursementAudits+reimbursementId);
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