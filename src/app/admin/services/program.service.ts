import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { IProgram, IProgramIDRequest,
  IProgramAdd, IAddProgramSuccess,
  IProgramUpdate, IUpdateProgramSuccess } from '../models/programs-model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import {Paths} from '../admin-paths';

@Injectable({
  providedIn: 'root'
})
export class ProgramService {

  constructor(private http: HttpClient) { }
 

  getAllPrograms(){
    return this.http.get<IProgram[]>(Paths.programs).pipe(catchError(this.handleError.bind(this)));
  }
  getProgram(val) {
    return this.http.get<IProgram[]>(Paths.program+'/'+val).pipe(catchError(this.handleError.bind(this)));
 }

 addProgram(formData:IProgramAdd ): Observable<IAddProgramSuccess>{
  const body = JSON.stringify(formData);
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.post<IProgramAdd
   >(Paths.programAdd, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
  
  }
  
 updateProgram(formData:IProgramUpdate ): Observable<IUpdateProgramSuccess>{
  const body = JSON.stringify(formData);
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.put<IProgramUpdate
   >(Paths.programUpdate, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
  
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
