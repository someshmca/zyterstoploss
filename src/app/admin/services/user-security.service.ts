import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {IAllUserIDs, IUserDetails,IUserAdd, IUserAddResponse, IUserUpdate, IUserUpdateResponse} from '../models/user-security.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import {Paths} from '../admin-paths';
import { stringify } from '@angular/compiler/src/util';


@Injectable({
  providedIn: 'root'
})
export class UserSecurityService {

  constructor(private http: HttpClient) { }
  getAllUserList(){
    
    return this.http.get<IAllUserIDs[]>(Paths.UsersPath).pipe(catchError(this.handleError.bind(this)));
  }
  getUserDetails(userId: string): Observable<IUserDetails[]> {
    //const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<IUserDetails[]>(Paths.UserDetailPath+userId).pipe(catchError(this.handleError.bind(this)));
 }
 addUser(formData: IUserAdd): Observable<IUserAddResponse>{
  const body = JSON.stringify(formData);
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.post<IUserAdd>(Paths.userAdd, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
 }
 updateUser(formData: IUserUpdate): Observable<IUserUpdateResponse>{
  const body = JSON.stringify(formData);  
  
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });  
   return this.http.put<IUserUpdate>(Paths.userTerminate, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
 }
 checkDuplicateUser(userName: string){
   console.log(Paths.userDuplicate+userName);
   return this.http.get(Paths.userDuplicate+userName).pipe(catchError(this.handleError.bind(this)));
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