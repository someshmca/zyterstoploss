import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {IAttribute, IAttributeIDRequest, IAttributeAdd, IAddAttributeSuccess, IAttributeUpdate, IUpdateAttributeSuccess, IAttributeGroup} from '../models/attributes-model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Paths} from '../admin-paths';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {

  constructor(private http: HttpClient) { }
 
  getAllAttributes(){
    return this.http.get<IAttribute[]>(Paths.attributes
      ).pipe(catchError(this.handleError.bind(this)));
  }
  getAttribute(val: string): Observable<IAttribute[]> {
    
    return this.http.get<IAttribute[]>(Paths.attribute+val).pipe(catchError(this.handleError.bind(this)));
 }
 getAttributeGroups(){
   return this.http.get<IAttributeGroup[]>(Paths.attributeGroup);
 }
 addAttribute(formData:IAttributeAdd ): Observable<IAddAttributeSuccess>{
  const body = JSON.stringify(formData);
  
  const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
   return this.http.post<IAttributeAdd
   >(Paths.attributeAdd, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
  
  }
  updateAttribute(data:IAttributeUpdate): Observable<IUpdateAttributeSuccess>{
   const body = JSON.stringify(data);
   
   const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<IAttributeUpdate>(Paths.attributeUpdate, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
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
