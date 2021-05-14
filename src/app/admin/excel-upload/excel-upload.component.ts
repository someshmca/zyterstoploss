import { Component, OnInit, ViewChild } from '@angular/core';  
import { HttpClient, HttpHeaders } from '@angular/common/http';  
import { Observable } from 'rxjs'; 
import {Paths} from '../admin-paths';
import { ExcelUploadService } from '../services/excel-upload.service';  
import { LoginService } from 'src/app/shared/services/login.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-excel-upload',
  templateUrl: './excel-upload.component.html',
  styleUrls: ['./excel-upload.component.css']
})
export class ExcelUploadComponent implements OnInit {
  @ViewChild('fileInput') fileInput;  
  message: string;  
  userId:string;
  constructor(private http: HttpClient, private service: ExcelUploadService,private loginService: LoginService
    ) { }

  ngOnInit(): void {
  }

  uploadFile() { 
    let formData = new FormData();  
    formData.append('upload', this.fileInput.nativeElement.files[0])  
  this.userId=this.loginService.currentUserValue.name
    //  this.service.UploadExcel(formData).subscribe(result => {  
    //   this.message=result;
    // });   
    
    this.service.UploadExcel(formData)
    .pipe(first())
    .subscribe({
        next: (result) => {
          this.message='';
          for(let i in result){
            this.message+="- "+result[i]+'\n';
          }          
            // this.alertService.success('Member updated', { 
            //   keepAfterRouteChange: true });
           // this.router.navigate(['../../'], { relativeTo: this.route });                    
        },
        error: error => {
           console.log("error in excel upload");
           
        }
    });
  
  } 

}
