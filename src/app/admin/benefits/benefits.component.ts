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

  displayedColumns: string[] = ['benefitId', 'description', 'code', 'codeType', 'updateid'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private formBuilder: FormBuilder,
    private benefitService: BenefitService,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    this.getAllBenefits();
    this.benefitForm = this.formBuilder.group({
      benefitId: "",
      description: ['', Validators.required],
      code: ['', Validators.required],
      codeType: ['', Validators.required],
      createid: "ash",
      createdOn: ["2021-01-01"],
      updateid: "som",
      lastupdate: new Date("2020-12-11")
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
    this.submitted = false;
    if(open && id==null){
      this.isAddMode = true;
    }
    this.isCustomModalOpen = open;
    if (!open) {
      this.benefitForm.reset();
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
              codeType: x[0].codeType  
            });
          }
        );
    }
  }

  // conven`ience getter for easy access to form fields
  get f() { return this.benefitForm.controls; }

  onSubmit() {
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.benefitForm.invalid) {
          return;
      }

      this.loading = true;
      ;
      if (this.isAddMode) {
          this.addBenefit();
      } else {
          this.updateBenefit();
      }
  }

  private addBenefit() {
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
                    this.getAllBenefits();
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
