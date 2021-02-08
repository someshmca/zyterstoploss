import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {IClaimReportsModel} from '../models/claim-reports.model';
import {IClaimSearch} from '../models/claim-search.model';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Paths} from '../admin-paths';

@Injectable({
  providedIn: 'root'
})
export class ClaimReportService {
  requestClaimSearch: IClaimSearch;
  responseClaimReport: any;

  private claimResults = new BehaviorSubject<any>(false);
  claimResultsVal = this.claimResults.asObservable();
  setClaimResults(claimResults: IClaimReportsModel[]) {
    this.claimResults.next(claimResults)
  }

  claimReportGrid: Array<IClaimReportsModel> = [    
  ];
 


  constructor(private http: HttpClient) {

   }
   getClaimReport(formData: IClaimSearch): Observable<IClaimReportsModel[]> {
    const body = JSON.stringify(formData);
    const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<IClaimReportsModel[]>(Paths.reportPath, body, {
           headers: headerOptions
    }).pipe(catchError(this.handleError.bind(this)));
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
