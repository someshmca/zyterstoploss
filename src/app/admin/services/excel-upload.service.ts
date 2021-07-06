import { Injectable } from '@angular/core';  
import { HttpHeaders } from '@angular/common/http';  
import { HttpClient } from '@angular/common/http'  
import {Paths} from '../admin-paths';
import { Observable } from 'rxjs';  
import { LoginService } from 'src/app/shared/services/login.service';
 
@Injectable({
  providedIn: 'root'
})
export class ExcelUploadService {

  constructor(private http: HttpClient, private loginService: LoginService) { }

  UploadExcel(formData: FormData) {  
    let headers = new HttpHeaders();  
  
    headers.append('Content-Type', 'multipart/form-data');  
    headers.append('Accept', 'application/json');  
  
    const httpOptions = { headers: headers };  

    return this.http.post(Paths.ExcelUploadPath+this.loginService.currentUserValue.name, formData, httpOptions)  
  }  
}
