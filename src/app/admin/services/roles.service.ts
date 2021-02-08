import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { 
  IRole, 
  IRoleNameRequest, 
  IAddRole, 
  IAddRoleSuccess,
  IUpdateRole, 
  IUpdateRoleSuccess
} from '../models/roles-modal';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Paths} from '../admin-paths';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private http: HttpClient) { }
  getAllRoles(){
    return this.http.get<IRole[]>(Paths.roles).pipe(catchError(this.handleError.bind(this)));
  }
  getRole(roleName: string): Observable<IRole[]> {
    //const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<IRole[]>(Paths.role+roleName).pipe(catchError(this.handleError.bind(this)));
 }

 addRole(formData:IAddRole ): Observable<IAddRoleSuccess>{
  const body = JSON.stringify(formData);
  
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.post<IAddRole
   >(Paths.roleAdd, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
  }
  updateRole(formData:IUpdateRole ){
    const body = JSON.stringify(formData);
    
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
     return this.http.put<IUpdateRole
     >(Paths.roleUpdate, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
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
