import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {IClient, IClientIDRequest, IClientAdd, IClientAddSuccess, IClientUpdate,IParentClient, IClientUpdateSuccess, IActiveClient} from '../models/clients-model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Paths} from '../admin-paths';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  constructor(private http: HttpClient) { }
  getAllClients(){
    return this.http.get<IClient[]>(Paths.clients
      ).pipe(catchError(this.handleError.bind(this)));
  }
  getClient(val: string): Observable<IClient[]> {
    
    return this.http.get<IClient[]>(Paths.client+val).pipe(catchError(this.handleError.bind(this)));
 }

 getActiveClients(){
  return this.http.get<IActiveClient[]>(Paths.activeClients);
}

getParentClient(){
  return this.http.get<IParentClient[]>(Paths.parentClient);
}
 addClient(formData: IClientAdd) {
  
  const body = JSON.stringify(formData);
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  //
   return this.http.post(Paths.clientAdd, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
 }

 
 updateClient(formData: IClientUpdate) {
  const body = JSON.stringify(formData);
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.put<IClientUpdate>(Paths.clientUpdate, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
  
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
