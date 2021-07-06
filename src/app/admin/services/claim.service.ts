import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {IClaimReportsModel} from '../models/claim-reports.model';
import {IClaim} from '../models/claim-model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Paths} from '../admin-paths';

import { BehaviorSubject } from 'rxjs';
import { IClaimSearch } from '../models/claim-search.model';
@Injectable({
  providedIn: 'root'
})
export class ClaimService {
  constructor(private http: HttpClient) {

  }
  claimSearchInit:IClaimSearch={
    claimId:'',
    memberId:'',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    fromDate: '',
    toDate: ''
  }
  claimSearchRequest=new BehaviorSubject<IClaimSearch>(this.claimSearchInit);
  setClaimSearchRequest(request:IClaimSearch){
    this.claimSearchRequest.next(request);
    this.claimSearchRequest.asObservable();
  }
  resetClaimSearch(){
    this.setClaimSearchRequest(this.claimSearchInit);
  }
  isClaimResult= new BehaviorSubject<boolean>(false);
  setIsClaimResult(clres:boolean){
    this.isClaimResult.next(clres);
    this.isClaimResult.asObservable();
  }

   private claimID = new BehaviorSubject<string>('');
    selectedClaimID = this.claimID.asObservable();
    setClaimId(claimID: string) {
       this.claimID.next(claimID)
     }

  getClaim(claimid: string): Observable<IClaim> {
    //const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<IClaim>(Paths.claimPath+'/'+claimid).pipe(catchError(this.handleError.bind(this)));
 }
 calculateClaimAmount(MemberID) {
  //const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  console.log(Paths.claimCalculate+MemberID);
  
  return this.http.get(Paths.claimCalculate+MemberID);
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
