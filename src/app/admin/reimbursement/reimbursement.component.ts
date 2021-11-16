
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {IReimbursementAudit, IReimbursementReportsModel, IReimbursementSearch} from '../models/reimbursement.model';
import {ReimbursementService} from '../services/reimbursement.service';
import { Observable } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { DatePipe } from '@angular/common';
import { ClientsService } from '../services/clients.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { LoginService } from 'src/app/shared/services/login.service';
import { ProductService } from '../services/product.service';
import {ExcelService} from '../services/excel.service';
import {DecimalPipe} from '@angular/common'; 
import { LoaderService } from '../services/loader.service';
import { first } from 'rxjs/operators';
import { IActiveClient } from '../models/contracts-model';
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

  reimMaxMinErr={isValid: false, errMsg: ''};
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

  displayedColumns: any[] = ['slReimbursementId', 'slReimbursementSeqId','slGrpId', 'slFundingRequestDate' ,'slCategoryReport', 'slFrequencyType','slReimbursementAmt','slDwPullTs','slApprovalInd','insertUser','updateUser','insertTs','updateTs','requestEndDate'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isReimbursementResult: boolean;
  reimbursementSearchNotFound: boolean = false;
  @ViewChild("focusElem") focusTag: ElementRef;

  isAddMode: boolean = false;
  loading = false;
  isLoading:boolean=true;
  reimSearchSubmitted = false;
  submitted:boolean = false;
  isViewModal: boolean=false;
  isAdmin: boolean;
  reimbursementResults:any=[];
  activeClients: IActiveClient[]=[];
  reimbursementAudits: IReimbursementAudit[]=[];
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

  AddEmptyErr={isValid: false, errMsg:''};
  reimIdErr={isValid:false,errMsg:''};
  reimSeqErr={isValid:false,errMsg:''};
  accountIdErr={isValid:false,errMsg:''};
  startDateErr={isDateErr:false,dateErrMsg:''};
  isDWthere: boolean = false;
  updateNoChange= {flag: false, message: ''}

  fetchReimbursementDetailsOld: any;
  fetchReimbursementDetailsNew: any;
  maxSequenceObj = {
    maxSequenceId: '',
    curSequenceId: '',
    flag: false,
    message: ''
  }

  constructor(
    private clientService: ClientsService,
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
    this.getActiveClients();
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
      slReimbursementId: [''],
      slReimbursementAmt:  [''],
  requestStartDate:[null],
  slGrpId: [''],
  requestEndDate: [null],
  slCategoryReport: [''],
  slFrequencyType:[''],
  slReimbursementMinAmt: [''],
  slReimbursementMaxAmt:  [''],
  slApprovalInd: [''],
  slReimbursementSeqId:  [''],
  slFundingRequestDate:[null],
  slReasonText:[''],
  maxPage:null,
  slDwPullTs:null
     
    },{validator: this.dateLessThan('fromDate', 'toDate')});
  }
  clearErrorMessages(){

    this.isReimbursementSearchFormInvalid=false;
    this.AddEmptyErr.isValid=false;
    this.AddEmptyErr.errMsg='';
    this.reimMaxMinErr.isValid=false;
   this.reimMaxMinErr.errMsg='';
   this.isReimbursementSearchErr=false;
   this.accountIdErr.isValid=false;
   this.accountIdErr.errMsg='';
   this.reimSeqErr.isValid=false;
   this.reimSeqErr.errMsg='';
   this.reimIdErr.isValid=false;
   this.reimIdErr.errMsg='';
   this.startDateErr.isDateErr=false;
   this.startDateErr.dateErrMsg='';
   this.updateNoChange= {flag: false, message: ''};

   this.isDWthere=false;
   
  this.maxSequenceObj = {
    maxSequenceId: '',
    curSequenceId: '',
    flag: false,
    message: ''
  }
    
  
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
      slReimbursementId: [''],
      requestStartDate:[null],
      slGrpId: ['', Validators.required],
      requestEndDate: [null],
      slFundingRequestDate:[null, Validators.required],
      slCategoryReport:['', Validators.required],
      slFrequencyType: ['', Validators.required],
      slReimbursementAmt:['', Validators.required],
 
      slReimbursementSeqId: [''],
      slDwPullTs:null,
      slReasonText:[''],
      slApprovalInd:false,
      insertUser:[''],
      updateUser:[''],
      insertTs:[null],
      updateTs:[null]


    
    });
  }
  openViewModal(bool, id:any){
    this.isViewModal = true;
    this.openCustomModal(bool, id);
  }
  
  getReimbursementAudits(reimbursementId: number){
    
    this._reimbursementService.getReimbursementAudits(reimbursementId).subscribe((res)=>{
      this.reimbursementAudits = res;
    })
  }
  openCustomModal(open: boolean, id:any) {
    document.getElementById("reimbursementFormWrap").scrollTop=0;
    this.isLoading=true;
    this.clearErrorMessages();
    this.isDisabled=false;
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100);
    this.isCustomModalOpen = open;
    this.submitted = false;
    if(open && id==null){
      this.isAddMode = true;
      //  this.initReimbursementForm();
      this.reimbursementForm.patchValue({
        slApprovalInd: false
      })

      
    }
    if (!open && id==null) {
       this.reimbursementForm.reset();
      this.isAddMode = false;
      this.isViewModal=false;
    }
    console.log("id inside modal: "+id);
  
    if(this.isAddMode &&!this.isViewModal ) 
    
    {
      this.reimbursementForm.enable();
    this.c.slReimbursementId.disable();
    this.c.slReimbursementSeqId.disable();
    // this.c.slCategoryReport.disable();
    // this.c.slFrequencyType.disable();
    
    }
   
    else if(!this.isAddMode && !this.isViewModal){
     
      this.reimbursementForm.disable();
      this.c.slApprovalInd.enable();
      this.c.slReasonText.enable();
    } 
    else if(this.isViewModal){
      this.reimbursementForm.disable();
    }
    if(id!=null && open){
  
      this.isAddMode = false;
      
        console.log(id);
            this.uslReimbursementId= id.slReimbursementId;

            this.maxSequenceObj.curSequenceId =  id.slReimbursementSeqId;
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
              
              slReimbursementAmt:id.slReimbursementAmt== 0 ? '' : this.decimalValueString(id.slReimbursementAmt),
              slReasonText:id.slReasonText==null?'':id.slReasonText,
              slApprovalInd:id.slApprovalInd == 'N' ?false : true,

              userId: this.loginService.currentUserValue.name
            });
            
            this.fetchReimbursementDetailsOld=this.reimbursementForm.value;
            if(id.slDwPullTs!=null && id.slApprovalInd=='Y' ){
              this.isDWthere = true;
              this.c.slApprovalInd.disable();
            }
            else if(id.slDwPullTs!=null && id.slApprovalInd=='N'){
              this.isDWthere = false;              
              this.c.slApprovalInd.enable();              
            }
            else if(!this.isViewModal){
              this.isDWthere = false;              
              this.c.slApprovalInd.enable();
            } 
            this.getReimbursementAudits(this.c.slReimbursementId.value);
  
          
           
          console.log(this.reimbursementForm.value);
          
          
  }
  }
  
  validateInputAlphaNumIds(labelName, fieldValue)
  {
    
    let alphaNum= /^([A-Za-z0-9]+)$/;
    if(fieldValue.length>0){
      let checkInputAlphaNum = alphaNum.test(fieldValue);
      if(!checkInputAlphaNum )
      {
        if(labelName=='Medica Account ID'){
          this.accountIdErr.isValid= true;
          this.accountIdErr.errMsg = 'Invalid '+labelName;
          this.isReimbursementSearchFormInvalid=true;
        }
        else
        this.isReimbursementSearchFormInvalid=false;
      }
    
    }

  }
  validateInputIDs(labelName, fieldValue){


    let Num = /^([0-9]+)$/;

    let isValidInputID: boolean=true;
    if(fieldValue.length>0){
      let checkInputString = Num.test(fieldValue);
      if(!checkInputString){
        if(labelName=='StopLoss Reimbursement ID'){
          this.reimIdErr.isValid=true;
          this.reimIdErr.errMsg='Invalid '+labelName;
          this.isReimbursementSearchFormInvalid=true;
        }
        else if(labelName=="StopLoss Reimbursement Sequence"){
          this.reimSeqErr.isValid=true;
          this.reimSeqErr.errMsg='Invalid '+labelName;
          this.isReimbursementSearchFormInvalid=true;
        }
       
      
        else{
          this.isReimbursementSearchFormInvalid=true;
        }
      }
    }

  }
  validateDate(labelName, fieldValue){
    if(labelName=="Start Date"){
      if(fieldValue==null){
        this.reimbursementForm.patchValue({dateOfBirth:null});
      }
    }
    if(labelName=="End Date"){
      if(fieldValue==null){
        this.reimbursementForm.patchValue({fromDate:null});
      }
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
     this.reimMaxMinErr.isValid = true;
       this.reimMaxMinErr.errMsg = "Limit  should not be greater than " +this.countMaxMin + ".";
      return;
 
    }
    
    
  }
  getActiveClients(){
    
    this._reimbursementService.getAllClients().subscribe(
      (data)=>{
        data.sort((a, b) => (a.clientName > b.clientName) ? 1 : -1);
        this.activeClients = data;
        
      })
  }
  
  decimalValueString(inputValue){
    let a;
    if(inputValue==0 || inputValue==null) a='';
    else a= this.decimalPipe.transform(inputValue,this.format).replace(/,/g, ""); 
    console.log(a);      
    return a;
  }
  decimalValue(inputValue:number){      
    if(inputValue==0 || inputValue==null) inputValue=0;
    else{
       let kk=this.decimalPipe.transform(inputValue,this.format);        
      inputValue= Number(this.decimalPipe.transform(inputValue,this.format).replace(/,/g, ""));        
      //inputValue= Number(this.decimalPipe.transform(inputValue,this.format).replace(',', "")); 
      //inputValue= Number(this.decimalPipe.transform(inputValue, this.format).replace(/\D,/g, ""));
    }
    console.log(inputValue);      
    return inputValue;
  }     

  numberValueString(numValue){
    if(numValue==null || numValue==0){
      numValue='';    
    }
    else{
      numValue=this.decimalValueString(numValue);
    }
    return numValue;
  }
  numberValue(numValue){
    if(numValue==null || numValue==''){
      numValue=0;    
    }
    else{
      numValue=this.decimalValue(numValue);
    }
    return numValue;
  }
  
  onSubmit() {
    this.clearErrorMessages();
    this.submitted = true;
  
    // reset alerts on submit
    this.alertService.clear();
  
    // stop here if form is invalid
    if (this.reimbursementForm.invalid) {
        return;
    }
    console.log(this.c.slCategoryReport.value);
    console.log(this.c.slFrequencyType.value);
    

if(this.isAddMode)
{
  
  console.log(this.reimbursementForm.value);
  if((this.c.slApprovalInd.value=="1"||this.c.slApprovalInd.value==null ) && (this.c.slCategoryReport.value == "" || this.c.slCategoryReport.value == null)&& (this.c.slFrequencyType.value == "" || this.c.slFrequencyType.value == null) &&this.c.slFundingRequestDate.value == null && (this.c.slReasonText.value == "" || this.c.slReasonText.value == null) && (this.c.slGrpId.value == "" || this.c.slGrpId.value == null)&&(this.c.slReimbursementAmt.value== 0 || this.c.slReimbursementAmt.value== null)&&(this.c.slReimbursementId.value == null || this.c.slReimbursementId.value == 0)&& (this.c.slReimbursementSeqId.value == null || this.c.slReimbursementSeqId.value == '')){  

    this.AddEmptyErr.isValid=true;    
    this.AddEmptyErr.errMsg='Please enter the details';    
    return;
  }
    
    
}
  
    this.loading = true;
    if(this.updateNoChange.flag) return;
    if (this.isAddMode) {
      this.addReimbursement()
    } else {
      this.updateReimbursement();
    }
  }
  addReimbursement()
  {


    let addObj = {
      slReimbursementId : this.c.slReimbursementId.value==''?0:Number(this.c.slReimbursementId.value),
      slReimbursementSeqId : this.c.slReimbursementSeqId.value,
      slFundingRequestDate: this.datePipe.transform(this.c.slFundingRequestDate.value, 'yyyy-MM-dd'),
      slCategoryReport:this.c.slCategoryReport.value,
      slFrequencyType:this.c.slFrequencyType.value,
      slReimbursementAmt : this.c.slReimbursementAmt.value==''?0:Number(this.c.slReimbursementAmt.value),
      
      slApprovalInd: this.c.slApprovalInd.value == true ? '1' : '0',
      insertUser:this.loginService.currentUserValue.name,
      updateUser:this.loginService.currentUserValue.name,
      insertTs:null,
      updateTs:null,
      slReasonText:this.c.slReasonText.value,
      slDwPullTs:null,
      slGrpId:this.c.slGrpId.value



     
    }
    

    this.isLoading=false;
    
    console.log(addObj);
   
    this._reimbursementService.addReimbursement(addObj)
        .pipe(first())
        .subscribe({
            next: (data) => {
                console.log(data);
                this.openCustomModal(false, null);
                this.reimbursementForm.reset();
              
              //this.navService.setContractID(data.id);
              //this.openCustomModal(false, null);
             // this.getAllContracts();
              //this.contractForm.reset();                   
              //this.clientService.passClientId(this.f.clientId.value);   
              this.alertService.success('New Reimbursement added', { keepAfterRouteChange: true });  
              this.isDisabled=true;
              //this.productService.setProductAddStatus(true);  \
             
             // this.isAdded = true;
              
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        });
    
  }
  checkMaxSequenceNo(rowObj){
    this.maxSequenceObj.curSequenceId = rowObj.slReimbursementSeqId;
    
    this._reimbursementService.checkMaxSequenceNo(rowObj.slReimbursementId).subscribe((data)=>{
      this.maxSequenceObj.maxSequenceId = data;
      if(this.maxSequenceObj.curSequenceId < this.maxSequenceObj.maxSequenceId){
        this.maxSequenceObj.flag=true;
        this.maxSequenceObj.message = "This record cannot be editable";
      }
      else{
        this.maxSequenceObj.flag=false;
        this.maxSequenceObj.message = '';
        this.openCustomModal(true,rowObj);
      }
      
    })
  }
  updateReimbursement()
  {
    let uReimbursementObj = {
      reimbursementId:this.uslReimbursementId,      
      indicator: this.c.slApprovalInd.value == true ? '1' : '0',
      reasonText:this.c.slReasonText.value,
      userId:this.loginService.currentUserValue.name,
      sequenceId: this.c.slReimbursementSeqId.value
    }
    
    this.isLoading=false;
    
    this.fetchReimbursementDetailsNew = this.reimbursementForm.value;
    if(JSON.stringify(this.fetchReimbursementDetailsOld) == JSON.stringify(this.fetchReimbursementDetailsNew) ){
      
      this.updateNoChange.flag=true;
      this.updateNoChange.message="No Values updated. Update atleast one value to update";
      return;
    }
    this._reimbursementService.updateReimbursement(uReimbursementObj.reimbursementId, uReimbursementObj.indicator, uReimbursementObj.reasonText, uReimbursementObj.userId, uReimbursementObj.sequenceId)
    .pipe(first())
    .subscribe({
      next: () => {
        
        this.reimbursementForm.patchValue({          
          slReimbursementId:uReimbursementObj.reimbursementId,      
          slApprovalInd: uReimbursementObj.indicator=='1'?true:false,
          slReasonText:uReimbursementObj.reasonText==null?'':uReimbursementObj.reasonText,
          userId: uReimbursementObj.userId,
          slReimbursementSeqId: uReimbursementObj.sequenceId
        });
        this.openCustomModal(false, null);
        this.updateNoChange.flag=false;
        this.updateNoChange.message="";
        this.alertService.success('Reimbursement updated', {
          keepAfterRouteChange: true
        });
        this.isDisabled=true;
        this.getReimbursementAudits(this.c.slReimbursementId.value);

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
    let alphaNum = /^([a-zA-Z0-9]+)$/;
    let validateId=/^([0-9]+)$/;     

      console.log(alphaNum.test(this.f.slGrpId.value));
      let accountIdTest=alphaNum.test(this.f.slGrpId.value);
      if(!accountIdTest && this.f.slGrpId.value!=''){
        this.accountIdErr.isValid=true;
        this.accountIdErr.errMsg='Invalid Medica Account ID';
        return;
      }
      let reimId=validateId.test(this.f.slReimbursementId.value);
      if(!reimId && this.f.slReimbursementId.value!=''){
        this.reimIdErr.isValid=true;
        this.reimIdErr.errMsg='Invalid StopLoss Reimbursement ID';
        return;
      }
    this.validateInputIDs("StopLoss Reimbursement ID",this.f.slReimbursementId.value);
    this.validateInputIDs("StopLoss Reimbursement Sequence",this.f.slReimbursementSeqId.value);
    this.validateDate("Start Date",this.f.requestStartDate.value);
    this.validateDate("End Date",this.f.requestEndDate.value);
    this.validateInputAlphaNumIds("Medica Account ID", this.f.slGrpId.value);
    let reimSeq=validateId.test(this.f.slReimbursementSeqId.value);
      if(!reimSeq && this.f.slReimbursementSeqId.value!=''){
        this.reimSeqErr.isValid=true;
        this.reimSeqErr.errMsg='Invalid StopLoss Reimbursement Sequence';
        return;
      }
    // let StartDate = this.datePipe.transform(this.reimbursementForm.get('requestStartDate').value, 'yyyy-MM-dd');
    //    let EndDate = this.datePipe.transform(this.reimbursementForm.get('requestEndDate').value, 'yyyy-MM-dd');
 
 
    //    if(StartDate!=null && StartDate!='' && EndDate!=null && EndDate!=''){
    //      if(StartDate>EndDate){
    //        this.startDateErr.isDateErr=true;
    //        this.startDateErr.dateErrMsg = 'Requested Start date should not be greater than Requested End date'
    //      return;
    //      }
    
    //    }





    
    this.names.length=0;  
     this.clearErrorMessages();
     this.isReimbursementSearchFormInvalid=false;
     if(this.f.slReimbursementId.value=='' && this.f.slReimbursementSeqId.value=='' && this.f.slGrpId.value=='' && this.f.requestStartDate.value==null && this.f.requestEndDate.value==null &&  this.f.slReimbursementMaxAmt.value=='' && this.f.slReimbursementMinAmt.value==''  && this.f.slCategoryReport.value=='' && this.f.slFrequencyType.value=='' && this.f.slApprovalInd.value==''){
       
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
     
       
        this.getClaimSearchResultsGrid();
     
 
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

   slReimbursementId = slReimbursementId==''?0:Number(slReimbursementId);
   //slReimbursementSeqId = slReimbursementSeqId==''?0:Number(slReimbursementSeqId);
   slReimbursementMinAmt = slReimbursementMinAmt==''?0:Number(slReimbursementMinAmt);
   slReimbursementMaxAmt = slReimbursementMaxAmt==''?0:Number(slReimbursementMaxAmt);

    
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
        this.reimMaxMinErr.isValid=true;
        this.reimMaxMinErr.errMsg="Range should not be greater than "+this.countMaxMin+"."; 
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
    this.excelService.exportAsExcelFileReimbursement(this.excel1,"Reimbursement_Search_Report")
  
    console.log("working");
  }
  



}

