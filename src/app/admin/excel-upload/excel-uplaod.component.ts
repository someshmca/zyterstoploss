import { Component, OnInit, ViewChild } from '@angular/core';  
import { HttpClient, HttpHeaders } from '@angular/common/http';  
import { Observable } from 'rxjs'; 
import {Paths} from '../admin-paths';
import { ExcelUploadService } from '../services/excel-upload.service';  
import { LoginService } from 'src/app/shared/services/login.service';



@Component({
  selector: 'app-excel-uplaod',
  templateUrl: './excel-uplaod.component.html',
  styleUrls: ['./excel-uplaod.component.css']
})
export class ExcelUplaodComponent implements OnInit {
  @ViewChild('fileInput') fileInput;  
  message: any;  
  userId:string;
  button = 'Upload';
  isLoading = false;
  isExcelFile: boolean;
  constructor(private http: HttpClient, private service: ExcelUploadService,private loginService: LoginService
    ) { }

  ngOnInit(): void {
  }
  resetFileUploader() { 
    this.fileInput.nativeElement.value = null;
    this.message=null;
   
  }
  onChange(evt) {
    let data, header;
    debugger;
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if(this.isExcelFile==false)
    {
      this.message=" This is not an Excel file";
    }
    if (target.files.length > 1) {
      this.fileInput.nativeElement.value = '';
    }
  }
  uploadFile() { 
debugger;
    if(this.fileInput.nativeElement.value=="")
      {
        this.message="No file uploaded";
        return;
      }
    this.isLoading = true;
    this.button = 'Processing';

    setTimeout(() => {
      let formData = new FormData();  
    formData.append('upload', this.fileInput.nativeElement.files[0])  
  this.userId=this.loginService.currentUserValue.name
     this.service.UploadExcel(formData).subscribe(result => {  
      this.message=result;
      this.message=this.message.split(',');
    }); 
      this.isLoading = false;
      this.button = 'Upload';     
    }, 10000) 
      
  
  } 
}  