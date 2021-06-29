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
  isClaimSearchErr: boolean = false;
  claimIdErr = {isValid: false, errMsg: ''};
  memberIdErr = {isValid: false, errMsg: ''};
  dateErr = {
    fromDateErr: false,
    fromDateInvalid: false,
    toDateInvalid: false
  };
  dateErrorMessage: string = '';
  
  claimResults: IClaimReportsModel[] = [];
  displayedColumns: any[] = ['claimId', 'clientName', 'memberId', 'firstName', 'lastName', 'paidAmount', 'climReceivedOn','paidDate'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isClaimResults: boolean = false;
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
    this.maxDate = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd');
    this.maxDate= '2999-12-31';
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100)
    this.f.fromDate.valueChanges.subscribe((data)=>{
      
    })
  }
  clearErrorMessages(){  
    this.claimIdErr.isValid=false;
    this.claimIdErr.errMsg='';
    this.memberIdErr.isValid=false;
    this.memberIdErr.errMsg='';    
    this.dateErr.fromDateErr=false;
    this.dateErr.fromDateInvalid=false;
    this.dateErr.toDateInvalid=false;
    this.dateErrorMessage='';
    this.isClaimSearchErr=false;
    this.claimSearchNotFound = false;
  }
  dateLessThan(from: string, to: string) {  
    return (group: FormGroup): {[key: string]: any} => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        this.dateErr.fromDateErr= true;
        
        this.isClaimSearchErr = false;
        // return {
        //   dates: "From Date should be greater than To Date"
        // }
      }
      else{
        
        this.dateErr.fromDateErr= false;
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
    this.isClaimResults = false;    
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
    
    this._claimReportService.getClaimReport(claimRequestObj).subscribe(
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
            this.isClaimResults = true;
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
        this.isClaimResults = false;

      } 
    );
   // this._claimReportService.getClaimReport("")
  }
  setClaimId(id: string){
    this._claimService.setClaimId(id);
    console.log("Id : "+id);
   // this.isClaimReportsHidden= true;
    this._route.navigate(['/claim']);
  }
  
}
