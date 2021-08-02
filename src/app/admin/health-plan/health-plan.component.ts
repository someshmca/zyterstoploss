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
  isAddTier: boolean;
  tiersLimitExceeded={
    flag: false,
    value: ''
  } 
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
      lstTblPlanTier: new FormArray([])
      
    });
    this.isAdded=false;
    //this.initLocalTires();
    this.getAllPlans();
    this.getTires();
    this.getActiveClients();
    this.getPlanStatus();
    this.isStatusChecked = true;
    this.loginService.getLoggedInRole();
    this.isAdmin = this.loginService.isAdmin;
    //this.initTier();
    this.t.value;
    this.isAddTier=false;
  }
  // conven`ience getter for easy access to form fields
  get f() { return this.planForm.controls; }
  get t() { return this.f.lstTblPlanTier as FormArray; }
  get tierFormGroups() { return this.t.controls as FormGroup[]; }


    initTier(){
          return this.t.push(this.formBuilder.group({
            tierId: [''],
            tierAmount: [''],
            expectedClaimsRate: [''],
            isTerminalExtCoverage: [false]
        }));
    }
  addTier(){
        this.isAddTier= true;
    //const numberOfTiers = e.target.value || 0;
      //  if (this.t.length < numberOfTickets) {
          //  for (let i = this.t.length; i < numberOfTickets; i++) {
                

                if(this.t.length>7){
                  this.tiersLimitExceeded.flag=true;
                  this.tiersLimitExceeded.value='Maximum Eight Rows are allowed';
                }
                else{
                  this.t.push(this.formBuilder.group({
                    tierId: [''],
                    tierAmount: [''],
                    expectedClaimsRate: [''],
                    isTerminalExtCoverage: ['']
                }));
                  this.tiersLimitExceeded.flag=false;
                  this.tiersLimitExceeded.value='';
                }
           // }
       // } else {
            // for (let i = this.t.length; i >= numberOfTickets; i--) {
            //     this.t.removeAt(i);
            // }
        
  }
  fetchTiers(){
    console.log(this.t.length);
    
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
      this.initTier();
      this.isFilterOn=false;
      this.addPlanObj=null;
    }
    this.isCustomModalOpen = open;
    if (!open && elem==null) {
      this.planForm.enable();
      this.planForm.reset();
      this.getAllPlans();
      this.isAddMode = false;
      this.isAdded=false;
      this.isViewModal=false;
      this.t.clear();
      this.tiersLimitExceeded.flag=false;
      this.tiersLimitExceeded.value='';
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
      
      
      this.updatePlanID = elem.planID;
      //this.fetchTiers();
      console.log(elem.lstTblPlanTier.length);
      // this.t.setValue(elem.lstTblPlanTier);
      // console.log(this.t)
      

      if(elem.lstTblPlanTier.length>0){
        //this.t.setValue(elem.lstTblPlanTier);
     //  console.log(this.t.value);
       
        for (let i = 0; i < elem.lstTblPlanTier.length; i++) {
          this.t.push(this.formBuilder.group({
              planId: elem.lstTblPlanTier.planId,
              tierId: elem.lstTblPlanTier.tierId,
              tierAmount: elem.lstTblPlanTier.tierAmount,
              expectedClaimsRate: elem.lstTblPlanTier.expectedClaimsRate,
              isTerminalExtCoverage: elem.lstTblPlanTier.isTerminalExtCoverage=='Y'?true:false
          }));
      }
      
        
      }
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
        lstTblPlanTier: elem.lstTblPlanTier
      });
      console.log(this.planForm.value);
      console.log(this.t);
      
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
  onSubmit() {
    this.clearErrorMessages();//(V.E 27-Jul-2021 )
      this.submitted = true;
      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.planForm.invalid) {
          return;
      }
      
       //(V.E 27-Jul-2021 starts )
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
    this.isAddTier=false;
    if(!this.isAddTier){
      
        this.isDisabled=true;
        this.isNoFactAmount=false;
        console.log(this.f.lstTblPlanTier.value[0].isTerminalExtCoverage);
        
        
        //let tiersArr=this.f.lstTblPlanTier.value;
        for (let i = 0; i < this.f.lstTblPlanTier.value.length; i++) {
          if(this.f.lstTblPlanTier.value[i].tierId=='' && this.f.lstTblPlanTier.value[i].tierAmount=='' && this.f.lstTblPlanTier.value[i].expectedClaimsRate=='' && this.f.lstTblPlanTier.value[i].isTerminalExtCoverage==''){
          //  this.f.lstTblPlanTier.value.splice(i,1);
           
            this.f.lstTblPlanTier.value.splice(i,1);
            this.t.removeAt(i);
            this.planForm.patchValue(
              {
                lstTblPlanTier: this.f.lstTblPlanTier.value
              }
            );
            this.planForm.patchValue(this.planForm.value)
            
          }
          this.f.lstTblPlanTier.value[i].planId=0;
            this.f.lstTblPlanTier.value[i].tierId=Number(this.f.lstTblPlanTier.value[i].tierId);
            this.f.lstTblPlanTier.value[i].tierAmount=Number(this.f.lstTblPlanTier.value[i].tierAmount);
            this.f.lstTblPlanTier.value[i].isTerminalExtCoverage=this.f.lstTblPlanTier.value[i].isTerminalExtCoverage==true?'Y':'N';
        }
        //this.planForm.patchValue(this.planForm.value);
        
        this.addPlanObj = {
          planID: 0,
          clientId: this.f.clientId.value,
          contractId: Number(this.f.contractId.value),
          userId: this.loginService.currentUserValue.name,
          planCode: this.f.planCode.value,
          planName: this.f.planName.value,
          contractYear: this.f.contractYear.value,
          //clientName: this.locClientName,
          status: this.f.status.value==true?1:0,
          lstTblPlanTier: this.f.lstTblPlanTier.value
        }
        let date=new Date();
          console.log(this.addPlanObj);
          console.log(JSON.stringify(this.addPlanObj));
          
        
          this.planService.addPlan(this.addPlanObj)
              .pipe(first())
              .subscribe({
                  next: () => {
                      //this.planForm.reset();
                      //this.openCustomModal(false, null);
                      //this.getAllPlans();
                      console.log(this.planForm.value);
                      
                      this.getTires();
                      this.getAllPlans();
                      this.getActiveClients();
                      this.isAdded=true;
                      this.alertService.success('New Plan & Tier added', { keepAfterRouteChange: true });
                  },
                  error: error => {
                      this.alertService.error(error);
                      this.loading = false;
                      this.isAdded=false;
                  }
              });
      }
  }

  private updatePlan() {
    this.isDisabled=true;
    this.isNoFactAmount=false;
    console.log(this.updatePlanID);
    this.planForm.patchValue(this.planForm.value);
    
    console.log(this.f.lstTblPlanTier.value[0].isTerminalExtCoverage);
    for (let i = 0; i < this.f.lstTblPlanTier.value.length; i++) {
        this.f.lstTblPlanTier.value[i].tierId=Number(this.f.lstTblPlanTier.value[i].tierId);
        this.f.lstTblPlanTier.value[i].isTerminalExtCoverage=this.f.lstTblPlanTier.value[i].isTerminalExtCoverage==true?'Y':'N'
    }
    this.updatePlanObj = {
      planID: this.updatePlanID,
      clientId: this.f.clientId.value,
      contractId: Number(this.f.contractId.value),
      userId: this.loginService.currentUserValue.name,
      planCode: this.f.planCode.value,
      planName: this.f.planName.value,
      contractYear: this.f.contractYear.value,
     // clientName: this.locClientName,
      status: this.f.status.value==true?1:0,
      lstTblPlanTier: this.f.lstTblPlanTier.value
    }
    
    this.planForm.patchValue(this.planForm.value)
    

      console.log(this.updatePlanObj);

      this.planService.updatePlan(this.updatePlanObj)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.alertService.success('Plan & Tier updated', {
                    keepAfterRouteChange: true });
                    this.getAllPlans();
                    this.planForm.patchValue(this.planForm.value);
                    console.log(this.updatePlanObj);
                    console.log(this.planForm.value);
                    
    for (let i = 0; i < this.updatePlanObj.lstTblPlanTier.length; i++) {
      this.f.lstTblPlanTier.value[i].isTerminalExtCoverage=this.updatePlanObj.lstTblPlanTier[i].isTerminalExtCoverage=='Y'?true:false
  }
                    
                   // this.uPlanName=''; //(V.E 27-Jul-2021 )
                   // this.uplanId=''//(V.E 27-Jul-2021 )
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
