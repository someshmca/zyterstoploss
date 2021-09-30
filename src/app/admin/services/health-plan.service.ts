import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {ITire, IPlanAll, IPlanAdd, IPlanUpdate, IActiveClient, IContracts} from '../models/health-plan.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import {Paths} from '../admin-paths';

@Injectable({
  providedIn: 'root'
})
export class HealthPlanService {

  constructor(private http: HttpClient) { }


  planAddStatus = new BehaviorSubject<boolean>(false);
  setPlanAddStatus(status: boolean){
    this.planAddStatus.next(status);  
    this.planAddStatus.asObservable();  
  }
  planUpdateStatus = new BehaviorSubject<boolean>(false);
  setPlanUpdateStatus(stat: boolean){
    this.planUpdateStatus.next(stat);  
    this.planUpdateStatus.asObservable();    
  }

  getAllPlans(){
    return this.http.get<IPlanAll[]>(Paths.planAll).pipe(catchError(this.handleError.bind(this)));
  }
  getTires(): Observable<ITire[]> {
    return this.http.get<ITire[]>(Paths.planTires).pipe(catchError(this.handleError.bind(this)));
 }
 getActiveClients(): Observable<IActiveClient[]>{
   return this.http.get<IActiveClient[]>(Paths.activeClients);
 }

 getContractsByClient(clientId:string): Observable<IContracts[]>{
  
  return this.http.get<IContracts[]>(Paths.contracts+clientId);
}
 addPlan(formData:IPlanAdd){
   
  const body = JSON.stringify(formData);
  console.log(body);
  
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.post<IPlanAdd>(Paths.planAdd, body,{headers: headerOptions}).pipe(catchError(this.handleError.bind(this)));  
  }
  
 updatePlan(formData:IPlanUpdate ){
   
  const body = JSON.stringify(formData);
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.put<IPlanUpdate
   >(Paths.planUpdate, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
  
  }
  //(V.E 27-Jul-2021 starts)
  checkDuplicatePlanId(PId: string){
  
    return this.http.get(Paths.duplicatePlanId+PId).pipe(catchError(this.handleError.bind(this)));
  }
  checkDuplicatePlan(planCode: string, contractId: number, clientId: string){
    return this.http.get(Paths.duplicatePlan+"planCode="+planCode+"&contractId="+contractId+"&clientId="+clientId).pipe(catchError(this.handleError.bind(this)));
  }
  checkDuplicatePlanName(PName: string){
  
    return this.http.get(Paths.duplicatePlanName+PName).pipe(catchError(this.handleError.bind(this)));
  }
  //(V.E 27-Jul-2021 Ends )
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
