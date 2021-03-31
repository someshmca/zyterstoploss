import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {IPlanTires, IPlanAll, IPlanAdd, IPlanUpdate, IActiveClient, IContracts} from '../models/health-plan.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import {Paths} from '../admin-paths';

@Injectable({
  providedIn: 'root'
})
export class HealthPlanService {

  constructor(private http: HttpClient) { }


  getAllPlans(){
    return this.http.get<IPlanAll[]>(Paths.planAll).pipe(catchError(this.handleError.bind(this)));
  }
  getPlanTires(): Observable<IPlanTires[]> {
    return this.http.get<IPlanTires[]>(Paths.planTires).pipe(catchError(this.handleError.bind(this)));
 }
 getActiveClients(): Observable<IActiveClient[]>{
   return this.http.get<IActiveClient[]>(Paths.activeClients);
 }

 getClientByContract(clientId:string): Observable<IContracts[]>{
  
  return this.http.get<IContracts[]>(Paths.contracts+clientId);
}
 addPlan(formData:IPlanAdd ){
   debugger;
  const body = JSON.stringify(formData);
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.post<IPlanAdd
   >(Paths.planAdd, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));  
  }
  
 updatePlan(formData:IPlanUpdate ){
   debugger;
  const body = JSON.stringify(formData);
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.put<IPlanUpdate
   >(Paths.planUpdate, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
  
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
