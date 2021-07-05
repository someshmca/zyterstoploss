import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {IRule, IRuleIDRequest, IRuleAddRequest, IAddRuleSuccess, IUpdateRuleSuccess, IRuleUpdateRequest} from '../models/rules-model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import {Paths} from '../admin-paths';

@Injectable({
  providedIn: 'root'
})
export class RulesService {

 
  constructor(private http: HttpClient) { }
  getAllRules(){
    return this.http.get<IRule[]>(Paths.rules).pipe(catchError(this.handleError.bind(this)));
  }
  getRule(ruleID: string): Observable<IRule[]> {
    //const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.get<IRule[]>(Paths.rule+ruleID).pipe(catchError(this.handleError.bind(this)));
 }
   addRule(formData: IRuleAddRequest): Observable<IAddRuleSuccess>{
    const body = JSON.stringify(formData);
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
     return this.http.post<IRuleAddRequest
     >(Paths.ruleAdd, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
   }
   updateRule(formData: IRuleUpdateRequest): Observable<IUpdateRuleSuccess>{
     
    const body = JSON.stringify(formData);
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
     return this.http.put<IRule>(Paths.ruleUpdate, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
   }
   getRuleGroups(){
     return this.http.get<any[]>(Paths.ruleGroups);
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
