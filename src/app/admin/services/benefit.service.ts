import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {IBenefit, IBenefitIDRequest, IBenefitAdd, IAddBenefitSuccess, IBenefitUpdate, IUpdateBenefitSuccess} from '../models/benefits-model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import {Paths} from '../admin-paths';

@Injectable({
  providedIn: 'root'
})
export class BenefitService {

  constructor(private http: HttpClient) { }


  getAllBenefits(){
    return this.http.get<IBenefit[]>(Paths.benefits).pipe(catchError(this.handleError.bind(this)));
  }
  getBenefit(benefitId): Observable<IBenefit[]> {
    return this.http.get<IBenefit[]>(Paths.benefit+'/'+benefitId).pipe(catchError(this.handleError.bind(this)));
 }
 addBenefit(formData:IBenefitAdd ): Observable<IAddBenefitSuccess>{
  const body = JSON.stringify(formData);
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.post<IBenefitAdd
   >(Paths.benefitAdd, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
  
  }
  
 updateBenefit(formData:IBenefitUpdate ): Observable<IUpdateBenefitSuccess>{
  const body = JSON.stringify(formData);
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.put<IBenefitUpdate
   >(Paths.benefitUpdate, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
  
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
