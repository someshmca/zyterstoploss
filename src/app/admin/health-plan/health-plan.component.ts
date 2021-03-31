import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  IPlanTires, IPlanAll, IPlanAdd, IPlanUpdate, IActiveClient,IContracts
} from '../models/health-plan.model';
import { HealthPlanService } from '../services/health-plan.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { elementAt, first } from 'rxjs/operators';

import { AlertService } from '../services/alert.service';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/shared/services/login.service';


@Component({
  selector: 'app-health-plan',
  templateUrl: './health-plan.component.html',
  styleUrls: ['./health-plan.component.css'],
  providers: [DatePipe]
})
export class HealthPlanComponent implements OnInit {
  
  plans: IPlanAll[] = [];
  planTires: IPlanTires[] = [];
  activeClients: IActiveClient[]=[];
  rowData: any;
  isCustomModalOpen: boolean = false;
  planForm: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  activeContracts: IContracts[]=[];
  planI:number;
  isStatusChecked: boolean = false;
  
  

  @ViewChild("focusElem") focusTag: ElementRef;

  displayedColumns: string[] = ['clientName', 'planCode', 'planName', 'planID'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private formBuilder: FormBuilder,
    private planService: HealthPlanService,
    private loginService: LoginService,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    console.log(this.loginService.currentUserValue.emailID);
    
    this.getAllPlans();
    this.getPlanTires();
    this.getActiveClients();
    this.getClientByContract(null);
    this.planForm = this.formBuilder.group({
      planId: 0,
      planCode:  ['', Validators.required],
      userId: '',
      planName:  ['', Validators.required],
      clientId: '',
      contractId:0,
      tier1Aggfactamt: 0,
      tier2Aggfactamt: 0,
      tier3Aggfactamt: 0,
      tier4Aggfactamt: 0,
      familySpecificDeductible: 0,
      status: 1,
      isTerminalExtCoverage: ''
    });
    this.isStatusChecked = true;
  }
  
  getAllPlans() {
    this.planService.getAllPlans().subscribe(
      (data: IPlanAll[]) => {
        this.plans = data;
        //this.rowData = this.benefits;
        this.dataSource = new MatTableDataSource(this.plans);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;        
      }
    )
  }
  getPlanTires(){
    this.planService.getPlanTires().subscribe(
    (data)=>{
      this.planTires=data;
    }
    )
  }
  getActiveClients(){
    
    this.planService.getActiveClients().subscribe(
      (data)=>{
        
        this.activeClients = data;
      }
    )
  }

  getClientByContract(clientId){ 
    
    this.planService.getClientByContract(clientId).subscribe(
      (data)=>{
        
        this.activeContracts = data;
      }
    )
  }

  
  
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  openCustomModal(open: boolean, elem:any) {
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100)
    this.submitted = false;
    if(open && elem==null){
      this.isAddMode = true;
    }
    this.isCustomModalOpen = open;
    if (!open) {
      this.planForm.reset();
      this.getAllPlans();
      this.isAddMode = false;
    }
    if(elem!=null){
      this.isAddMode = false;
      this.planI=elem.planID,
        this.planForm.patchValue({
          planId: elem.planID,
          planCode: elem.planCode,
          userId: this.loginService.currentUserValue.emailID,
          planName: elem.planName,
          clientId: elem.clientId,
          contractId: elem.contractId,
          tier1Aggfactamt: elem.tier1Aggfactamt,
          tier2Aggfactamt: elem.tier2Aggfactamt,
          tier3Aggfactamt: elem.tier3Aggfactamt,
          tier4Aggfactamt: elem.tier4Aggfactamt,
          familySpecificDeductible: elem.familySpecificDeductible,
          status: true,
          isTerminalExtCoverage: elem.isTerminalExtCoverage
        });
        this.getClientByContract(String(this.planForm.get('clientId').value));

        //this.planId=this.planId;
    }
  }

  // conven`ience getter for easy access to form fields
  get f() { return this.planForm.controls; }

  onSubmit() {
      this.submitted = true;
      console.log("isAddMode : "+this.isAddMode);
      console.log("submitted "+this.submitted);
      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.planForm.invalid) {
          return;
      }

      this.loading = true;
      if (this.isAddMode) {
          this.addPlan();
      } else {
          this.updatePlan();
      }
  }

  private addPlan() {

    this.planForm.patchValue({
      userId:this.loginService.currentUserValue.name,
      status:1,
      isTerminalExtCoverage:'Y',
      contractId:Number(this.planForm.get('contractId').value),
      planId:0
    });
    
      this.planService.addPlan(this.planForm.value)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.openCustomModal(false, null);
                  this.getAllPlans();
                  this.planForm.reset();
                  this.alertService.success('New Plan added', { keepAfterRouteChange: true });
              },
              error: error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
          });
  }

  private updatePlan() {
      this.planForm.patchValue({
      userId:this.loginService.currentUserValue.name,
      status:1,
      planId:this.planI,
      contractId:Number(this.planForm.get('contractId').value),

    });
      this.planService.updatePlan(this.planForm.value)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.alertService.success('Plan updated', { 
                    keepAfterRouteChange: true });
                    this.openCustomModal(false,null); 
                    this.planForm.reset();
              },
              error: error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
          });
  }

}
