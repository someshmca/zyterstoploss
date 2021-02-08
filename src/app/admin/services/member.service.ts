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
  memberSearch(memId: string, fname: string, lname: string, dob: string): Observable<IMemberSearchResponse[]> {
    let params = new HttpParams();
    params=params.set('MemberId',memId).set('Fname',fname).set('Lname',lname).set('DateOfBirth',dob);
    console.log(params.toString());
    return this.http.get<IMemberSearchResponse[]>(Paths.memberSearch,{params}).pipe(catchError(this.handleError.bind(this)));
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
