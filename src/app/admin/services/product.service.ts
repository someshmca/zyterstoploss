import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import {IProductAll,IProductAdd,IProductUpdate,IActiveClient,IProduct,IAddProductSuccess,IcoveredClaims} from '../models/product-model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Paths} from '../admin-paths';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  getAllProducts(){
    return this.http.get<IProductAll[]>(Paths.productAll
      ).pipe(catchError(this.handleError.bind(this)));
  }

  getAllClients(){
    return this.http.get<IActiveClient[]>(Paths.activeClients
      ).pipe(catchError(this.handleError.bind(this)));
  }

  getProduct(productId): Observable<IProduct[]> {
    
    return this.http.get<IProduct[]>(Paths.product+productId).pipe(catchError(this.handleError.bind(this)));
 }
 addProduct(formData:IProductAdd ): Observable<IProductAdd>{
 const body = JSON.stringify(formData);
 
 const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json', 'No-Auth': 'True' });
  return this.http.post<IProductAdd
  >(Paths.productAdd, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
 
 }

 updateProduct(formData:IProductUpdate ): Observable<IProductAdd>{
 
 const body = JSON.stringify(formData);
 
 const headerOptions = new HttpHeaders({ 'Content-Type': 'application/json' });
  return this.http.post<IProductUpdate>(Paths.productUpdate, body,{headers: headerOptions} ).pipe(catchError(this.handleError.bind(this)));
 
 }
 getCoveredClaims(){
  return this.http.get<IcoveredClaims[]>(Paths.productCovertClaims
    ).pipe(catchError(this.handleError.bind(this)));
}
  handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      console.error('Client Side Error :', errorResponse.error.message);
    } else {
      console.error('Server Side Error :', errorResponse);
    }
}
}
