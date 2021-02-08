import { Component, OnInit } from '@angular/core';
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
  noRecordFound: boolean = false;
  claimSearchForm: FormGroup;
  //responseClaimReport: Array<IClaimReportsModel>[];
  claimRequest: IClaimSearch;
  constructor(private fb: FormBuilder, 
    private _claimReportService: ClaimReportService, 
    private _claimService: ClaimService,
    private _route:Router,
    private alertService: AlertService,
    private datePipe: DatePipe ) {}

  ngOnInit() {
    this.claimSearchForm = this.fb.group({
      ClaimId: ['', Validators.required],
      MemberId:  ['', Validators.required],
      Fname:'',
      Lname:'',
      DateOfBirth:new Date('2020-10-29T13:50:37.249Z'),
      SupplierId: ['', Validators.required],
      SupplierName:'',
      ServiceDateFrom:new Date('2020-10-29T13:50:37.249Z'),
      ServiceDateTo:new Date('2020-10-29T13:50:37.249Z'),
      PractitionerId: ['', Validators.required],
      FirstName:'',
      LastName:''
    });
  }

  // conven`ience getter for easy access to form fields
  get f() { return this.claimSearchForm.controls; }
  // formData: any = new FormData();
  // formData.append("name", this.claimSearchForm.get('ClaimId').value);
  // formData.append("avatar", this.form.get('avatar').value);

  // this.http.post('http://localhost:4000/api/create-user', formData).subscribe(
  //   (response) => console.log(response),
  //   (error) => console.log(error)
  // )
  onSubmit(form: FormGroup) {
    this.submitted = true;
    console.log('Valid?', form.valid); // true or false

    console.log('Claim Id : ', typeof(this.claimSearchForm.get('ClaimId').value));
    console.log('Member Id : ', this.claimSearchForm.get('MemberId').value);
    console.log('Supplier Name : ', form.value.SupplierName);


    this.claimRequest = {
      ClaimId: this.claimSearchForm.get('ClaimId').value ,
      MemberId: this.claimSearchForm.get('MemberId').value,
      Fname:this.claimSearchForm.get('Fname').value,
      Lname:this.claimSearchForm.get('Lname').value,
      DateOfBirth:this.claimSearchForm.get('DateOfBirth').value,
      SupplierId:this.claimSearchForm.get('SupplierId').value,
      SupplierName:this.claimSearchForm.get('SupplierName').value,
      ServiceDateFrom:this.claimSearchForm.get('ServiceDateFrom').value,
      ServiceDateTo:this.claimSearchForm.get('ServiceDateTo').value,
      PractitionerId:this.claimSearchForm.get('PractitionerId').value,
      FirstName:this.claimSearchForm.get('FirstName').value,
      LastName:this.claimSearchForm.get('LastName').value
    };
    const headers = { 'content-type': 'application/json'};
    // this.claimRequest= form.value;
    console.log("claim request "+this.claimRequest);
   // debugger;
    this._claimReportService.getClaimReport((this.claimRequest)).subscribe(
      (data) => {
        console.log("data : "+data);      
        this._claimReportService.setClaimResults(data);
        this._route.navigate(['/claim-result']);
        console.log("Calim Response data : "+data);
        this.noRecordFound = false;
        //debugger;
      },
      (error) => {
        this.noRecordFound = true;
      } 
    );
   // this._claimReportService.getClaimReport("")
  }
  
}
