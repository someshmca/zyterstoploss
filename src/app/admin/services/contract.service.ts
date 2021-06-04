import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {IContract, IContractIDRequest, IContractsByClient, IContractAdd, IAddContractSuccess, IContractUpdate, IUpdateContractSuccess, IActiveClient} from '../models/contracts-model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Paths} from '../admin-paths';

@Injectable({
  providedIn: 'root'
})
export class ContractService {

  constructor(private http: HttpClient) { }
 
  getAllClients(){
    return this.http.get<IActiveClient[]>(Paths.activeClients
      ).pipe(catchError(this.handleError.bind(this)));
  }
  getAllContracts(){
    return this.http.get<IContract[]>(Paths.contractAll
      ).pipe(catchError(this.handleError.bind(this)));
  }
  getContract(val): Observable<IContract[]> {
    return this.http.get<IContract[]>(Paths.contract+val).pipe(catchError(this.handleError.bind(this)));
 }
 validateContractStartDate(clientId, ContractStartDate){
   console.log(Paths.contractDateValidation+clientId+'/'+ContractStartDate);
   let cpath=Paths.contractDateValidation+clientId+'/'+ContractStartDate;
   
   return this.http.get<any>(cpath, {  responseType: 'text' as 'json' }).pipe(catchError(this.handleError.bind(this)));
 }
 getContractsByClientID(clientId){
   return this.http.get<IContractsByClient[]>(Paths.contractsByClientPath+clientId);
 }
 addContract(formData:IContractAdd ): Observable<IAddContractSuccess>{
   
  const body = JSON.stringify(formData);
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.post<IContractAdd
   >(Paths.contractAdd, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
  
  }
  
 updateContract(formData:IContractUpdate ): Observable<IUpdateContractSuccess>{
  const body = JSON.stringify(formData);
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.put<IContractUpdate
   >(Paths.contractUpdate, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
  
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
