import { Injectable } from '@angular/core';



//import {Http, ResponseContentType} from '@angular/http';
import {HttpClient, HttpResponse} from '@angular/common/http';

import {Observable} from 'rxjs';
import {Paths} from '../admin-paths';
import { request } from 'http';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor(private http: HttpClient) { }


//   download() {
//     const options = new RequestOptions({
//         responseType: ResponseContentType.Blob
//     });

//     return this.http.get(Paths.ExcelExportPath, options);
// }

downloadEmptyFile():any{	 	
  return this.http.post(Paths.ExcelEmptyExportPath,{},{responseType: 'blob'});
 }




  downloadFile():any{	 	
		return this.http.post(Paths.ExcelExportPath,{},{responseType: 'blob'});
   }
}

