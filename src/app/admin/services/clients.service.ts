import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {IClient, IClientIDRequest, IClientAdd, IClientAddSuccess, IClientUpdate,IParentClient, IClientUpdateSuccess, IActiveClient, IAccountAudit} from '../models/clients-model';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Paths} from '../admin-paths';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  constructor(private http: HttpClient) { }
  
  clientIdValue=new BehaviorSubject<any>('');
  passClientId(id: string){
    this.clientIdValue.next(id);  
    this.clientIdValue.asObservable();
  }
  clientAddStatus = new BehaviorSubject<boolean>(false);
  setClientAddStatus(status: boolean){
    this.clientAddStatus.next(status);  
    this.clientAddStatus.asObservable();  
  }
  clientUpdateStatus = new BehaviorSubject<boolean>(false);
  setClientUpdateStatus(stat: boolean){
    this.clientUpdateStatus.next(stat);  
    this.clientUpdateStatus.asObservable();    
  }

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

// checkDuplicateAccountId(accId: string){
  
//   return this.http.get(Paths.duplicateClientId+accId).pipe(catchError(this.handleError.bind(this)));
// }
getClientDetails(clientId: string){
  return this.http.get(Paths.getClientDetails+clientId).pipe(catchError(this.handleError.bind(this)));
}
// checkDuplicateAccountName(name: string){
//   return this.http.get(Paths.duplicateClientName+name).pipe(catchError(this.handleError.bind(this)));
// }
checkDuplicateAccount(clientId: string, subAccountId:string, subSubAccountId:string){
  
  return this.http.get(Paths.duplicateAccount+"clientId="+clientId+"&subAccountId="+subAccountId+"&subSubAccountId="+subSubAccountId).pipe(catchError(this.handleError.bind(this)));
}
getParentClient(){
  return this.http.get<IParentClient[]>(Paths.parentClient);
}
getAccountAudits(clientId: string){
  console.log(Paths.accountAudits+clientId);
  return this.http.get<IAccountAudit[]>(Paths.accountAudits+clientId);
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
