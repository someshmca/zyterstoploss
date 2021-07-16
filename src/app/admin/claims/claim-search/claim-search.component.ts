import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {IClaimSearch} from '../../models/claim-search.model';
import {IClaimReportsModel} from '../../models/claim-reports.model';
import {ClaimReportService} from '../../services/claim-report.service';
import {ClaimService} from '../../services/claim.service';
import {Paths} from '../../admin-paths';
import { Observable } from 'rxjs';
import { AlertService } from '../../services/alert.service';
import { DatePipe } from '@angular/common';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-claim-search',
  templateUrl: './claim-search.component.html',
  styleUrls: ['./claim-search.component.css'],
  providers: [DatePipe]
})
export class ClaimSearchComponent implements OnInit {
  submitted: boolean = false;
  claimSearchForm: FormGroup;
  maxDate: any;
  today: string;
  isClaimSearchErr: boolean = false;
  claimSearchRequest: IClaimSearch;
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
  
  claimResults: IClaimReportsModel[] = [];
  displayedColumns: any[] = ['claimId', 'clientName', 'memberId', 'firstName', 'lastName', 'paidAmount', 'climReceivedOn','paidDate'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isClaimResult: boolean;
  claimSearchNotFound: boolean = false;


  @ViewChild("focusElem") focusTag: ElementRef;
  constructor(private fb: FormBuilder, 
    private _claimReportService: ClaimReportService, 
    private _claimService: ClaimService,
    private _route:Router,
    private alertService: AlertService,
    private datePipe: DatePipe ) {}

  ngOnInit() {
    this.claimSearchForm = this.fb.group({
      memberId:  [''],
      firstName:'',
      lastName:'',
      dateOfBirth:[''],
      claimId: [''],
      fromDate:[''],
      toDate: ['']
    },{validator: this.dateLessThan('fromDate', 'toDate')});
    //this.maxDate = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd');
    this.maxDate= new Date('2999-12-31');
    console.log(this.maxDate);
    debugger;
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100)
    this.today=new Date().toJSON().split('T')[0];
    this._claimService.isClaimResult.subscribe((value)=>{this.isClaimResult=value;});    
    this._claimService.claimSearchRequest.subscribe((res)=>{
      this.claimSearchRequest=res; 
      if(this.isClaimResult){
        this.claimSearchForm.patchValue(this.claimSearchRequest);
        this.getClaimSearchResultsGrid(this.claimSearchRequest);
      }
    });
    
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
    this.claimSearchForm.reset();
    this.claimSearchNotFound = false;
    this._claimService.setIsClaimResult(false);
    this._claimService.resetClaimSearch();
    this.clearErrorMessages();   
  }
  get f() { return this.claimSearchForm.controls; }
  onSubmit(form: FormGroup) {
    console.log(this.dateErr.fromDateErr); 
    this.clearErrorMessages();
       
    this.claimSearchForm.patchValue({
      claimId: this.f.claimId.value,
      memberId: this.f.memberId.value,
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      dateOfBirth: this.f.dateOfBirth.value==''?null:this.f.dateOfBirth.value,
      fromDate:  this.f.fromDate.value==''?null:  this.f.fromDate.value,
      toDate:  this.f.toDate.value==''?null: this.f.toDate.value   
    });
    this.f.claimId.value==' '?'':this.f.claimId.value;
    this.f.memberId.value==' '?'':this.f.memberId.value;
    this.f.firstName.value==' '?'':this.f.firstName.value;
    this.f.lastName.value==' '?'':this.f.lastName.value;
    
    if(this.f.memberId.value=='' && this.f.firstName.value=='' && this.f.lastName.value=='' && this.f.dateOfBirth.value==null && this.f.claimId.value=='' && this.f.fromDate.value==null && this.f.toDate.value==null){
                    
      this.isClaimSearchErr = true;
      return;
    }
    
    if(this.dateErr.fromDateErr)
    {      
      this.dateErrorMessage='';
      this.dateErrorMessage = "From date should not be greater than To date";
      this.isClaimSearchErr = false;
      return;
    }
    //new added by masool irfan
    if(this.dateErr.dateErr)
    {      
      this.dateErrorMessage='';
      this.dateErrorMessage = "From date should not be EQUAL with To date";
      this.isClaimSearchErr = false;
      return;
    }
    //till here
    if(this.f.fromDate.value!=null && (this.f.toDate.invalid || this.f.toDate.value==null)){
      this.dateErrorMessage='';
      this.dateErrorMessage = "End date is invalid. Enter valid End date";
      this.dateErr.toDateInvalid=true;
      this.isClaimSearchErr = false;
      return;      
    }
    
    // if(this.f.fromDate.valueChanges.subscribe((data)=>{
    // }))
    if(this.f.toDate.value!=null && (this.f.fromDate.invalid || this.f.fromDate.value==null)){
      this.dateErrorMessage='';
      this.dateErrorMessage = "From date is invalid. Enter valid From date";
      this.dateErr.fromDateInvalid=true;
      this.isClaimSearchErr = false;
      return;      
    }
    
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
    }//end by Venkatesh Enigonda

    let claimRequestObj = {
      claimId: this.f.claimId.value,
      memberId: this.f.memberId.value,
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      dateOfBirth: this.f.dateOfBirth.value==''?null: this.datePipe.transform(this.f.dateOfBirth.value, 'yyyy-MM-dd'),
      fromDate:  this.f.fromDate.value==''?null: this.datePipe.transform(this.f.fromDate.value, 'yyyy-MM-dd'),
      toDate:  this.f.toDate.value==''?null: this.datePipe.transform(this.f.toDate.value, 'yyyy-MM-dd')    
    }
    console.log(claimRequestObj);
    this._claimService.setClaimSearchRequest(claimRequestObj);
    this._claimService.claimSearchRequest.subscribe((res)=>{this.claimSearchRequest=res;});
    this.getClaimSearchResultsGrid(this.claimSearchRequest);
   // this._claimReportService.getClaimReport("")
  }
  getClaimSearchResultsGrid(claimReq:IClaimSearch){
    this._claimReportService.getClaimReport(claimReq).subscribe(
      (data) => {
        this.isClaimSearchErr=false;
        this.dateErr.fromDateErr= false;
        this.dateErr.fromDateInvalid=false;
        this.dateErr.toDateInvalid=false;
        this.dateErrorMessage='';
        this.claimSearchNotFound = false;
        console.log("data : "+data);      
        this._claimReportService.setClaimResults(data);
        
       // this._route.navigate(['/claim-result']);
       
        this._claimReportService.claimResultsVal.subscribe(
          (data) =>{ 
            console.log(this.claimSearchForm.value);
            
            this.submitted = true;
            this.dateErrorMessage='';
            // if(this.claimSearchForm.invalid){
            //   this.dateErrorMessage='';
            //   if(this.dateErr.fromDateErr)  
            //     this.dateErrorMessage = "From date should not be greater than To date";
            //   return;
            // }
           
            const headers = { 'content-type': 'application/json'};
            // this.claimSearchForm.patchValue({
            //   DateOfBirth:'0001-01-01',
            //   ServiceDateFrom: '0001-01-01',
            //   ServiceDateTo: '0001-01-01'      
            // })


            // -----------------------        
            //this.isClaimResult = true;
            this._claimService.setIsClaimResult(true);
            console.log(this.isClaimResult);
            
            this.claimSearchNotFound = false;
            this.claimResults = data;
            this.dataSource = new MatTableDataSource(this.claimResults);
            setTimeout(()=>{
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            }, 500)
          }
        );
        console.log("Calim Response data : "+data);
      },
      (error) => {
        this.claimSearchNotFound = true;
        this._claimService.setIsClaimResult(false);

      } 
    )
  }
  setClaimId(id: string){
    
    console.log(this.claimSearchRequest);
    
    this._claimService.setClaimId(id);
    console.log("Id : "+id);
   // this.isClaimReportsHidden= true;
    this._route.navigate(['/claim']);
  }
  
}
