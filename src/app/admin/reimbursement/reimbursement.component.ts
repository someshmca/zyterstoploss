
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {IReimbursementReportsModel, IReimbursementSearch} from '../models/reimbursement.model';
import {ReimbursementService} from '../services/reimbursement.service';
import { Observable } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { DatePipe } from '@angular/common';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { LoginService } from 'src/app/shared/services/login.service';
import { ProductService } from '../services/product.service';
import {ExcelService} from '../services/excel.service';
import {DecimalPipe} from '@angular/common'; 
import { LoaderService } from '../services/loader.service';
import { first } from 'rxjs/operators';
@Component({
  selector: 'app-reimbursement',
  templateUrl: './reimbursement.component.html',
  styleUrls: ['./reimbursement.component.css'],
  providers: [DatePipe]

})
export class ReimbursementComponent implements OnInit {
  reimbursementSearchForm: FormGroup;
  reimbursementForm: FormGroup;
  maxDate: any;
  today: string;
  isReimbursementSearchErr: boolean = false;
  isCustomModalOpen: boolean=false;

  memMaxMinErr={isValid: false, errMsg: ''};
  dateErr = {
    fromDateErr: false,
    fromDateInvalid: false,
    toDateInvalid: false,
    dateErr: false,
    dateMsg:''
  };
  dateErrorMessage: string = '';
  isReimbursementSearchFormInvalid:boolean=false;
  reimbursemenResults: IReimbursementReportsModel[] = [];

  displayedColumns: any[] = ['slReimbursementId', 'slReimbursementSeqId','slGrpId', 'slFundingRequestDate' ,'slCategoryReport', 'slFrequencyType','slReimbursementAmt','slDwPullTs','slApprovalInd','requestEndDate'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isReimbursementResult: boolean;
  reimbursementSearchNotFound: boolean = false;
  @ViewChild("focusElem") focusTag: ElementRef;

  isAddMode: boolean = false;
  loading = false;
  reimSearchSubmitted = false;
  submitted:boolean = false;
  isViewModal: boolean=false;
  isAdmin: boolean;
  reimbursementResults:any=[];
  isDisabled: boolean=false;
 // isMinAmountInvalid: boolean=false;
  isAccountIDInvalid: boolean=false;
 // isSequenceNumInvalid: boolean=false;
 // isDiagnosisCodeInvalid: boolean=false;
 // isClaimSourceInvalid: boolean=false;
  uslReimbursementId: number = 0;
  uslApprovalInd: string = '';
  excel1; //(VE 4/8/2021 )
  //(VE 11/8/2021  starts ) 
  names=[];
  countMaxMin=0;
  pageCount;
  format = '2.2-2'; //PV 08-05-2021

  constructor(
    private fb: FormBuilder,
    public loaderService: LoaderService,
    private excelService:ExcelService,
    private _reimbursementService:ReimbursementService ,
    private _route:Router,
    private alertService: AlertService,
    private datePipe: DatePipe, public loginService: LoginService, private productService: ProductService,
    private decimalPipe: DecimalPipe
  ) { }

  ngOnInit(): void {
    this.initReimbursementSearchForm();
    this.maxDate= this.datePipe.transform(new Date('9999-12-31'),"yyyy-MM-dd");
    console.log(this.maxDate);

    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100)
    this.today=new Date().toJSON().split('T')[0];

    this.isReimbursementResult=false;
    this.loginService.getLoggedInRole();
    this.isAdmin = this.loginService.isAdmin;
    if(!this.isAdmin){
      this.isViewModal=true;
    }
      this.clearErrorMessages();
      this.initReimbursementForm();
  }
  initReimbursementSearchForm(){
    this.reimbursementSearchForm = this.fb.group({
      slReimbursementId: 0,
      slReimbursementAmt:0,
  requestStartDate:[null],
  slGrpId: [''],
  requestEndDate: [null],
  slCategoryReport: [''],
  slFrequencyType:[''],
  slReimbursementMinAmt:0 ,
  slReimbursementMaxAmt: 0,
  slApprovalInd: [''],
  slReimbursementSeqId: 0,
  slFundingRequestDate:[null],
  slReasonText:[''],
  maxPage:null,
  slDwPullTs:null
     
    },{validator: this.dateLessThan('fromDate', 'toDate')});
  }
  clearErrorMessages(){
   
    
  
  }
  dateLessThan(from: string, to: string) {
    return (group: FormGroup): {[key: string]: any} => {
      this.clearErrorMessages();
      let f = group.controls[from];
      let t = group.controls[to];
      return {};
    }
  }
  resetReimbursementSearch(){
    this.countMaxMin=0;
    this.initReimbursementSearchForm();
    this.reimbursementSearchNotFound = false;

    console.log(this.reimbursementSearchForm.value);

    //this._claimService.setIsClaimResult(false);
    this.isReimbursementResult=false;
   // this._claimService.resetClaimSearch();
    this.clearErrorMessages();
  }
  get f() { return this.reimbursementSearchForm.controls; }
  get c() { return this.reimbursementForm.controls; }

  initReimbursementForm(){

    this.reimbursementForm = this.fb.group({
      slReimbursementId: 0,
      requestStartDate:[null],
      slGrpId: [''],
      requestEndDate: [null],
      slFundingRequestDate:[null],
      slCategoryReport: [''],
      slFrequencyType:[ ''],
      slReimbursementAmt:0,
 
      slReimbursementSeqId: 0,
      slDwPullTs:null,
      slReasonText:[''],
      slApprovalInd:false
    
    });
  }
  openViewModal(bool, id:any){
    this.isViewModal = true;
    this.openCustomModal(bool, id);
  }
  openCustomModal(open: boolean, id:any) {
    this.isDisabled=false;
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100);
    this.isCustomModalOpen = open;
    this.submitted = false;
    if(open && id==null){
      this.isAddMode = true;
    }
    if (!open && id==null) {
      this.reimbursementForm.reset();
      this.isAddMode = false;
      this.isViewModal=false;
    }
    console.log("id inside modal: "+id);
  
    if(this.isAddMode && !this.isViewModal) this.reimbursementForm.enable();
    else if(!this.isAddMode && !this.isViewModal){
      this.reimbursementForm.disable();
      this.c.slApprovalInd.enable();
      this.c.slReasonText.enable();
    } 
    else{
      this.reimbursementForm.disable();
    }
    if(id!=null && open){
  
      this.isAddMode = false;
        console.log(id);
            this.uslReimbursementId= id.slReimbursementId;
            //this.uslApprovalInd = id.slApprovalInd;
            this.reimbursementForm.patchValue({
              // claimId: id.claimId,
              slGrpId:  id.slGrpId,
              // clientName: id.clientName,
              slReimbursementId: id.slReimbursementId,
             
              slReimbursementMinAmt:   this.decimalPipe.transform(id.slReimbursementMinAmt,this.format),
              slReimbursementMaxAmt:this.decimalPipe.transform(id.slReimbursementMinAmt,this.format),
              
              dateOfBirth: this.datePipe.transform(id.dateOfBirth, 'yyyy-MM-dd'),
              slFundingRequestDate:this.datePipe.transform(id.slFundingRequestDate, 'yyyy-MM-dd'),
              requestStartDate:  this.datePipe.transform(id.requestStartDate, 'yyyy-MM-dd'),
              requestEndDate:   this.datePipe.transform(id.requestEndDate, 'yyyy-MM-dd'),
              
              slReimbursementSeqId: id.slReimbursementSeqId,
              slFrequencyType:id.slFrequencyType,
              slCategoryReport:id.slCategoryReport,
              slReimbursementAmt:id.slReimbursementAmt,
              slReasonText:id.slReasonText,
              slApprovalInd:id.slApprovalInd == 'N' ?false : true,

              userId: this.loginService.currentUserValue.name
            });
  
  
          
           
          console.log(this.reimbursementForm.value);
          
          
  }
  }
 
  limit(page)
  {
    this.names.length=0;
    this.pageCount=page;
    this.clearErrorMessages();
    console.log(this.pageCount);
   if (page <= this.countMaxMin) {
     console.log("yes");
     for (let i = 0; i <= page - 1; i++) {
      this.names.push(this.excel1[i]);
      console.log("1");
     }
   }
   
    if(this.pageCount==''){
    this.dataSource = new MatTableDataSource(this.excel1);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
   }
   else if( this.pageCount >= 0) {
     
    console.log("display");
      this.dataSource = new MatTableDataSource(this.names);
       this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    console.log(this.pageCount);
    console.log(this.countMaxMin);
     if(this.pageCount > this.countMaxMin && this.countMaxMin!=0)
    {
     this.memMaxMinErr.isValid = true;
       this.memMaxMinErr.errMsg = "Limit  should not be greater than " +this.countMaxMin + ".";
      return;
 
    }
    
    
  }
  
  onSubmit() {

    this.submitted = true;
  
    // reset alerts on submit
    this.alertService.clear();
  
    // stop here if form is invalid
    if (this.reimbursementForm.invalid) {
        return;
    }
  
    this.loading = true;
  
    if (this.isAddMode) {
    } else {
      this.updateReimbursement();
    }
  }

  updateReimbursement()
  {
    let uReimbursementObj = {
      reimbursementId:this.uslReimbursementId,      
      indicator: this.c.slApprovalInd.value == true ? '1' : '0',
      reasonText:this.c.slReasonText.value,
      userId:this.loginService.currentUserValue.name
    }
    
    this._reimbursementService.updateReimbursement(uReimbursementObj.reimbursementId, uReimbursementObj.indicator, uReimbursementObj.reasonText, uReimbursementObj.userId)
    .pipe(first())
    .subscribe({
      next: () => {
        
        this.reimbursementForm.patchValue({          
          slReimbursementId:uReimbursementObj.reimbursementId,      
          slApprovalInd: uReimbursementObj.indicator=='1'?true:false,
          slReasonText:uReimbursementObj.reasonText,
          userId: uReimbursementObj.userId
        });
        this.openCustomModal(false, null);
        this.alertService.success('Reimbursement updated', {
          keepAfterRouteChange: true
        });

       this.searchReimbursement(this.reimbursementSearchForm);
        this.reimbursementForm.reset();
        // this.router.navigate(['../../'], { relativeTo: this.route });                    
      },
      error: error => {
        this.alertService.error(error);
        this.loading = false;
      }
    });

  }



  searchReimbursement(form: FormGroup) {
    
    this.names.length=0;  
     this.clearErrorMessages();
     this.isReimbursementSearchFormInvalid=false;
     if(this.f.slReimbursementId.value=='' && this.f.slReimbursementSeqId.value=='' &&this.f.slGrpId.value=='' && this.f.requestStartDate.value==null && this.f.requestEndDate.value==null &&  this.f.slReimbursementMaxAmt.value=='' && this.f.slReimbursementMinAmt.value==''  && this.f.slCategoryReport.value=='' && this.f.slFrequencyType.value==''){
       this.isReimbursementSearchErr = true;
       return;
     }
     console.log(this.reimbursementSearchForm.value);
 
     if(this.reimbursementSearchForm.invalid){
       return;
     }
 
     if(this.isReimbursementSearchFormInvalid){
       return;
     }
     if(!this.isReimbursementSearchFormInvalid){
       
        this.getClaimSearchResultsGrid();
     }
 
   }
   getClaimSearchResultsGrid(){
     
   let  slGrpId = this.reimbursementSearchForm.get('slGrpId').value;
   let slReimbursementId = this.reimbursementSearchForm.get("slReimbursementId").value;
   let slReimbursementSeqId = this.reimbursementSearchForm.get("slReimbursementSeqId").value;
   let slReimbursementMinAmt = this.reimbursementSearchForm.get("slReimbursementMinAmt").value;
   let slReimbursementMaxAmt = this.reimbursementSearchForm.get("slReimbursementMaxAmt").value;
   let slCategoryReport = this.reimbursementSearchForm.get("slCategoryReport").value;
   let slFrequencyType = this.reimbursementSearchForm.get("slFrequencyType").value;
   let slApprovalInd = this.reimbursementSearchForm.get("slApprovalInd").value;
   let requestStartDate = this.reimbursementSearchForm.get("requestStartDate").value;
   let requestEndDate = this.reimbursementSearchForm.get("requestEndDate").value;





    
   if(!this.isReimbursementSearchFormInvalid){
    this._reimbursementService.getReimbursementSearch(slGrpId,slReimbursementId,slReimbursementSeqId,slReimbursementMinAmt,slReimbursementMaxAmt,slCategoryReport,slFrequencyType,
      slApprovalInd,requestStartDate,requestEndDate).subscribe(
      (data:IReimbursementReportsModel[]) => {
        this.excel1=data;
        this.countMaxMin=data.length;

      
        let maxPage=this.reimbursementSearchForm.get("maxPage").value;
      
    
       
       for(let i=0; i <= maxPage-1;i++)
       {
         this.names.push(data[i]);
           
       }
      
       if(maxPage > this.countMaxMin )
      {
        this.memMaxMinErr.isValid=true;
        this.memMaxMinErr.errMsg="Range should not be greater than "+this.countMaxMin+"."; 
        return; 
      }
     
      console.log(this.names); 
       console.log(data);
       //(VE 11/8/2021  Ends) 

        this.submitted = true;
        this.dateErrorMessage='';
        this.isReimbursementResult = true;

        this.reimbursementSearchNotFound = false;
        this.reimbursementResults = data;
        if(data[maxPage]==undefined)
         {
        this.dataSource = new MatTableDataSource(data);
         }
         else if(maxPage >= 0){
          this.dataSource = new MatTableDataSource(this.names);
         }
        setTimeout(()=>{
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        }, 700);

      },
      (error) => {
        this.reimbursementSearchNotFound = true;
        this.isReimbursementResult = false;

      }
    )
   }
  }


  exportAsXLSX():void {
    this.excelService.exportAsExcelFileClaim(this.excel1,"Claim_Search_Report")
  
    console.log("working");
  }
  



}

