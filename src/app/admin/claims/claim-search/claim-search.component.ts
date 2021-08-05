import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {IClaimSearch} from '../../models/claim-search.model';
import {IClaimReportsModel} from '../../models/claim-reports.model';
import {ClaimReportService} from '../../services/claim-report.service';
import {ClaimService} from '../../services/claim.service';
import { ICoveredClaims } from '../../models/product-model';
import {Paths} from '../../admin-paths';
import { Observable } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { DatePipe } from '@angular/common';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { LoginService } from 'src/app/shared/services/login.service';
import { ProductService } from '../../services/product.service';
import {ExcelService} from '../../services/excel.service';

@Component({
  selector: 'app-claim-search',
  templateUrl: './claim-search.component.html',
  styleUrls: ['./claim-search.component.css'],
  providers: [DatePipe]
})
export class ClaimSearchComponent implements OnInit {
  claimSearchForm: FormGroup;
  claimForm: FormGroup;
  maxDate: any;
  today: string;
  isClaimSearchErr: boolean = false;
  isCustomModalOpen: boolean=false;
  //claimSearchRequest: IClaimSearch;
  claimIdErr = {isValid: false, errMsg: ''};
  memberIdErr = {isValid: false, errMsg: ''};
  memberFnameErr = { isValid: false, errMsg: '' }; //  by Venkatesh Enigonda
  memberLnameErr = { isValid: false, errMsg: '' }; //  by Venkatesh Enigonda
  dateErr = {
    fromDateErr: false,
    fromDateInvalid: false,
    toDateInvalid: false,
    dateErr: false,
    dateMsg:''
  };
  dateErrorMessage: string = '';
  
  coveredClaims: ICoveredClaims[] = [];
  
  claimResults: IClaimReportsModel[] = [];
  displayedColumns: any[] = ['claimId','sequenceNumber', 'clientName', 'memberId', 'firstName', 'lastName', 'minPaidAmount', 'climReceivedOn','paidFromDate','dateOfBirth','serviceStartDate','serviceEndDate','diagnosisCode','claimSource','claimType','subscriberFirstName','subscriberLastName','alternateId','paidToDate'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isClaimResult: boolean;
  claimSearchNotFound: boolean = false;
   @ViewChild("focusElem") focusTag: ElementRef;
  // @ViewChild("focusMemSearch") focusMSTag: ElementRef;
  
  isAddMode: boolean = false;
  loading = false;
  memSearchSubmitted = false;
  submitted:boolean = false;
  isViewModal: boolean=false;
  isAdmin: boolean;
  isDisabled: boolean=false;
  excel1; //(VE 4/8/2021 )
  constructor(private fb: FormBuilder, 
    private _claimReportService: ClaimReportService,  private excelService:ExcelService,
    private _claimService: ClaimService,
    private _route:Router,
    private alertService: AlertService,
    private datePipe: DatePipe, public loginService: LoginService, private productService: ProductService ) {}

  ngOnInit() {
    this.initClaimSearchForm();
    //this.maxDate = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd');
    this.maxDate= new Date('2999-12-31');
    console.log(this.maxDate);
    
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100)
    this.today=new Date().toJSON().split('T')[0];
    this.isClaimResult=false;
   // this._claimService.isClaimResult.subscribe((value)=>{this.isClaimResult=value;});    
    // this._claimService.claimSearchRequest.subscribe((res)=>{
    //   this.claimSearchRequest=res; 
    //   if(this.isClaimResult){
    //     this.claimSearchForm.patchValue(this.claimSearchRequest);
    //     this.getClaimSearchResultsGrid(this.claimSearchRequest);
    //   }
    // });
    this.loginService.getLoggedInRole();
    this.isAdmin = this.loginService.isAdmin;
    if(!this.isAdmin){
      this.isViewModal=true;
    }
      this.clearErrorMessages();
      this.initClaimForm();
  }
  initClaimSearchForm(){    
    this.claimSearchForm = this.fb.group({
      claimId: [''],
      memberId:  [''],
      firstName:'',
      lastName:'',
      dateOfBirth:[null],
      fromDate:[null],
      toDate: [null],
      clientId: [''],
      sequenceNumber: [''],
      minPaidAmount: [''],
      maxPaidAmount: [''],
      dollorAmount: [''],  
      diagnosisCode: [''],
      claimSource: [''],
      claimType: [''],
      alternateId: [''],
      paidFromDate: [null],
      paidToDate:[null],
      paidDate: [null]
      //PV 27-jul-2021
      // subscriberFirstName: [''],
      // subscriberLastName: [''],
      // paidFromDate: [''],
      // paidToDate: ['']
    },{validator: this.dateLessThan('fromDate', 'toDate')});
  }
  clearErrorMessages(){  
    this.claimIdErr.isValid=false;
    this.claimIdErr.errMsg='';
    this.memberIdErr.isValid=false;
    this.memberIdErr.errMsg='';    
    this.memberFnameErr.isValid = false; //start by Venkatesh Enigonda
    this.memberFnameErr.errMsg = '';
    this.memberLnameErr.isValid = false;
    this.memberLnameErr.errMsg = '';  //end by Venkatesh Enigonda
    this.dateErr.fromDateErr=false; 
    this.dateErr.dateErr=false;  
    this.dateErr.dateMsg='';  
    this.dateErr.fromDateInvalid=false;
    this.dateErr.toDateInvalid=false;
    this.dateErrorMessage='';
    this.isClaimSearchErr=false;
    this.claimSearchNotFound = false;
  }
dateLessThan(from: string, to: string) {  
  return (group: FormGroup): {[key: string]: any} => {
    this.clearErrorMessages();
    let f = group.controls[from];
    let t = group.controls[to];
    if (f.value > t.value) {
      this.dateErr.fromDateErr= true;
      this.isClaimSearchErr = false;
      this.dateErr.dateMsg='';  
      //new added by masool irfan
    } else if (f.value!=null && t.value!=null && f.value == t.value){
      //till here
      this.dateErr.dateErr= true; 
      this.isClaimSearchErr = false;   
      this.dateErr.dateMsg='';  
    } else{
      this.dateErr.fromDateErr= false;
      this.dateErr.dateErr= false;
      this.isClaimSearchErr = false;
    }
    return {};
  }
}
  // setMaxDate(): string{
  //     return new Date().toISOString().split('T')[0];
  //  }
  // conven`ience getter for easy access to form fields
  resetClaimSearch(){
    this.initClaimSearchForm();
    this.claimSearchNotFound = false;
    debugger;
    console.log(this.claimSearchForm.value);
    debugger;
    //this._claimService.setIsClaimResult(false);
    this.isClaimResult=false;
   // this._claimService.resetClaimSearch();
    this.clearErrorMessages();   
  }
  get f() { return this.claimSearchForm.controls; }
  get c() { return this.claimForm.controls; }

  
// claim form modal start 
initClaimForm(){
  
  this.claimForm = this.fb.group({
    claimId: [''],
    clientId:  [''],
    clientName: [''],
    memberId:  [0],
    firstName: [''],
    lastName:  [''],
    paidAmount: [0],
    climReceivedOn:  [''],
    paidDate: [null],
    dateOfBirth: [''],
    serviceStartDate:  [''],
    serviceEndDate:  [''],
    sequenceNumber:  [0],
    diagnosisCode: [''],
    claimSource: [''],
    claimType:  [''],
    alternateId:  [''],
    subscriberFirstName: [''],
    subscriberLastName:  ['']
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
    this.claimForm.reset();
    this.isAddMode = false;
    this.isViewModal=false;
  }
  console.log("id inside modal: "+id);

  if(id!=null && open){
    
    this.isAddMode = false;   
      console.log(id);
      
          this.claimForm.patchValue({    
            claimId: id.claimId,
            clientId:  id.clientId,
            clientName: id.clientName,
            memberId: id.memberId,
            firstName: id.firstName,
            lastName:  id.lastName,
            paidAmount:id.paidAmount,
            climReceivedOn:  this.datePipe.transform(id.climReceivedOn, 'yyyy-MM-dd'),
            paidDate:  this.datePipe.transform(id.paidDate, 'yyyy-MM-dd'),
            dateOfBirth: this.datePipe.transform(id.dateOfBirth, 'yyyy-MM-dd'),
            serviceStartDate:  this.datePipe.transform(id.serviceStartDate, 'yyyy-MM-dd'),
            serviceEndDate:   this.datePipe.transform(id.serviceEndDate, 'yyyy-MM-dd'),
            sequenceNumber:  id.sequenceNumber,
            diagnosisCode: id.diagnosisCode,
            claimSource: id.claimSource,
            claimType:  id.claimType,
            alternateId: id.alternateId,
            subscriberFirstName:id.subscriberFirstName,
            subscriberLastName:  id.subscriberLastName  
          });

        
        
        if(this.isViewModal==true){
          this.claimForm.disable();
        }
        if(this.isViewModal==false){
          this.claimForm.enable();
        }
}
}

onSubmit() {
    
  this.submitted = true;

  // reset alerts on submit
  this.alertService.clear();

  // stop here if form is invalid
  if (this.claimForm.invalid) {
      return;
  }

  this.loading = true;
  
  if (this.isAddMode) {
    
     // this.addMember();
  } else {
    //  this.updateMember();
      
  }
}
// claim form modal end

  validateDate(labelName, controlName){

  }
  validateTextBox(labelName, controlName){
    
  }
  searchClaim(form: FormGroup) {
    this.isClaimResult=false;
    console.log(this.dateErr.fromDateErr); 
    this.clearErrorMessages();
    
    this.claimSearchForm.patchValue(this.claimSearchForm.value);
       console.log(this.claimSearchForm.value);
    // this.claimSearchForm.patchValue({
    //   claimId: this.f.claimId.value,
    //   memberId: this.f.memberId.value,
    //   firstName: this.f.firstName.value,
    //   lastName: this.f.lastName.value,
    //   dateOfBirth: this.f.dateOfBirth.value==''?null:this.f.dateOfBirth.value,
    //   fromDate:  this.f.fromDate.value==''?null:  this.f.fromDate.value,
    //   toDate:  this.f.toDate.value==''?null: this.f.toDate.value   
    // });
    // this.f.claimId.value==' '?'':this.f.claimId.value;
    // this.f.memberId.value==' '?'':this.f.memberId.value;
    // this.f.firstName.value==' '?'':this.f.firstName.value;
    // this.f.lastName.value==' '?'':this.f.lastName.value;
    
    if(this.f.claimId.value=='' && this.f.memberId.value=='' && this.f.firstName.value=='' && this.f.lastName.value=='' && this.f.dateOfBirth.value==null && this.f.clientId.value=='' && this.f.fromDate.value==null && this.f.toDate.value==null && this.f.sequenceNumber.value=='' && this.f.minPaidAmount.value=='' && (this.f.maxPaidAmount.value=='' || this.f.maxPaidAmount.value==null) && this.f.diagnosisCode.value=='' && this.f.claimSource.value=='' && this.f.claimType.value=='' && this.f.alternateId.value=='' && this.f.paidFromDate.value==null && this.f.paidToDate.value==null){
                    
      this.isClaimSearchErr = true;
      return;
    }
    
    // if(this.claimSearchForm.invalid){
    //   return;
    // }
    // if(this.dateErr.fromDateErr)
    // {      
    //   this.dateErrorMessage='';
    //   this.dateErrorMessage = "From date should not be greater than To date";
    //   this.isClaimSearchErr = false;
    //   return;
    // }
    // if(this.dateErr.dateErr)
    // {      
    //   this.dateErrorMessage='';
    //   this.dateErrorMessage = "From date should not be EQUAL with To date";
    //   this.isClaimSearchErr = false;
    //   return;
    // }
    // if(this.f.fromDate.value!=null && (this.f.toDate.invalid || this.f.toDate.value==null)){
    //   this.dateErrorMessage='';
    //   this.dateErrorMessage = "End date is invalid. Enter valid End date";
    //   this.dateErr.toDateInvalid=true;
    //   this.isClaimSearchErr = false;
    //   return;      
    // }
    
    
    // if(this.f.toDate.value!=null && (this.f.fromDate.invalid || this.f.fromDate.value==null)){
    //   this.dateErrorMessage='';
    //   this.dateErrorMessage = "From date is invalid. Enter valid From date";
    //   this.dateErr.fromDateInvalid=true;
    //   this.isClaimSearchErr = false;
    //   return;      
    // }
    
    let checkMemberId = /^([A-Za-z0-9]+)$/; 
    console.log(checkMemberId.test(this.f.memberId.value));
    let memberIdTest=checkMemberId.test(this.f.memberId.value);

    let checkId = /^([A-Za-z0-9]+)$/; 
    console.log(checkId.test(this.f.claimId.value));
    let a1=checkId.test(this.f.claimId.value);

    let checkName = /^([a-zA-Z]+)$/; //start by Venkatesh Enigonda
    console.log(checkName.test(this.f.firstName.value));
    let a2 = checkName.test(this.f.firstName.value);
    console.log(checkName.test(this.f.lastName.value));
    let a3 = checkName.test(this.f.lastName.value); //End by Venkatesh Enigonda
    
    if(!a1 && this.f.claimId.value!=''){
      this.claimIdErr.isValid=true;
      this.claimIdErr.errMsg='Claim Id is not valid';
      return;
    }
    if(!memberIdTest && this.f.memberId.value!=''){
      this.memberIdErr.isValid=true;
      this.memberIdErr.errMsg='Member Id is not valid';
      return;
    }

    if (!a2 && this.f.firstName.value != '') {  //start by Venkatesh Enigonda
      this.memberFnameErr.isValid = true;
      this.memberFnameErr.errMsg = 'Fisrt name is not valid.It should be Alphabet';
      return;
    }
    if (!a3 && this.f.lastName.value != '') {
      this.memberLnameErr.isValid = true;
      this.memberLnameErr.errMsg = 'Last name is not valid.It should be Alphabet';
      return;
    }

    let claimRequestObj = {
      claimId: this.f.claimId.value,
      memberId: this.f.memberId.value,
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      dateOfBirth: this.f.dateOfBirth.value==''?null: this.datePipe.transform(this.f.dateOfBirth.value, 'yyyy-MM-dd'),
      fromDate:  this.f.fromDate.value==''?null: this.datePipe.transform(this.f.fromDate.value, 'yyyy-MM-dd'),
      toDate:  this.f.toDate.value==''?null: this.datePipe.transform(this.f.toDate.value, 'yyyy-MM-dd'),
      clientId: this.f.clientId.value,
      sequenceNumber : this.f.sequenceNumber.value==''?0:Number(this.f.sequenceNumber.value),
      minPaidAmount: this.f.minPaidAmount.value==''?0:Number(this.f.minPaidAmount.value),
      maxPaidAmount: this.f.maxPaidAmount.value==''?0:Number(this.f.maxPaidAmount.value),
      dollorAmount: this.f.dollorAmount.value==''?0:Number(this.f.dollorAmount.value),
      diagnosisCode: this.f.diagnosisCode.value,
      claimSource: this.f.claimSource.value,
      claimType: this.f.claimType.value,
      alternateId: this.f.alternateId.value,
      paidDate:  this.f.paidDate.value==''?null: this.datePipe.transform(this.f.paidDate.value, 'yyyy-MM-dd'),
      paidFromDate:  this.f.paidFromDate.value==''?null: this.datePipe.transform(this.f.paidFromDate.value, 'yyyy-MM-dd'),
      paidToDate:  this.f.paidToDate.value==''?null: this.datePipe.transform(this.f.paidToDate.value, 'yyyy-MM-dd'),
    }
   // this._claimService.setClaimSearchRequest(claimRequestObj);
    // this._claimService.claimSearchRequest.subscribe((res)=>{this.claimSearchRequest=res;});
    
     this.getClaimSearchResultsGrid(claimRequestObj);
     
     
  }
  getClaimSearchResultsGrid(claimSearchFormReq:IClaimSearch){
    
    this._claimReportService.getClaimReport(claimSearchFormReq).subscribe(
      (data) => {
        this.excel1=data;//(VE 4/8/2021 )
        
        this.submitted = true;
        this.dateErrorMessage='';
        this.isClaimResult = true;
       // this._claimService.setIsClaimResult(true);
        
        this.claimSearchNotFound = false;
        this.claimResults = data;
        this.dataSource = new MatTableDataSource(data);
        setTimeout(()=>{
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        }, 1000);
        
      },
      (error) => {
        this.claimSearchNotFound = true;
       // this._claimService.setIsClaimResult(false);

      } 
    )
  }
  
 //(VE 4/8/2021 )
 exportAsXLSX():void {
  this.excelService.exportAsExcelFile(this.excel1,"MemberList")

  console.log("working");
}
//(VE 4/8/2021 )

  setClaimId(id: string){
    
    
    this._claimService.setClaimId(id);
    console.log("Id : "+id);
   // this.isClaimReportsHidden= true;
    this._route.navigate(['/claim']);
  }
  
}
