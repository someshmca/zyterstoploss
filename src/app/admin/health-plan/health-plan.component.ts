import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {
  ITire, IPlanAll, IPlanAdd, IPlanUpdate, IActiveClient,IContracts, IPlanTierChild
} from '../models/health-plan.model';
import { HealthPlanService } from '../services/health-plan.service';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {BehaviorSubject } from 'rxjs';
import { elementAt, first } from 'rxjs/operators';
import {Router} from '@angular/router'

import { AlertService } from '../services/alert.service';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/shared/services/login.service';
import { ProductService } from '../services/product.service';
import { ClientsService } from '../services/clients.service';
import {NavPopupService} from '../services/nav-popup.service';
import { IClientObj } from '../models/nav-popups.model';

@Component({
  selector: 'app-health-plan',
  templateUrl: './health-plan.component.html',
  styleUrls: ['./health-plan.component.css'],
  providers: [DatePipe]
})
export class HealthPlanComponent implements OnInit, AfterViewInit {

  plans: IPlanAll[] = [];
  public Tires: ITire[] = [];
  public activeClients: IActiveClient[]=[];
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
  locTires: ITire[] = [];
  locClients: IActiveClient[] = [];
  locClientName: string;
  addPlanObj: IPlanAdd;
  updatePlanObj: IPlanUpdate;
  searchInputValue: string='';
  tierObj={
    t1Amt:0, t2Amt:0, t3Amt:0, t4Amt:0
  };
  updatePlanID: number;
  isNoFactAmount: boolean = false;
  isDisabled: boolean;
  isAdded: boolean;
  @ViewChild("focusElem") focusTag: ElementRef;
  @ViewChild("filterSearchInput") filterSearchInput: ElementRef;
  tempPlanObj:IClientObj;

  displayedColumns: string[] = ['clientName', 'planCode', 'planName','planID'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientsService,
    private productService: ProductService,
    private planService: HealthPlanService,
    private loginService: LoginService,
    private alertService: AlertService,
    private datePipe: DatePipe,
    private navService:NavPopupService,
    private router:Router
  ) { }

  ngOnInit() {
    console.log(this.loginService.currentUserValue.emailID);
    this.alertService.clear();

    this.planForm = this.formBuilder.group({
      planID: 0,
      planCode:  ['', Validators.required],
      userId: '',
      planName:  ['', Validators.required],
      clientId: ['', Validators.required],
      contractId:['', Validators.required],
      tier1Aggfactamt: '',
      tier2Aggfactamt: '',
      tier3Aggfactamt: '',
      tier4Aggfactamt: '',
      familySpecificDeductible: '',
      status: true,
      isTerminalExtCoverage:false,
      lstTblPlanTier: this.formBuilder.array([
        {
          planId: 0,
          tierId: 0,
          tierAmount:0,
          expectedClaimsRate: 0
        }
      ])
    });
    this.isAdded=false;
    this.getTires();
    this.getAllPlans();
    this.getActiveClients();
    this.getPlanStatus();
    this.isStatusChecked = true;
  }
  
  ngAfterViewInit(){
  }
  
  getPlanStatus(){
    this.navService.planObj.subscribe((data)=>{
      this.tempPlanObj = data;
      if(data.isAdd){
        this.planForm.patchValue({
          clientId: data.clientId
        });
        this.planService.getContractsByClient(this.tempPlanObj.clientId).subscribe(
          (data)=>{
            this.activeContracts = data;    
          }
        )
        this.openCustomModal(true, null);
      }
      else if(data.isUpdate){          
        this.searchInputValue = data.clientName;
        setTimeout(()=>{
            this.filterSearchInput.nativeElement.focus();                  
         }, 1000);
      }
      else{     
        this.searchInputValue = '';
        this.filterSearchInput.nativeElement.blur(); 
        this.getAllPlans();
      }
    });   
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
  getTires(){

    this.planService.getTires().subscribe(
    (data)=>{
      this.Tires=data;
      for(let i=0;i<this.Tires.length;i++){
        this.locTires.push(this.Tires[i]);
      }
    }
    )
  }
  getActiveClients(){

    this.planService.getActiveClients().subscribe(
      (data)=>{
        data.sort((a, b) => (a.clientName > b.clientName) ? 1 : -1);
        this.activeClients = data;
        for(let i=0; i<this.activeClients.length; i++){
          this.locClients.push(this.activeClients[i]);
        }
      }
    )
  }

  getContractsByClient(event: Event){

    let selectElementText = event.target['options'][event.target['options'].selectedIndex].text;
    this.locClientName = selectElementText;
    let selectElementValue = event.target['options'][event.target['options'].selectedIndex].value;
    this.planService.getContractsByClient(selectElementValue).subscribe(
      (data)=>{
        this.activeContracts = data;

      }
    )
  }
  getContractsByClientOnUpdate(clienId){

    this.planService.getContractsByClient(clienId).subscribe(
      (data)=>{
        this.activeContracts = data;
        
      })
  }



  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  openCustomModal(open: boolean, elem:any) {
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100)
    this.submitted = false;
    this.isDisabled=false;
    if(open && elem==null){

      this.isAddMode = true;
      this.addPlanObj=null;
    }
    this.isCustomModalOpen = open;
    if (!open) {
      this.planForm.reset();
      this.getAllPlans();
      this.isAddMode = false;
      this.searchInputValue='';
      this.filterSearchInput.nativeElement.blur();
    }
    if(elem!=null){
      this.isAddMode = false;
      this.planI=elem.planID;

      this.tierObj={
        t1Amt:0, t2Amt:0, t3Amt:0, t4Amt:0
      };
      console.log(elem.lstTblPlanTier.length);
      for(let i=0;i<elem.lstTblPlanTier.length; i++){
        if(elem.lstTblPlanTier[i].tierId==1){
          this.tierObj.t1Amt=elem.lstTblPlanTier[i].tierAmount;
        }
        else if(elem.lstTblPlanTier[i].tierId==2){
          this.tierObj.t2Amt=elem.lstTblPlanTier[i].tierAmount;
        }
        else if(elem.lstTblPlanTier[i].tierId==3){
          this.tierObj.t3Amt=elem.lstTblPlanTier[i].tierAmount;
        }
        else if(elem.lstTblPlanTier[i].tierId==4){
          this.tierObj.t4Amt=elem.lstTblPlanTier[i].tierAmount;
        }
      }
      console.log(this.tierObj);
      //this.getContractsByClientOnUpdate(elem.clientId);
      this.planService.getContractsByClient(elem.clientId).subscribe(
        (data)=>{
          this.activeContracts = data;
            this.updatePlanID=elem.planID;
            this.planForm.patchValue({
              planID: this.updatePlanID,
              planCode: elem.planCode,
              userId: this.loginService.currentUserValue.name,
              planName: elem.planName,
              clientId: elem.clientId,
              contractId: elem.contractId,
              tier1Aggfactamt: this.tierObj.t1Amt==0?'':this.tierObj.t1Amt,
              tier2Aggfactamt: this.tierObj.t2Amt==0?'':this.tierObj.t2Amt,
              tier3Aggfactamt: this.tierObj.t3Amt==0?'':this.tierObj.t3Amt,
              tier4Aggfactamt: this.tierObj.t4Amt==0?'':this.tierObj.t4Amt,
              familySpecificDeductible: elem.familySpecificDeductible,
              status: elem.status==1?true:false,
              isTerminalExtCoverage: elem.isTerminalExtCoverage=='Y'?true:false,
            });
          
        })
        setTimeout(()=>{
        },1000);
        console.log(elem.isTerminalExtCoverage);
        console.log(this.planForm.value);
        
    }
  }


  fetchClientName(cName){

    this.locClientName = cName;
  }
  goBackPreviousNoFilter(){
    this.router.navigate(['/product']);
    this.navService.resetProductObj();
  }
  goBackPreviousScreen(){     
    if(this.isAdded){
      this.openCustomModal(false,null);
      this.searchInputValue = this.tempPlanObj.clientName;
      this.filterSearchInput.nativeElement.focus();
    }
    if(!this.isAdded){
      this.router.navigate(['/product']);
    }    
  }
  goBackCurrentScreen(){  
    if(this.tempPlanObj.isUpdate){
      
      this.openCustomModal(false,null);
      this.searchInputValue=this.tempPlanObj.clientName;
      setTimeout(()=>this.filterSearchInput.nativeElement.focus(),500);
    }
    else{
      this.openCustomModal(false,null);
    }
  }
  
  clearSearchInput(){
    this.searchInputValue='';
    this.filterSearchInput.nativeElement.focus();
  }
  // conven`ience getter for easy access to form fields
  get f() { return this.planForm.controls; }

  onSubmit() {
      this.submitted = true;
      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.planForm.invalid) {
          return;
      }
      let t1=this.f.tier1Aggfactamt.value==null?'':this.f.tier1Aggfactamt.value;
      let t2=this.f.tier2Aggfactamt.value==null?'':this.f.tier2Aggfactamt.value;
      let t3=this.f.tier3Aggfactamt.value==null?'':this.f.tier3Aggfactamt.value;
      let t4=this.f.tier4Aggfactamt.value==null?'':this.f.tier4Aggfactamt.value;
      
      if((t1=='' || t1==0) && (t2=='' || t2==0) && (t3=='' || t3==0) && (t4=='' || t4==0)){
        this.isNoFactAmount=true;
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
    this.isDisabled=true;
    this.isNoFactAmount=false;
    this.addPlanObj = {
      planID: 0,
      clientId: this.f.clientId.value,
      contractId: Number(this.f.contractId.value),
      userId: this.loginService.currentUserValue.name,
      planCode: this.f.planCode.value,
      planName: this.f.planName.value,
      clientName: this.locClientName,
      status: this.f.status.value==true?1:0,
      isTerminalExtCoverage: this.f.isTerminalExtCoverage.value==true?'Y':'N',
      lstTblPlanTier: []
    }
    
    if(this.f.tier1Aggfactamt.value!=null && this.f.tier1Aggfactamt.value!=''){
      let tAmount = Number(this.f.tier1Aggfactamt.value);
      let tId=1;
      this.addPlanObj.lstTblPlanTier.push({
        planId: 0, tierId: tId, tierAmount: tAmount, expectedClaimsRate: 0
      });
    }
    if(this.f.tier2Aggfactamt.value!=null && this.f.tier2Aggfactamt.value!=''){
      let tAmount = Number(this.f.tier2Aggfactamt.value);
      let tId=2;
      this.addPlanObj.lstTblPlanTier.push({
        planId: 0, tierId: tId, tierAmount: tAmount, expectedClaimsRate: 0
      });
    }
    if( this.f.tier3Aggfactamt.value!=null && this.f.tier3Aggfactamt.value!=''){
      let tAmount = Number(this.f.tier3Aggfactamt.value);
      let tId=3;
      this.addPlanObj.lstTblPlanTier.push({
        planId: 0, tierId: tId, tierAmount: tAmount, expectedClaimsRate: 0
      });
    }
    if(this.f.tier4Aggfactamt.value!=null && this.f.tier4Aggfactamt.value!=''){
      let tAmount = Number(this.f.tier4Aggfactamt.value);
      let tId=4;
      this.addPlanObj.lstTblPlanTier.push({
        planId: 0, tierId: tId, tierAmount: tAmount, expectedClaimsRate: 0
      });
    }
      console.log(this.addPlanObj);
      console.log(JSON.stringify(this.addPlanObj));

      this.planService.addPlan(this.addPlanObj)
          .pipe(first())
          .subscribe({
              next: () => {

                  this.planForm.reset();
                  this.openCustomModal(false, null);
                  //this.getAllPlans();
                  this.getTires();
                  this.getAllPlans();
                  this.getActiveClients();
                  this.isAdded=true;
                  this.alertService.success('New Plan & Tier added', { keepAfterRouteChange: true });
              },
              error: error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
          });
  }

  private updatePlan() {
    this.isDisabled=true;
    this.isNoFactAmount=false;
    this.updatePlanObj = {
      planID: this.updatePlanID,
      clientId: this.f.clientId.value,
      contractId: Number(this.f.contractId.value),
      userId: this.loginService.currentUserValue.name,
      planCode: this.f.planCode.value,
      planName: this.f.planName.value,
      clientName: this.locClientName,
      status: this.f.status.value==true?1:0,
      isTerminalExtCoverage: this.f.isTerminalExtCoverage.value==true?'Y':'N',
      lstTblPlanTier: []
    }


    if(this.f.tier1Aggfactamt.value!='' || this.f.tier1Aggfactamt.value!=null){
      let tAmount = Number(this.f.tier1Aggfactamt.value);
      let tId=1;
      this.updatePlanObj.lstTblPlanTier.push({
        planId: this.updatePlanID, tierId: tId, tierAmount: tAmount, expectedClaimsRate: 0
      });
    }
    if(this.f.tier2Aggfactamt.value!='' || this.f.tier2Aggfactamt.value!=null){
      let tAmount = Number(this.f.tier2Aggfactamt.value);
      let tId=2;
      this.updatePlanObj.lstTblPlanTier.push({
        planId: this.updatePlanID, tierId: tId, tierAmount: tAmount, expectedClaimsRate: 0
      });
    }
    if(this.f.tier3Aggfactamt.value!='' || this.f.tier3Aggfactamt.value!=null){
      let tAmount = Number(this.f.tier3Aggfactamt.value);
      let tId=3;
      this.updatePlanObj.lstTblPlanTier.push({
        planId: this.updatePlanID, tierId: tId, tierAmount: tAmount, expectedClaimsRate: 0
      });
    }
    if(this.f.tier4Aggfactamt.value!='' || this.f.tier4Aggfactamt.value!=null){
      let tAmount = Number(this.f.tier4Aggfactamt.value);
      let tId=4;
      this.updatePlanObj.lstTblPlanTier.push({
        planId: this.updatePlanID, tierId: tId, tierAmount: tAmount, expectedClaimsRate: 0
      });
    }

      console.log(this.updatePlanObj);

      this.planService.updatePlan(this.updatePlanObj)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.alertService.success('Plan & Tier updated', {
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
