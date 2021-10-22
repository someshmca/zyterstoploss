import { Component, OnInit, ViewChild } from '@angular/core';  
import { HttpClient, HttpHeaders } from '@angular/common/http';  
import { Observable } from 'rxjs'; 
import {Paths} from '../admin-paths';
import { ExcelUploadService } from '../services/excel-upload.service';  
import { ExcelExportService } from '../services/excel-export.service';  
import { LoginService } from '../../shared/services/login.service';
import { LoaderService } from '../services/loader.service';
import { first } from 'rxjs/operators';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx'
import { Workbook } from 'exceljs'; 
import * as fs from 'file-saver';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-excel-uplaod',
  templateUrl: './excel-uplaod.component.html',
  styleUrls: ['./excel-upload.component.css']
})
export class ExcelUploadComponent implements OnInit {
 @ViewChild('fileInput') fileInput;  
  message: any;  
  userId:string;
  button = 'Upload';
  isLoading = false;
  isExcelFile: boolean;
  downloads: boolean= false;
  constructor(private http: HttpClient, private service: ExcelUploadService,private loginService: LoginService
    ,private exportService:ExcelExportService, private loaderService: LoaderService) { }

  ngOnInit(): void {
  }

  resetFileUploader() { 
    this.fileInput.nativeElement.value = null;
    this.message=null;
    this.message='';
   
  }
  onChange(evt) {
    let data, header;
    
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.isExcelFile = !!target.files[0].name.match(/(.xls|.xlsx)/);
    if(this.isExcelFile==false)
    {
      this.message="Invalid file. Import Xls Or Xlsx file only";
    }
    if (target.files.length > 1) {
      this.fileInput.nativeElement.value = '';
    }
  }
  uploadFile() { 
    this.downloads=false;
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
      // this.message=result;
      // this.message=this.message.split(',');
      this.message='';
      for(let i in result){
        this.message+="- "+result[i]+'\n';
      }          
      if(result){        
      this.isLoading = false;
      this.button = 'Upload';   
      }
    });   
    }, 10000) 
      
  
  } 
  


  downloadEmpty() {
    this.downloads = true;
    
    this.exportService.downloadEmptyFile().subscribe((response) => { 
			let blob:any = new Blob([response], {type:EXCEL_TYPE});
      fs.saveAs(blob, 'Export_Contract_Details_Template_' + new Date().getTime() + EXCEL_EXTENSION);

     //const file = new File([blob], 'Export' + '.xlsx', { type: 'application/vnd.ms.excel' });
     //saveAs(file);
			
			//window.open(url); 
			//window.location.href = response.url;
		
		}), error => console.log('Error downloading the file'),
                 () => console.info('File downloaded successfully');
  }


  download() {
    this.downloads = true;
    this.exportService.downloadFile().subscribe((response) => { 
			let blob:any = new Blob([response], {type:EXCEL_TYPE});
      fs.saveAs(blob, 'Export_Contract_Details_' + new Date().getTime() + EXCEL_EXTENSION);

     //const file = new File([blob], 'Export' + '.xlsx', { type: 'application/vnd.ms.excel' });
     //saveAs(file);
			
			//window.open(url); 
			//window.location.href = response.url;
		
		}), error => console.log('Error downloading the file'),
                 () => console.info('File downloaded successfully');
  }


}  