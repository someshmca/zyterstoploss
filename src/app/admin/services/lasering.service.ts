import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import {IMemberSearch, IMemberSearchResponse, IMemberAdd, IMemberUpdate, IMemberAudit} from '../models/member-model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import {Paths} from '../admin-paths';

@Injectable({
  providedIn: 'root'
})
export class LaseringService {

  constructor(private http: HttpClient) { }
  getAllMembers(){
    
    return this.http.get(Paths.memberAll).pipe(catchError(this.handleError.bind(this)));
  }
  getMember(clientId){
    return this.http.get(Paths.member+clientId).pipe(catchError(this.handleError.bind(this)));
  }
  getMemberAudits(memberId: number){
    console.log(Paths.memberAudits+memberId);
    return this.http.get<IMemberAudit[]>(Paths.memberAudits+memberId);
  }
  addMember(formData) {  
    const body = JSON.stringify(formData);
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });    
     return this.http.post(Paths.memberAdd, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
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
