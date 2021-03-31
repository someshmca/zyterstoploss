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
  @ViewChild("focusElem") focusTag: ElementRef;
  constructor(private fb: FormBuilder, 
    private _claimReportService: ClaimReportService, 
    private _claimService: ClaimService,
    private _route:Router,
    private alertService: AlertService,
    private datePipe: DatePipe ) {}

  ngOnInit() {
    this.claimSearchForm = this.fb.group({
      ClaimId: [''],
      memberId:  [''],
      Fname:'',
      Lname:'',
      DateOfBirth:['0001-01-01'],
      SupplierId: [''],
      SupplierName:'',
      ServiceDateFrom:['0001-01-01'],
      ServiceDateTo: ['0001-01-01'],
      PractitionerId: [''],
      FirstName:'',
      LastName:''
    });
    this.maxDate = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd');
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100)
  }
  // setMaxDate(): string{
  //     return new Date().toISOString().split('T')[0];
  //  }
  // conven`ience getter for easy access to form fields
  get f() { return this.claimSearchForm.controls; }
  onSubmit(form: FormGroup) {
    this.submitted = true;
   // console.log('Valid?', form.valid); // true or false

    console.log('Claim Id : ', typeof(this.claimSearchForm.get('ClaimId').value));
    console.log('Member Id : '+ this.claimSearchForm.get('memberId').value);
    console.log('Supplier Name : ', form.value.SupplierName);
    console.log(" search form value : "+this.claimSearchForm.value);
    debugger;
    const headers = { 'content-type': 'application/json'};
    this._claimReportService.getClaimReport(this.claimSearchForm.value).subscribe(
      (data) => {
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
