import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import {
  ITire, IPlanAll, IPlanAdd, IPlanUpdate, IActiveClient,IContracts, IPlanTierChild, ITierObj
} from '../models/health-plan.model';
import { HealthPlanService } from '../services/health-plan.service';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {BehaviorSubject } from 'rxjs';
import { elementAt, first } from 'rxjs/operators';
import {Router} from '@angular/router'

import { combineLatest } from 'rxjs'; //(V.E 27-Jul-2021 )
import { AlertService } from '../services/alert.service';
import { DatePipe } from '@angular/common';
import { LoginService } from 'src/app/shared/services/login.service';
import {NavPopupService} from '../services/nav-popup.service';
import { IClientObj } from '../models/nav-popups.model';
import { ContractService } from '../services/contract.service';

@Component({
  selector: 'app-health-plan',
  templateUrl: './health-plan.component.html',
  styleUrls: ['./health-plan.component.css'],
  providers: [DatePipe]
})
export class HealthPlanComponent implements OnInit, AfterViewInit {

  plans: IPlanAll[] = [];
  tires: ITire[] = [];
  locTires: ITire[] = [];
  activeClients: IActiveClient[]=[];
  rowData: any;
  isCustomModalOpen: boolean = false;
  planForm: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  contractsByClientId: IContracts[]=[];
  planI:number;
  isStatusChecked: boolean = false;
  locClients: IActiveClient[] = [];
  locClientName: string;
  addPlanObj: IPlanAdd;
  updatePlanObj: IPlanUpdate;
  searchInputValue: string='';
  tierObj:ITierObj;
  updatePlanID: number;
  isNoFactAmount: boolean = false;
  isDisabled: boolean;
  isAdded: boolean;
  isFilterOn: boolean = false;
  planIdStatus;//(V.E 27-Jul-2021 )
  uPlanName;//(V.E 27-Jul-2021 )
  uplanId;//(V.E 27-Jul-2021 )
  planIdErr={isDuplicate: false, errMsg:''}; //(V.E 27-Jul-2021 )
  planNameErr={isDuplicate: false, errMsg:''};//(V.E 27-Jul-2021 )
  @ViewChild("focusElem") focusTag: ElementRef;
  @ViewChild("filterSearchInput") filterSearchInput: ElementRef;
  tempPlanObj:IClientObj;
  isViewModal: boolean;
  isAdmin: boolean;
  displayedColumns: string[] = ['clientName', 'planCode', 'planName','planID'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    private contractService: ContractService,
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
      clientId: ['', Validators.required],
      contractId:['', Validators.required],
      userId: '',
      planCode:  ['', Validators.required],
      planName:  ['', Validators.required],
      contractYear: [''],
      clientName: '',
      status: 1,
      factor1: '',
      factor2: '',
      factor3: '',
      factor4: '',
      expectedClaims1: [''],
      expectedClaims2: [''],
      expectedClaims3: [''],
      expectedClaims4: [''],
      isTerminalExtCoverage:'',
      lstTblPlanTier: [{
          planId: 0,
          tierId: 0,
          tierAmount:0,
          expectedClaimsRate: 0
        }
      ]
    });
    this.isAdded=false;
    //this.initLocalTires();
    this.initTierObj();
    this.getAllPlans();
    this.getTires();
    this.getActiveClients();
    this.getPlanStatus();
    this.isStatusChecked = true;
    this.loginService.getLoggedInRole();
    this.isAdmin = this.loginService.isAdmin;
  }
  
  ngAfterViewInit(){
  }
  isValidYear: boolean=true;
  isYear(){
    let num1 = /^([0-9]+)$/; 
    let a1=num1.test(this.f.contractYear.value);
    if(!a1 && this.f.contractYear.value.length>0){
      this.isValidYear=false;
    }
    if(this.f.contractYear.value<1900 && this.f.contractYear.value>2999){
      this.isValidYear=false;
    }
    else{
      this.isValidYear=true;
    } 
  }
  getPlanStatus(){
    this.navService.planObj.subscribe((data)=>{
      this.tempPlanObj = data;
      ;
      if(data.isAdd){
        this.planForm.patchValue({
          clientId: data.clientId
        });
        this.getContractsByClientID(this.tempPlanObj.clientId);
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
      this.tires=data;
    //  this.locTires=this.tires;
      
       for(let i=0;i<this.tires.length;i++){
         this.locTires.push(this.tires[i]);        
       }
       console.log(this.locTires);
       
    });
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

  getContractsByClientID(clientId){
    this.contractService.getContractsByClientID(clientId).subscribe((data)=>{
      data.sort((x,y) => x.contractId - y.contractId);
      this.contractsByClientId = data;      
      
      this.planForm.patchValue({
        contractId: this.contractsByClientId[0].contractId
      })
      console.log(this.planForm.value);
    })
  }
initLocalTires(){
  this.locTires=[
    {
      tierId: 0,
      tierName: '',
      status: 1
    },
    {
      tierId: 0,
      tierName: '',
      status: 1
    },
    {
      tierId: 0,
      tierName: '',
      status: 1
    },
    {
      tierId: 0,
      tierName: '',
      status: 1
    }
  ]
}
initTierObj(){  
  this.tierObj={
    factor1:0,
    factor2:0, 
    factor3:0, 
    factor4:0, 
    expectedClaims1:0,
    expectedClaims2:0, 
    expectedClaims3:0, 
    expectedClaims4:0 
  }
}
//(V.E 27-Jul-2021 starts)
checkDuplicatePlanName(PName){
  return this.planService.checkDuplicatePlanName(PName).toPromise();
}

async checkDuplicatePlanId(PId){
  const promise = this.planService.checkDuplicatePlanId(PId).toPromise();
  promise.then((data)=>{
    console.log("Promise resolved with: " + data);
    this.planIdStatus = data;
    
      if(this.planIdStatus>0){
        this.planIdErr.isDuplicate=true;
        this.planIdErr.errMsg='The Plan Id '+this.f.planCode.value+' already exists. Please enter different Plan Id';
        return;
      }
    

  }).catch((error)=>{
    console.log("Promise rejected with " + JSON.stringify(error));
  });
}
clearErrorMessages(){
  this.planIdErr.isDuplicate=false;
  this.planIdErr.errMsg='';
  this.planNameErr.isDuplicate=false;
  this.planNameErr.errMsg='';
}
//(V.E 27-Jul-2021 Ends)
doFilter(filterValue:string){ //added by Venkatesh Enigonda
  this.dataSource.filter=filterValue.trim().toLowerCase();
  this.dataSource.filterPredicate = (data:IPlanAll, filter: string) => {
    const Id=data.planID.toString();
    const CompareData=data.clientName.toLowerCase() ||'';
    const CompareData1=Id||'';
    const CompareData2=data.planName.toLowerCase() ||'';
    return CompareData.indexOf(filter)!==-1|| CompareData1.indexOf(filter)!==-1|| CompareData2.indexOf(filter)!==-1
  };

}//Ends here

  openViewModal(bool, id:any){
    this.isViewModal = true;
    this.openCustomModal(bool, id);
  }
  openCustomModal(open: boolean, elem:any) {
    this.alertService.clear();
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100)
    this.submitted = false;
    this.isDisabled=false;
    if(open && elem==null){

      this.isAddMode = true;
      this.isFilterOn=false;
      this.addPlanObj=null;
    }
    this.isCustomModalOpen = open;
    if (!open && elem==null) {
      this.planForm.reset();
      this.getAllPlans();
      this.isAddMode = false;
      this.isAdded=false;
      this.isViewModal=false;
      if(!this.isFilterOn){
        this.navService.resetPlanObj();
        this.clearSearchInput();
      }
    }
    if(open && elem!=null){
      this.isFilterOn=false;      
      this.isAddMode = false;
      // let plansAll = this.plans;
      // let uPlan = plansAll.filter((obj)=>{
      //   return obj.planID == elem.planID;
      // })
      // console.log("uPlan "+ uPlan);
      // 

      //(V.E 27-Jul-2021 starts )
      console.log(this.uPlanName=elem.planName);
      this.uPlanName=elem.planName;
      console.log(this.uplanId=elem.planCode);
      this.uplanId=elem.planCode;
      //(V.E 27-Jul-2021 Ends )
      this.planI=elem.planID;

      console.log(elem.lstTblPlanTier.length);
      
      for(let i=0;i<elem.lstTblPlanTier.length; i++){
        if(elem.lstTblPlanTier[i].tierId==1){          
          this.tierObj.factor1=elem.lstTblPlanTier[i].tierAmount;
          this.tierObj.expectedClaims1=elem.lstTblPlanTier[i].expectedClaimsRate;
        }
        else if(elem.lstTblPlanTier[i].tierId==2){
          this.tierObj.factor2=elem.lstTblPlanTier[i].tierAmount;
          this.tierObj.expectedClaims2=elem.lstTblPlanTier[i].expectedClaimsRate;
        }
        else if(elem.lstTblPlanTier[i].tierId==3){
          this.tierObj.factor3=elem.lstTblPlanTier[i].tierAmount;
          this.tierObj.expectedClaims3=elem.lstTblPlanTier[i].expectedClaimsRate;
        }
        else if(elem.lstTblPlanTier[i].tierId==4){
          this.tierObj.factor4=elem.lstTblPlanTier[i].tierAmount;
          this.tierObj.expectedClaims4=elem.lstTblPlanTier[i].expectedClaimsRate;
        }
      }
      this.updatePlanID = elem.planID;
      
      this.getContractsByClientID(elem.clientId);
      this.planForm.patchValue({
        planID: elem.planID,
        clientId: elem.clientId,
        contractId: elem.contractId,
        userId: this.loginService.currentUserValue.name,
        planCode: elem.planCode,
        planName: elem.planName,
        contractYear: elem.contractYear,
        clientName: elem.clientName,
        status: elem.status,
        isTerminalExtCoverage: elem.isTerminalExtCoverage=='Y'?true:false,
        factor1: this.tierObj.factor1==0?'':this.tierObj.factor1,
        factor2: this.tierObj.factor2==0?'':this.tierObj.factor2,
        factor3: this.tierObj.factor3==0?'':this.tierObj.factor3,
        factor4: this.tierObj.factor4==0?'':this.tierObj.factor4,
        expectedClaims1: this.tierObj.expectedClaims1,
        expectedClaims2: this.tierObj.expectedClaims2,
        expectedClaims3: this.tierObj.expectedClaims3,
        expectedClaims4: this.tierObj.expectedClaims4,          
      });
      if(this.isViewModal==true){
        this.planForm.disable();
      }
      else{
        this.planForm.enable();
      }
      console.log(this.tierObj);
      console.log(this.planForm.value);
      
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
      this.isFilterOn=true;
      this.openCustomModal(false,null);
      this.searchInputValue = this.tempPlanObj.clientName;
      ;
      setTimeout(()=>this.filterSearchInput.nativeElement.blur(),500);
      setTimeout(()=>this.filterSearchInput.nativeElement.focus(),1000);
    }
    else{
      this.router.navigate(['/product']);
    }    
  }
  goBackCurrentScreen(){  
    this.isFilterOn=true;
    if(this.tempPlanObj.isUpdate){
      
      this.openCustomModal(false,null);
      this.searchInputValue=this.tempPlanObj.clientName;
      setTimeout(()=>this.filterSearchInput.nativeElement.blur(),500);
      setTimeout(()=>this.filterSearchInput.nativeElement.focus(),1000);
    }
    else{
      this.openCustomModal(false,null);
      this.searchInputValue=this.tempPlanObj.clientName;
      setTimeout(()=>this.filterSearchInput.nativeElement.blur(),500);
      setTimeout(()=>this.filterSearchInput.nativeElement.focus(),1000);
    }
  }
  
  clearSearchInput(){
    this.searchInputValue='';
    this.filterSearchInput.nativeElement.value='';
    this.filterSearchInput.nativeElement.focus();
    this.getAllPlans();
  }
  // conven`ience getter for easy access to form fields
  get f() { return this.planForm.controls; }

  onSubmit() {
    this.clearErrorMessages();//(V.E 27-Jul-2021 )
      this.submitted = true;
      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.planForm.invalid) {
          return;
      }
      let t1=this.f.factor1.value==null?'':this.f.factor1.value;
      let t2=this.f.factor2.value==null?'':this.f.factor2.value;
      let t3=this.f.factor3.value==null?'':this.f.factor3.value;
      let t4=this.f.factor4.value==null?'':this.f.factor4.value;
      
      if((t1=='' || t1==0) && (t2=='' || t2==0) && (t3=='' || t3==0) && (t4=='' || t4==0)){
        this.isNoFactAmount=true;
        return;
      } //(V.E 27-Jul-2021 starts )
      if(this.planForm.valid){
        if(this.isAddMode){
          const pid= this.planService.checkDuplicatePlanId(this.f.planCode.value);
          const pname = this.planService.checkDuplicatePlanName(this.f.planName.value);
          const connectStream = combineLatest([pid, pname]);
          connectStream.subscribe(
            ([id,name]) => {
              console.log('plan Id : '+id);
              console.log('plan Namem : '+name);
              if(id>0 && name>0){
                this.planIdErr.isDuplicate=true;
                this.planNameErr.isDuplicate=true;
                this.planIdErr.errMsg="Plan Name "+this.f.planName.value +" and Plan ID "+this.f.planCode.value+" already exists";
                return;
              }
              if(id>0){
                this.planIdErr.isDuplicate=true;
                this.planIdErr.errMsg="Plan ID "+this.f.planCode.value +" already exists";
                return;
              }
              if(name>0){
                this.planNameErr.isDuplicate=true;
                this.planNameErr.errMsg="Plan Name "+this.f.planName.value+" already exists";
                return;
              }
              
              this.addPlan();

            });
        }

      }
     
      
      this.loading = true;
      if(!this.isAddMode){
        const pid= this.planService.checkDuplicatePlanId(this.f.planCode.value);
        const pname = this.planService.checkDuplicatePlanName(this.f.planName.value);
        const connectStream = combineLatest([pid, pname]);
        connectStream.subscribe(
          ([id,name]) => {
            console.log('plan Id : '+id);
            console.log('plan Namem : '+name);
            if((this.uplanId.toLowerCase()!==this.f.planCode.value.toLowerCase())&& (this.uPlanName.toLowerCase()!==this.f.planName.value.toLowerCase()))
            {
            if(id>0 && name>0){
              this.planIdErr.isDuplicate=true;
              this.planNameErr.isDuplicate=true;
              this.planIdErr.errMsg="Plan Name "+this.f.planName.value +" and Plan ID "+this.f.planCode.value+" already exists";
              return;
            }
          }
            if(this.uplanId.toLowerCase()!==this.f.planCode.value.toLowerCase())
            {
            if(id>0){
              this.planIdErr.isDuplicate=true;
              this.planIdErr.errMsg="Plan ID "+this.f.planCode.value +" already exists.Please enter different Plan Id";
              return;
            }
          }
          if(this.uPlanName.toLowerCase()!==this.f.planName.value.toLowerCase())
            {
            if(name>0){
              this.planNameErr.isDuplicate=true;
              this.planNameErr.errMsg="Plan Name "+this.f.planName.value+" already exists.Please enter different Plan Name";
              return;
            }
          }
            
            this.updatePlan();

          });
        }
          


        

       }//(V.E 27-Jul-2021 Ends)

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
      contractYear: this.f.contractYear.value,
      clientName: this.locClientName,
      status: this.f.status.value==true?1:0,
      isTerminalExtCoverage: this.f.isTerminalExtCoverage.value==true?'Y':'N',
      lstTblPlanTier: []
    }
    let date=new Date();
    if(this.f.factor1.value!=null && this.f.factor1.value!=''){
      this.addPlanObj.lstTblPlanTier.push({
        planId: 0, 
        tierId: 1, 
        tierAmount: Number(this.f.factor1.value), 
        expectedClaimsRate: Number(this.f.expectedClaims1.value)
      });
    }
    if(this.f.factor2.value!=null && this.f.factor2.value!=''){
      this.addPlanObj.lstTblPlanTier.push({
        planId: 0, 
        tierId: 2, 
        tierAmount: Number(this.f.factor2.value), 
        expectedClaimsRate: Number(this.f.expectedClaims2.value)
      });
    }
    if(this.f.factor3.value!=null && this.f.factor3.value!=''){
      this.addPlanObj.lstTblPlanTier.push({
        planId: 0, 
        tierId: 3, 
        tierAmount: Number(this.f.factor1.value), 
        expectedClaimsRate: Number(this.f.expectedClaims3.value)
      });
    }
    if(this.f.factor4.value!=null && this.f.factor4.value!=''){
      this.addPlanObj.lstTblPlanTier.push({
        planId: 0, 
        tierId: 4, 
        tierAmount: Number(this.f.factor4.value), 
        expectedClaimsRate: Number(this.f.expectedClaims4.value)
      });
    }
      console.log(this.addPlanObj);
      console.log(JSON.stringify(this.addPlanObj));

      this.planService.addPlan(this.addPlanObj)
          .pipe(first())
          .subscribe({
              next: () => {
                  //this.planForm.reset();
                  //this.openCustomModal(false, null);
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
    console.log(this.updatePlanID);
    this.planForm.patchValue(this.planForm.value)
    
    this.updatePlanObj = {
      planID: this.updatePlanID,
      clientId: this.f.clientId.value,
      contractId: Number(this.f.contractId.value),
      userId: this.loginService.currentUserValue.name,
      planCode: this.f.planCode.value,
      planName: this.f.planName.value,
      contractYear: this.f.contractYear.value,
      clientName: this.locClientName,
      status: this.f.status.value==true?1:0,
      isTerminalExtCoverage: this.f.isTerminalExtCoverage.value==true?'Y':'N',
      lstTblPlanTier: []
    }


    if(this.f.factor1.value!=null && this.f.factor1.value!=''){
      this.updatePlanObj.lstTblPlanTier.push({
        planId: this.updatePlanID, 
        tierId: 1, 
        tierAmount: Number(this.f.factor1.value), 
        expectedClaimsRate: Number(this.f.expectedClaims1.value)
      });
    }
    if(this.f.factor2.value!=null && this.f.factor2.value!=''){
      this.updatePlanObj.lstTblPlanTier.push({
        planId: this.updatePlanID, 
        tierId: 2, 
        tierAmount: Number(this.f.factor2.value), 
        expectedClaimsRate: Number(this.f.expectedClaims2.value)
      });
    }
    if(this.f.factor3.value!=null && this.f.factor3.value!=''){
      this.updatePlanObj.lstTblPlanTier.push({
        planId:this.updatePlanID, 
        tierId: 3, 
        tierAmount: Number(this.f.factor1.value), 
        expectedClaimsRate: Number(this.f.expectedClaims3.value)
      });
    }
    if(this.f.factor4.value!=null && this.f.factor4.value!=''){
      this.updatePlanObj.lstTblPlanTier.push({
        planId: this.updatePlanID, 
        tierId: 4, 
        tierAmount: Number(this.f.factor4.value), 
        expectedClaimsRate: Number(this.f.expectedClaims4.value)
      });
    }

      console.log(this.updatePlanObj);

      this.planService.updatePlan(this.updatePlanObj)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.alertService.success('Plan & Tier updated', {
                    keepAfterRouteChange: true });
                    this.getAllPlans();
                    this.uPlanName=''; //(V.E 27-Jul-2021 )
                    this.uplanId=''//(V.E 27-Jul-2021 )
                    //this.openCustomModal(false,null);
                    //this.planForm.reset();
              },
              error: error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
          });
  }
}
