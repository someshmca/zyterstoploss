import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  IBenefit, IBenefitIDRequest,
  IBenefitAdd, IAddBenefitSuccess,
  IBenefitUpdate, IUpdateBenefitSuccess
} from '../models/benefits-model';
import { BenefitService } from '../services/benefit.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { first } from 'rxjs/operators';

import { AlertService } from '../services/alert.service';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/shared/services/login.service';


@Component({
  selector: 'app-benefits',
  templateUrl: './benefits.component.html',
  styleUrls: ['./benefits.component.css'],
  providers: [DatePipe]
})
export class BenefitsComponent implements OnInit{

  benefits: IBenefit[] = [];
  benefitIDs: IBenefit[] = [];
  benefit: IBenefitIDRequest;
  rowData: any;
  isCustomModalOpen: boolean = false;
  benefitForm: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  
  createid: '';
  createdOn: '';
  updateid: ''; 
  lastupdate: '';

  @ViewChild("focusElem") focusTag: ElementRef;

  displayedColumns: string[] = ['benefitId', 'description', 'code', 'codeType', 'updateid'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private formBuilder: FormBuilder,
    private benefitService: BenefitService,
    private loginService: LoginService,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    console.log(this.loginService.currentUserValue.name);
    
    this.getAllBenefits();
    this.benefitForm = this.formBuilder.group({
      benefitId: "",
      description: ['', Validators.required],
      code: ['', Validators.required],
      codeType: ['', Validators.required],
      createid: '',
      createdOn: '',
      updateid: '',
      lastupdate: ''    
    });
  }
  
  getAllBenefits() {
    this.benefitService.getAllBenefits().subscribe(
      (data: IBenefit[]) => {
        this.benefitIDs = data;
        this.benefits = data;
        //this.rowData = this.benefits;
        this.dataSource = new MatTableDataSource(this.benefits);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;        
      }
    )
  }
  
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  openCustomModal(open: boolean, id:string) {
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100)
    this.submitted = false;
    if(open && id==null){
      this.isAddMode = true;
    }
    this.isCustomModalOpen = open;
    if (!open) {
      this.benefitForm.reset();
      this.getAllBenefits();
      this.isAddMode = false;
    }
    console.log("id inside modal: "+id);
    
    if(id!=null){
      this.isAddMode = false;
      this.benefitService.getBenefit(id).subscribe(x => {
        console.log(x[0].benefitId);
            this.benefitForm.patchValue({
              benefitId: x[0].benefitId,
              description: x[0].description,
              code: x[0].code,
              codeType: x[0].codeType,
              createid: this.loginService.currentUserValue.name,
              createdOn: this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd'),
              updateid: this.loginService.currentUserValue.name,
              lastupdate: this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd') 
            });
          }
        );
    }
  }

  // conven`ience getter for easy access to form fields
  get f() { return this.benefitForm.controls; }

  onSubmit() {
      this.submitted = true;
      console.log("isAddMode : "+this.isAddMode);
      console.log("submitted "+this.submitted);
      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.benefitForm.invalid) {
          return;
      }

      this.loading = true;
      if (this.isAddMode) {
          this.addBenefit();
      } else {
          this.updateBenefit();
      }
  }

  private addBenefit() {
    
    this.benefitForm.patchValue({
      createid: this.loginService.currentUserValue.name,
      createdOn: this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd'),
      updateid: this.loginService.currentUserValue.name,
      lastupdate: this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd') 
    });
    
      this.benefitService.addBenefit(this.benefitForm.value)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.openCustomModal(false, null);
                  this.getAllBenefits();
                  this.benefitForm.reset();
                  this.alertService.success('New Benefit added', { keepAfterRouteChange: true });
              },
              error: error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
          });
  }

  private updateBenefit() {
    
      this.benefitService.updateBenefit(this.benefitForm.value)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.alertService.success('Benefit updated', { 
                    keepAfterRouteChange: true });
                    this.openCustomModal(false,null); 
                    this.benefitForm.reset();
              },
              error: error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
          });
  }
}
