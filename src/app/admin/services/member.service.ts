import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import {IMemberSearch, IMemberSearchResponse, IMemberAdd, IMemberUpdate} from '../models/member-model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import {Paths} from '../admin-paths';
@Injectable({
  providedIn: 'root'
})
export class MemberService {

  constructor(private http: HttpClient) { }

  
  memberSearch(memId: string, fname: string, mname: string, lname: string, subscriberId: string, dob: string,gender: string,memberStartDate:string,memberEndDate: string,benefitPlanId: string ,clientId:string,tier:string,alternateId:string): Observable<IMemberSearchResponse[]> { // (VE 30-Jul-2021)
    let params = new HttpParams();
    params=params.set('MemberId',memId).set('Fname',fname).set('Mname',mname).set('Lname',lname).set('SubscriberId',subscriberId).set('DateOfBirth',dob).set('Gender',gender).set('MemberStartDate', memberStartDate).set('MemberEndDate', memberEndDate).set('benefitPlanId',benefitPlanId).set('clientId',clientId).set('tier',tier).set('alternateId',alternateId); // (VE 30-Jul-2021
    console.log(params.toString());
    return this.http.get<IMemberSearchResponse[]>(Paths.memberSearch,{params}).pipe(catchError(this.handleError.bind(this)));
 }
 addMember(formData) {
  
  const body = JSON.stringify(formData);
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  
   return this.http.post(Paths.memberAdd, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
 }
getMember(clientId){
  return this.http.get(Paths.member+clientId).pipe(catchError(this.handleError.bind(this)));
}
 
 updateMember(formData: IMemberUpdate) {
  const body = JSON.stringify(formData);
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.put(Paths.memberUpdate, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
  
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
