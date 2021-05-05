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
  dateErr = {
    fromDateErr: false,
    fromDateInvalid: false,
    toDateInvalid: false
  };
  dateErrorMessage: string = '';
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
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100)
    this.f.fromDate.valueChanges.subscribe((data)=>{
      
    })
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
  get f() { return this.claimSearchForm.controls; }
  onSubmit(form: FormGroup) {
    console.log(this.dateErr.fromDateErr); 

    this.submitted = true;
    this.dateErr.fromDateInvalid=false;
    this.dateErr.toDateInvalid=false;
    this.dateErrorMessage='';
    if(this.claimSearchForm.invalid){
      this.dateErrorMessage='';
      if(this.dateErr.fromDateErr)  
        this.dateErrorMessage = "From date should not be greater than To date";
      return;
    }
   // if((this.f.fromDate.valid && this.f.fromDate.value!=null) && (this.f.toDate.value!=null && this.f.toDate.valid ))
   
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
    if(this.f.memberId.value=='' && this.f.firstName.value=='' && this.f.lastName.value=='' && this.f.dateOfBirth.value==null && this.f.claimId.value=='' && this.f.fromDate.value==null && this.f.toDate.value==null){
      
      this.isClaimSearchErr = true;
      return;
    }
    const headers = { 'content-type': 'application/json'};
    // this.claimSearchForm.patchValue({
    //   DateOfBirth:'0001-01-01',
    //   ServiceDateFrom: '0001-01-01',
    //   ServiceDateTo: '0001-01-01'      
    // })
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
    debugger;
    this._claimReportService.getClaimReport(claimRequestObj).subscribe(
      (data) => {
        this.isClaimSearchErr=false;
        this.dateErr.fromDateErr= false;
        this.dateErr.fromDateInvalid=false;
        this.dateErr.toDateInvalid=false;
        this.dateErrorMessage='';
        console.log("data : "+data);      
        this._claimReportService.setClaimResults(data);
        this._route.navigate(['/claim-result']);
        console.log("Calim Response data : "+data);
      },
      (error) => {
      } 
    );
   // this._claimReportService.getClaimReport("")
  }
  
}
