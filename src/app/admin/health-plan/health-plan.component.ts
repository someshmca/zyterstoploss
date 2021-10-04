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
import {DecimalPipe} from '@angular/common';

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
  format = '2.2-2';
  isPatchInputValue: boolean;
  patchInputValue: string;
  isContractYearInvalid={
    flag:false,
    message:''
  };
  tiersLimitExceeded={
    flag: false,
    value: ''
  } 
  duplicatePlanTierErr={flag:false, message:''};
  isPlanFormInvalid:boolean;
  isTierAmountInvalid:boolean;
  isExpectedClaimsRateInvalid: boolean;
  slTierSDateErr={isDateErr: false, dateErrMsg: ''};
  slTierEDateErr={isDateErr: false, dateErrMsg: ''};
  tierIdExists={
    singleFlag:false,
    singleMsg:'',
    dualFlag:false,
    dualMsg:'',
    familyFlag:false,
    familyMsg:'',
    othersFlag:false,
    othersMsg:''
  };
  tierIdRequiredErr={flag:false, msg:''};
  tierDateErr={flag:false, msg:''};

  // Tier Variables declaration start 
  
  single:number=0; dual:number=0; family:number=0; others:number=0;
  prevSingle:number=0; prevDual:number=0; prevFamily:number=0; prevOthers:number=0;
  curSingle:number = 0; curDual:number=0; curFamily:number=0; curOthers:number=0;
  // Tier variable declaration end
  
  singleArr={ startDates: [],  termCovs:[]  };
  dualArr={ startDates: [],  termCovs:[]  };
  familyArr={ startDates: [],  termCovs:[]  };
  othersArr={ startDates: [],  termCovs:[]  };


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
    private router:Router,
    private decimalPipe: DecimalPipe
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
    this.clearErrorMessages();
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
            planId: 0,
            tierId: [''],
            tierAmount: [''],
            expectedClaimsRate: [''],
            isTerminalExtCoverage: [false],
            stopLossTierStartDate: [null],
            stopLossTierEndDate: [null],
        }));
    }
  addTier(){
        this.isAddTier= true;
    //const numberOfTiers = e.target.value || 0;
      //  if (this.t.length < numberOfTickets) {
          //  for (let i = this.t.length; i < numberOfTickets; i++) {
                

                if(this.t.length>15){
                  this.tiersLimitExceeded.flag=true;
                  this.tiersLimitExceeded.value='Maximum Sixteen Rows are allowed';
                }
                else{
                  if(this.isAddMode){
                    this.t.push(this.formBuilder.group({
                      planId:0,
                      tierId: [''],
                      tierAmount: [''],
                      expectedClaimsRate: [''],
                      isTerminalExtCoverage: [false],
                      stopLossTierStartDate: null,
                      stopLossTierEndDate: null
                    }));
                  }
                  if(!this.isAddMode){
                    this.t.push(this.formBuilder.group({
                      planId:this.updatePlanID,
                      tierId: [''],
                      tierAmount: [''],
                      expectedClaimsRate: [''],
                      isTerminalExtCoverage: [false],
                      stopLossTierStartDate: null,
                      stopLossTierEndDate: null
                    }));
                  }
                  
                 // this.t.patchValue(this.t.value);
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
      if(this.isAddMode){
        this.planForm.patchValue({
          contractId: this.contractsByClientId[0].contractId
        })
      }
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
  this.isContractYearInvalid={
    flag:false,
    message:''
  };
  this.isPlanFormInvalid=false;
  this.isTierAmountInvalid=false;
  this.isExpectedClaimsRateInvalid=false;
  this.tierIdExists={
    singleFlag:false,
    singleMsg:'',
    dualFlag:false,
    dualMsg:'',
    familyFlag:false,
    familyMsg:'',
    othersFlag:false,
    othersMsg:''
  };  
  this.tierIdRequiredErr={flag:false, msg:''};
  this.duplicatePlanTierErr.flag=false;
  this.duplicatePlanTierErr.message='';
  this.slTierSDateErr.isDateErr=false;
  this.slTierSDateErr.dateErrMsg=''
  this.slTierEDateErr.isDateErr=false;
  this.slTierEDateErr.dateErrMsg='';  
  this.single=0; this.dual=0; this.family=0; this.others=0;
  this.prevSingle=0; this.prevDual=0; this.prevFamily=0; this.prevOthers=0;
  this.curSingle = 0; this.curDual=0; this.curFamily=0; this.curOthers=0;
  this.tierDateErr={flag:false, msg:''};
  this.singleArr={ startDates: [],  termCovs:[]  };
  this.dualArr={ startDates: [],  termCovs:[]  };
  this.familyArr={ startDates: [],  termCovs:[]  };
  this.othersArr={ startDates: [],  termCovs:[]  };
}
//(V.E 27-Jul-2021 Ends)
doFilter(filterValue:string){ 
  this.dataSource.filter=filterValue.trim().toLowerCase();
  this.dataSource.filterPredicate = (data:IPlanAll, filter: string) => {
    const Id=data.planCode.toString();
    const CompareData=data.clientName.toLowerCase() ||'';
    const CompareData1=Id||'';
    const CompareData2=data.planName.toLowerCase() ||'';
    return CompareData.indexOf(filter)!==-1|| CompareData1.indexOf(filter)!==-1|| CompareData2.indexOf(filter)!==-1
  };

}//Ends here

dateValueString(dateVal){
  if(dateVal==null) dateVal='';
  else dateVal=this.datePipe.transform(dateVal, 'yyyy-MM-dd');
  console.log(dateVal);
  return dateVal;
}
dateValue(dateVal){
  if(dateVal=='') dateVal=null;
  else dateVal=this.datePipe.transform(dateVal, 'yyyy-MM-dd');
  console.log(dateVal);
  return dateVal;
}
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
      this.isPatchInputValue=true;
    }
    this.isCustomModalOpen = open;
    if (!open && elem==null) {
      this.clearErrorMessages();
      this.planForm.enable();
      this.planForm.reset();
      this.getAllPlans();
      this.isAddMode = false;
      this.isAdded=false;
      this.isViewModal=false;
      this.contractsByClientId=[];
      console.log(this.contractsByClientId.length);
      
      this.t.clear();
      this.tiersLimitExceeded.flag=false;
      this.tiersLimitExceeded.value='';
      if(!this.isFilterOn){
        this.navService.resetPlanObj();
        this.clearSearchInput();
      }
    }
    if(open && elem!=null){
      
      this.isPatchInputValue=true;
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
              planId:elem.lstTblPlanTier[i].planId,
              tierId: elem.lstTblPlanTier[i].tierId,
              tierAmount: elem.lstTblPlanTier[i].tierAmount==0?'':this.decimalValue(elem.lstTblPlanTier[i].tierAmount),
              expectedClaimsRate: elem.lstTblPlanTier[i].expectedClaimsRate==0?'':this.decimalValue(elem.lstTblPlanTier[i].expectedClaimsRate),
              isTerminalExtCoverage: elem.lstTblPlanTier[i].isTerminalExtCoverage=='Y'?true:false,
              stopLossTierStartDate: this.dateValueString(elem.lstTblPlanTier[i].stopLossTierStartDate),
              stopLossTierEndDate: this.dateValueString(elem.lstTblPlanTier[i].stopLossTierEndDate),
          }));
      }
      
      this.planForm.patchValue({
        lstTblPlanTier:this.t.value
      })
      
        
      }
      this.getContractsByClientID(elem.clientId);
      this.planForm.patchValue({
        planID: elem.planID,
        clientId: elem.clientId,
        contractId: elem.contractId,
        userId: this.loginService.currentUserValue.name,
        planCode: elem.planCode,
        planName: elem.planName,
       contractYear: '',
        clientName: elem.clientName,
        status: elem.status,
        lstTblPlanTier: this.t.value
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
  // validateYear(){
    
  //   if(this.f.contractYear.value.length>0){
  //     let num = /^([0-9]+)$/; 
  //     let a1=num.test(this.f.contractYear.value);
  //     if(!a1 || (a1 && this.f.contractYear.value.length>0 && this.f.contractYear.value.length<4)){
  //       this.isContractYearInvalid.flag=true;
  //       this.isContractYearInvalid.message="Invalid Contract Year. Enter 4 digit Year";
  //     }
  //     else if(a1 && Number(this.f.contractYear.value)<1900 || Number(this.f.contractYear.value)>3000){
  //       this.isContractYearInvalid.flag=true;
  //       this.isContractYearInvalid.message="Year should be greater than 1900 and less than 3000";
  //     }
  //   }
  // }

  validateNumber(labelName, fieldValue, index){
    
    if(fieldValue!=''){
    if(labelName=="Tier Amount"){
      if(fieldValue=='' || fieldValue==null){
        this.t.value[index]({tierAmount:''});
      }
      else if(fieldValue==0){
        this.t.value[index]({tierAmount:''});
      }
      else if(fieldValue!=''){
        let numberPattern =/\-?\d*\.?\d{1,2}/;
        let testNum=numberPattern.test(fieldValue);
        if(!testNum){
          this.isTierAmountInvalid=true;
          this.isPlanFormInvalid=true;
        }
      }
    }
    else if(labelName=="Expected Claims Rate"){
      if(fieldValue=='' || fieldValue==null){
        this.t.value[index]({expectedClaimsRate:''});
      }
      else if(fieldValue==0){
        this.t.value[index]({expectedClaimsRate:''});
      }
      else if(fieldValue!=''){
        let numberPattern = /\-?\d*\.?\d{1,2}/;
        let testNum=numberPattern.test(fieldValue);
        if(!testNum){
          this.isExpectedClaimsRateInvalid=true;
          this.isPlanFormInvalid=true;
        }
      }
    }
  }
}
// validateTierDates(date1:Date, date2:Date){
//   date1.getDate();
//   date2.getDate();
  
// }
validateTierIDs(){
  let singleCount=0;
  let singleTerminals
  
  this.t.patchValue(this.t.value);
  
  for(let i=0; i<this.t.length;i++){ 
    console.log(this.t.value[i].tierId);
    console.log(this.t.value[i].tierAmount);   
    let tId= this.t.value[i].tierId;
    let tAmount=this.t.value[i].tierAmount;
    let tExpectedClaims = this.t.value[i].expectedClaimsRate;
    let tSLStartDate=this.t.value[i].stopLossTierStartDate;
    let tSLEndDate=this.t.value[i].stopLossTierEndDate;
    let tTerminalExtCov=this.t.value[i].isTerminalExtCoverage;
    if(i>0){
      if((tId=='' || tId==null) && 
        (tAmount=='' || tAmount==null) && 
        (tExpectedClaims=='' || tExpectedClaims==null) && 
        (tSLStartDate=='' || tSLStartDate==null) && 
        (tSLEndDate=='' || tSLEndDate==null) && 
        (tTerminalExtCov==false || tTerminalExtCov==null)){          
          this.t.removeAt(i);
          console.log(this.t.length);          
        }
    }
    if(tId==1){
      this.singleArr.startDates.push(tSLStartDate);
      this.singleArr.termCovs.push(tTerminalExtCov);            
        if(this.single>3){
          this.tierIdExists.singleMsg="Single Tier cannot be morethan four times";
          this.tierIdExists.singleFlag=true;
          return;
        }
        this.single++;
        
        console.log("Single count : "+this.single); 
        
    }
    else if(tId==2){
      this.dualArr.startDates.push(tSLStartDate);
      this.dualArr.termCovs.push(tTerminalExtCov);
     
       if(this.dual>3){
         this.tierIdExists.dualMsg="Dual Tier cannot be morethan four times";
         this.tierIdExists.dualFlag=true;
         return;
       }
       this.dual++;    
    }
    else if(tId==3){
      this.familyArr.startDates.push(tSLStartDate);
      this.familyArr.termCovs.push(tTerminalExtCov);     
       if(this.family>3){
         this.tierIdExists.familyMsg="Family Tier cannot be morethan four times";
         this.tierIdExists.familyFlag=true;
         return;
       }
       this.family++;    
    }
    else if(tId==4){
      this.othersArr.startDates.push(tSLStartDate);
      this.othersArr.termCovs.push(tTerminalExtCov);
    
      if(this.others>3){
        this.tierIdExists.othersMsg="Others Tier cannot be morethan four times";
        this.tierIdExists.othersFlag=true;
        return;
      }
      this.others++;    
    }
      if(tId=='' || tId==null){
        this.tierDateErr.flag=true;
        this.tierDateErr.msg="Tier ID is required for the row number "+(i+1);
        return;
      }
      else if(tAmount=='' || tAmount==null){
        this.tierDateErr.flag=true;
        this.tierDateErr.msg="Tier Amount is required for the row number "+(i+1);
        return;
      }
      else if(tSLStartDate==null || tSLStartDate=='' ){
        this.tierDateErr.flag=true;
        this.tierDateErr.msg="Tier Start Date is required for the row number "+(i+1);
        return;
      }
      else if(tSLEndDate==null || tSLEndDate==''){
        this.tierDateErr.flag=true;
        this.tierDateErr.msg="Tier End Date is required for the row number "+(i+1);
        return;
      }
      else if(tSLStartDate!=null && tSLEndDate!=null){
        if(tSLStartDate > tSLEndDate ){
          this.tierDateErr.flag=true;
          this.tierDateErr.msg="Tier Start Date should not be greater than Tier End Date for row "+i;
          return;
        }
        else if(tSLStartDate == tSLEndDate ){
          this.tierDateErr.flag=true;
          this.tierDateErr.msg="Tier Start Date should not be equal to Tier End Date for row "+i;
          return;
        }
      }
      
    
  }
  
  if(this.single>0 && !this.tierIdExists.singleFlag) this.validateAllTiers("Single");
  if(this.dual>0 && !this.tierIdExists.singleFlag)  this.validateAllTiers("Dual");
  if(this.family>0 && !this.tierIdExists.singleFlag)  this.validateAllTiers("Family");
  if(this.others>0 && !this.tierIdExists.singleFlag)  this.validateAllTiers("Others");  
  }

  validateAllTiers(tierName:string){    
    let sdLength, termCovsLength, sd1, sd2, sd3, sd4, tc1, tc2, tc3, tc4;
    if(tierName == 'Single'){
        sdLength = this.singleArr.startDates.length;
        termCovsLength = this.singleArr.termCovs.length;
        if(sdLength>0){
          if(sdLength==2 && termCovsLength == 2){
            sd1= this.singleArr.startDates[0];
            sd2= this.singleArr.startDates[1]; 
            tc1= this.singleArr.termCovs[0];
            tc2= this.singleArr.termCovs[1];
          }
          else if(sdLength==3 && termCovsLength == 3){
            sd1= this.singleArr.startDates[0];
            sd2= this.singleArr.startDates[1];
            sd3= this.singleArr.startDates[2];
            tc1= this.singleArr.termCovs[0];
            tc2= this.singleArr.termCovs[1];
            tc3= this.singleArr.termCovs[2];
          }
          else if(sdLength==4 && termCovsLength == 4){
            sd1= this.singleArr.startDates[0];
            sd2= this.singleArr.startDates[1];
            sd3= this.singleArr.startDates[2];
            sd4= this.singleArr.startDates[3];  
            tc1= this.singleArr.termCovs[0];
            tc2= this.singleArr.termCovs[1];
            tc3= this.singleArr.termCovs[2];
            tc4= this.singleArr.termCovs[3];
          }
        }
        
    }
    else if(tierName == 'Dual'){
        sdLength = this.dualArr.startDates.length;
        termCovsLength = this.dualArr.termCovs.length;
        
        if(sdLength>0){
          if(sdLength==2 && termCovsLength == 2){
            sd1= this.dualArr.startDates[0];
            sd2= this.dualArr.startDates[1]; 
            tc1= this.dualArr.termCovs[0];
            tc2= this.dualArr.termCovs[1];
          }
          else if(sdLength==3 && termCovsLength == 3){
            sd1= this.dualArr.startDates[0];
            sd2= this.dualArr.startDates[1];
            sd3= this.dualArr.startDates[2];
            tc1= this.dualArr.termCovs[0];
            tc2= this.dualArr.termCovs[1];
            tc3= this.dualArr.termCovs[2];
          }
          else if(sdLength==4 && termCovsLength == 4){
            sd1= this.dualArr.startDates[0];
            sd2= this.dualArr.startDates[1];
            sd3= this.dualArr.startDates[2];
            sd4= this.dualArr.startDates[3];  
            tc1= this.dualArr.termCovs[0];
            tc2= this.dualArr.termCovs[1];
            tc3= this.dualArr.termCovs[2];
            tc4= this.dualArr.termCovs[3];
          }
        }
    }
    else if(tierName == 'Family'){
        sdLength = this.familyArr.startDates.length;
        termCovsLength = this.familyArr.termCovs.length;
        if(sdLength>0){
          if(sdLength==2 && termCovsLength == 2){
            sd1= this.familyArr.startDates[0];
            sd2= this.familyArr.startDates[1]; 
            tc1= this.familyArr.termCovs[0];
            tc2= this.familyArr.termCovs[1];
          }
          else if(sdLength==3 && termCovsLength == 3){
            sd1= this.familyArr.startDates[0];
            sd2= this.familyArr.startDates[1];
            sd3= this.familyArr.startDates[2];
            tc1= this.familyArr.termCovs[0];
            tc2= this.familyArr.termCovs[1];
            tc3= this.familyArr.termCovs[2];
          }
          else if(sdLength==4 && termCovsLength == 4){
            sd1= this.familyArr.startDates[0];
            sd2= this.familyArr.startDates[1];
            sd3= this.familyArr.startDates[2];
            sd4= this.familyArr.startDates[3];  
            tc1= this.familyArr.termCovs[0];
            tc2= this.familyArr.termCovs[1];
            tc3= this.familyArr.termCovs[2];
            tc4= this.familyArr.termCovs[3];
          }
        }
    }
    else if(tierName == 'Others'){
        sdLength = this.othersArr.startDates.length;
        termCovsLength = this.othersArr.termCovs.length;
        if(sdLength>0){
          if(sdLength==2 && termCovsLength == 2){
            sd1= this.othersArr.startDates[0];
            sd2= this.othersArr.startDates[1]; 
            tc1= this.othersArr.termCovs[0];
            tc2= this.othersArr.termCovs[1];
          }
          else if(sdLength==3 && termCovsLength == 3){
            sd1= this.othersArr.startDates[0];
            sd2= this.othersArr.startDates[1];
            sd3= this.othersArr.startDates[2];
            tc1= this.othersArr.termCovs[0];
            tc2= this.othersArr.termCovs[1];
            tc3= this.othersArr.termCovs[2];
          }
          else if(sdLength==4 && termCovsLength == 4){
            sd1= this.othersArr.startDates[0];
            sd2= this.othersArr.startDates[1];
            sd3= this.othersArr.startDates[2];
            sd4= this.othersArr.startDates[3];  
            tc1= this.othersArr.termCovs[0];
            tc2= this.othersArr.termCovs[1];
            tc3= this.othersArr.termCovs[2];
            tc4= this.othersArr.termCovs[3];
          }
        }
    }
    if(sdLength==2 && termCovsLength == 2){
      if(sd1==sd2 && tc1==tc2)
      {
        this.tierIdExists.singleMsg=tierName+" Tiers 1 and 2 with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.singleFlag=true;       
        return;      
      }
      else{
        this.tierIdExists.singleMsg='';
        this.tierIdExists.singleFlag=false;                  
      }
    }
    else if(sdLength==3 && termCovsLength == 3){
       if((sd1==sd2) && (sd1==sd3)){
          this.tierIdExists.singleMsg=tierName+" Tiers with same Start Dates are not allowed more than two times";
          this.tierIdExists.singleFlag=true;             
          return;
        }
      else if(sd1==sd2 && tc1==tc2 && sd1!=sd3)
      {
        this.tierIdExists.singleMsg=tierName+" Tiers 1 and 2 with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.singleFlag=true;       
        return;      
      }
      else if(sd1==sd3 && sd1!=sd2 && tc1==tc3)
      {
        this.tierIdExists.singleMsg=tierName+" Tiers 1 and 3 with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.singleFlag=true;       
        return;      
      }
      else if(sd2==sd3 && sd2!=sd1 && tc2==tc3)
      {
        this.tierIdExists.singleMsg=tierName+" Tiers 2 and 3 with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.singleFlag=true;       
        return;      
      }
      else{
        this.tierIdExists.singleMsg='';
        this.tierIdExists.singleFlag=false;                  
      }
    }
    else if(sdLength==4 && termCovsLength == 4){
      
       if((sd1==sd2 && sd1==sd3) || (sd1==sd3 && sd1==sd4) || (sd2==sd3 && sd3==sd4)){
          this.tierIdExists.singleMsg=tierName+" Tiers with same Start Dates are not allowed more than two times";
          this.tierIdExists.singleFlag=true;             
          return;
        }
      else if(sd1==sd2 && tc1==tc2 && sd1!=sd3 && sd1!=sd4)
      {
        this.tierIdExists.singleMsg=tierName+" Tiers 1 and 2 with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.singleFlag=true;       
        return;      
      }
      else if(sd1==sd3 && sd1!=sd2 && sd1!=sd4 && tc1==tc3)
      {
        this.tierIdExists.singleMsg=tierName+" Tiers 1 and 3 with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.singleFlag=true;       
        return;      
      }
      else if(sd1==sd4 && sd1!=sd2 && sd1!=sd3 && tc1==tc4)
      {
        this.tierIdExists.singleMsg=tierName+" Tiers 1 and 4 with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.singleFlag=true;       
        return;      
      }
      else if(sd2==sd3 && sd2!=sd1 && sd2!=sd4 && tc2==tc3)
      {
        this.tierIdExists.singleMsg=tierName+" Tiers 2 and 3 with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.singleFlag=true;       
        return;      
      }
      else if(sd2==sd4 && sd2!=sd1 && sd2!=sd3 && tc2==tc4)
      {
        this.tierIdExists.singleMsg=tierName+" Tiers 2 and 4 with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.singleFlag=true;       
        return;      
      }
      else if(sd3==sd4 && sd3!=sd1 && sd3!=sd2 && tc3==tc4)
      {
        this.tierIdExists.singleMsg=tierName+" Tiers 3 and 4 with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.singleFlag=true;       
        return;      
      }
      else if(sd1==sd2 && tc1==tc2 && sd3==sd4 && tc3!=tc4)
      {
        this.tierIdExists.singleMsg=tierName+" Tiers 1 and 2 with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.singleFlag=true;       
        return;      
      }
      else if(sd1==sd2 && tc1!=tc2 && sd1!=sd3 && sd3==sd4 && tc3==tc4)
      {
        this.tierIdExists.singleMsg=tierName+" Tiers 3 and 4 with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.singleFlag=true;       
        return;      
      }
      else if(sd1==sd2 && sd3==sd4 && sd2!=sd3 && tc1==tc2 && tc3==tc4)
      {
        this.tierIdExists.singleMsg=tierName+" Tiers 1,2 and 3,4 with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.singleFlag=true;       
        return;      
      }
      else if(sd1==sd3 && sd2==sd4 && sd1!=sd4 && tc1==tc3 && tc2==tc4)
      {
        this.tierIdExists.singleMsg=tierName+" Tiers 1,3 and 2,4 with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.singleFlag=true;       
        return;      
      }
      else if(sd1==sd4 && sd2==sd3 && sd1!=sd2 && tc1==tc4 && tc2==tc3)
      {
        this.tierIdExists.singleMsg=tierName+" Tiers 1,4 and 2,3 with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.singleFlag=true;       
        return;      
      }
      else{
        this.tierIdExists.singleMsg='';
        this.tierIdExists.singleFlag=false;                  
      }
    }
  }

  validateDualArr(){ 
    if(this.dualArr.startDates.length==2 && 
      this.dualArr.startDates[0] == this.dualArr.startDates[1] && this.dualArr.termCovs[0]==this.dualArr.termCovs[1]){
        this.tierIdExists.dualMsg="Two Dual Tiers with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.dualFlag=true;      
        return;       
      }
   else if(this.dualArr.startDates.length==3 && 
      this.dualArr.startDates[0] == this.dualArr.startDates[1] && 
      this.dualArr.startDates[0] == this.dualArr.startDates[2] ){
        this.tierIdExists.dualMsg="Dual Tier Start Date cannot be same for 3 times";
        this.tierIdExists.dualFlag=true;         
        return;    
      }
    else if(this.dualArr.startDates.length==3 && 
      this.dualArr.startDates[1] == this.dualArr.startDates[0] && 
      this.dualArr.startDates[1] == this.dualArr.startDates[2] ){
        this.tierIdExists.dualMsg="Dual Tier Start Date cannot be same for 3 times";
        this.tierIdExists.dualFlag=true;         
        return;    
      }
    else if(this.dualArr.startDates.length==3 && 
      this.dualArr.startDates[0] == this.dualArr.startDates[1] && 
      this.dualArr.startDates[1] != this.dualArr.startDates[2] && this.dualArr.termCovs[0]==this.dualArr.termCovs[1]){
        this.tierIdExists.dualMsg="Two Dual Tiers with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.dualFlag=true;        
        return;     
      }
    else if(this.dualArr.startDates.length==3 && 
      this.dualArr.startDates[0] != this.dualArr.startDates[1] && 
      this.dualArr.startDates[1] == this.dualArr.startDates[2] && this.dualArr.termCovs[1]==this.dualArr.termCovs[2]){
        this.tierIdExists.dualMsg="Two Dual Tiers with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.dualFlag=true;    
        return;         
      }
    else if(this.dualArr.startDates.length==4 && 
      this.dualArr.startDates[0] == this.dualArr.startDates[1] && 
      this.dualArr.startDates[0] == this.dualArr.startDates[2] && 
      this.dualArr.startDates[0] == this.dualArr.startDates[3]){
        this.tierIdExists.dualMsg="Dual Tier Start Date cannot be same for 3 times";
        this.tierIdExists.dualFlag=true;          
        return;   
      }
    else if(this.dualArr.startDates.length==4 && 
      this.dualArr.startDates[1] == this.dualArr.startDates[0] && 
      this.dualArr.startDates[1] == this.dualArr.startDates[2] && 
      this.dualArr.startDates[1] == this.dualArr.startDates[3]){
        this.tierIdExists.dualMsg="Dual Tier Start Date cannot be same for 3 times";
        this.tierIdExists.dualFlag=true;         
        return;    
      }
    else if(this.dualArr.startDates.length==4 && 
      this.dualArr.startDates[2] == this.dualArr.startDates[0] && 
      this.dualArr.startDates[2] == this.dualArr.startDates[1] && 
      this.dualArr.startDates[2] == this.dualArr.startDates[3]){
        this.tierIdExists.dualMsg="Dual Tier Start Date cannot be same for 3 times";
        this.tierIdExists.dualFlag=true;          
        return;   
      }
    else if(this.dualArr.startDates.length==4 && 
      this.dualArr.startDates[3] == this.dualArr.startDates[0] && 
      this.dualArr.startDates[3] == this.dualArr.startDates[1] && 
      this.dualArr.startDates[3] == this.dualArr.startDates[2]){
        this.tierIdExists.dualMsg="Dual Tier Start Date cannot be same for 3 times";
        this.tierIdExists.dualFlag=true;   
        return;          
      }
    else if(this.dualArr.startDates.length==4 && 
      this.dualArr.startDates[0] == this.dualArr.startDates[1] && 
      this.dualArr.startDates[1] != this.dualArr.startDates[2] &&  
      this.dualArr.startDates[2] != this.dualArr.startDates[3] && this.dualArr.termCovs[0]==this.dualArr.termCovs[1]){
        this.tierIdExists.dualMsg="Two Dual Tiers with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.dualFlag=true;      
        return;       
      }
    else if(this.dualArr.startDates.length==4 && 
      this.dualArr.startDates[0] != this.dualArr.startDates[1] && 
      this.dualArr.startDates[1] == this.dualArr.startDates[2] &&  
      this.dualArr.startDates[2] != this.dualArr.startDates[3] && this.dualArr.termCovs[1]==this.dualArr.termCovs[2]){
        this.tierIdExists.dualMsg="Two Dual Tiers with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.dualFlag=true;          
        return;   
      }
    else if(this.dualArr.startDates.length==4 && 
      this.dualArr.startDates[0] != this.dualArr.startDates[1] && 
      this.dualArr.startDates[1] != this.dualArr.startDates[2] &&  
      this.dualArr.startDates[2] == this.dualArr.startDates[3] && this.dualArr.termCovs[2]==this.dualArr.termCovs[3]){
        this.tierIdExists.dualMsg="Two Dual Tiers with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.dualFlag=true;      
        return;       
      }   
      else{
        this.tierIdExists.dualMsg='';
        this.tierIdExists.dualFlag=false;                  
      }   
  }

  validateFamilyArr(){
    if(this.familyArr.startDates.length==2 && 
      this.familyArr.startDates[0] == this.familyArr.startDates[1] && this.familyArr.termCovs[0]==this.familyArr.termCovs[1]){
        this.tierIdExists.familyMsg="Two Family Tiers with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.familyFlag=true;       
        return;      
      }
    else if(this.familyArr.startDates.length==3 && 
      this.familyArr.startDates[0] == this.familyArr.startDates[1] && 
      this.familyArr.startDates[0] == this.familyArr.startDates[2] ){
        this.tierIdExists.familyMsg="Family Tier Start Date cannot be same for 3 times";
        this.tierIdExists.familyFlag=true;    
        return;         
      }
    else if(this.familyArr.startDates.length==3 && 
      this.familyArr.startDates[1] == this.familyArr.startDates[0] && 
      this.familyArr.startDates[1] == this.familyArr.startDates[2] ){
        this.tierIdExists.familyMsg="Family Tier Start Date cannot be same for 3 times";
        this.tierIdExists.familyFlag=true;   
        return;          
      }
    else if(this.familyArr.startDates.length==3 && 
      this.familyArr.startDates[0] == this.familyArr.startDates[1] && 
      this.familyArr.startDates[1] != this.familyArr.startDates[2] && this.familyArr.termCovs[0]==this.familyArr.termCovs[1]){
        this.tierIdExists.familyMsg="Two Family Tiers with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.familyFlag=true;       
        return;      
      }
    else if(this.familyArr.startDates.length==3 && 
      this.familyArr.startDates[0] != this.familyArr.startDates[1] && 
      this.familyArr.startDates[1] == this.familyArr.startDates[2] && this.familyArr.termCovs[1]==this.familyArr.termCovs[2]){
        this.tierIdExists.familyMsg="Two Family Tiers with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.familyFlag=true;       
        return;      
      }
    else if(this.familyArr.startDates.length==4 && 
      this.familyArr.startDates[0] == this.familyArr.startDates[1] && 
      this.familyArr.startDates[0] == this.familyArr.startDates[2] && 
      this.familyArr.startDates[0] == this.familyArr.startDates[3]){
        this.tierIdExists.familyMsg="Family Tier Start Date cannot be same for 3 times";
        this.tierIdExists.familyFlag=true;    
        return;         
      }
    else if(this.familyArr.startDates.length==4 && 
      this.familyArr.startDates[1] == this.familyArr.startDates[0] && 
      this.familyArr.startDates[1] == this.familyArr.startDates[2] && 
      this.familyArr.startDates[1] == this.familyArr.startDates[3]){
        this.tierIdExists.familyMsg="Family Tier Start Date cannot be same for 3 times";
        this.tierIdExists.familyFlag=true;       
        return;      
      }
    else if(this.familyArr.startDates.length==4 && 
      this.familyArr.startDates[2] == this.familyArr.startDates[0] && 
      this.familyArr.startDates[2] == this.familyArr.startDates[1] && 
      this.familyArr.startDates[2] == this.familyArr.startDates[3]){
        this.tierIdExists.familyMsg="Family Tier Start Date cannot be same for 3 times";
        this.tierIdExists.familyFlag=true;      
        return;       
      }
    else if(this.familyArr.startDates.length==4 && 
      this.familyArr.startDates[3] == this.familyArr.startDates[0] && 
      this.familyArr.startDates[3] == this.familyArr.startDates[1] && 
      this.familyArr.startDates[3] == this.familyArr.startDates[2]){
        this.tierIdExists.familyMsg="Family Tier Start Date cannot be same for 3 times";
        this.tierIdExists.familyFlag=true;      
        return;       
      }
    else if(this.familyArr.startDates.length==4 && 
      this.familyArr.startDates[0] == this.familyArr.startDates[1] && 
      this.familyArr.startDates[1] != this.familyArr.startDates[2] &&  
      this.familyArr.startDates[2] != this.familyArr.startDates[3] && this.familyArr.termCovs[0]==this.familyArr.termCovs[1]){
        this.tierIdExists.familyMsg="Two Family Tiers with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.familyFlag=true;       
        return;      
      }
    else if(this.familyArr.startDates.length==4 && 
      this.familyArr.startDates[0] != this.familyArr.startDates[1] && 
      this.familyArr.startDates[1] == this.familyArr.startDates[2] &&  
      this.familyArr.startDates[2] != this.familyArr.startDates[3] && this.familyArr.termCovs[1]==this.familyArr.termCovs[2]){
        this.tierIdExists.familyMsg="Two Family Tiers with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.familyFlag=true;    
        return;         
      }
    else if(this.familyArr.startDates.length==4 && 
      this.familyArr.startDates[0] != this.familyArr.startDates[1] && 
      this.familyArr.startDates[1] != this.familyArr.startDates[2] &&  
      this.familyArr.startDates[2] == this.familyArr.startDates[3] && this.familyArr.termCovs[2]==this.familyArr.termCovs[3]){
        this.tierIdExists.familyMsg="Two Family Tiers with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.familyFlag=true;    
        return;         
      } 
      else{
        this.tierIdExists.familyMsg='';
        this.tierIdExists.familyFlag=false;                  
      }       
  }

  validateOthersArr(){
    if(this.othersArr.startDates.length==2 && 
      this.othersArr.startDates[0] == this.othersArr.startDates[1] && this.othersArr.termCovs[0]==this.othersArr.termCovs[1]){
        this.tierIdExists.othersMsg="Two Others Tiers with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.othersFlag=true;            
      }
    else if(this.othersArr.startDates.length==3 && 
      this.othersArr.startDates[0] == this.othersArr.startDates[1] && 
      this.othersArr.startDates[0] == this.othersArr.startDates[2] ){
        this.tierIdExists.othersMsg="Others Tier Start Date cannot be same for 3 times";
        this.tierIdExists.othersFlag=true;            
      }
    else if(this.othersArr.startDates.length==3 && 
      this.othersArr.startDates[1] == this.othersArr.startDates[0] && 
      this.othersArr.startDates[1] == this.othersArr.startDates[2] ){
        this.tierIdExists.othersMsg="Others Tier Start Date cannot be same for 3 times";
        this.tierIdExists.othersFlag=true;            
      }
    else if(this.othersArr.startDates.length==3 && 
      this.othersArr.startDates[0] == this.othersArr.startDates[1] && 
      this.othersArr.startDates[1] != this.othersArr.startDates[2] && this.othersArr.termCovs[0]==this.othersArr.termCovs[1]){
        this.tierIdExists.othersMsg="Two Others Tiers with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.othersFlag=true;            
      }
    else if(this.othersArr.startDates.length==3 && 
      this.othersArr.startDates[0] != this.othersArr.startDates[1] && 
      this.othersArr.startDates[1] == this.othersArr.startDates[2] && this.othersArr.termCovs[1]==this.othersArr.termCovs[2]){
        this.tierIdExists.othersMsg="Two Others Tiers with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.othersFlag=true;            
      }
    else if(this.othersArr.startDates.length==4 && 
      this.othersArr.startDates[0] == this.othersArr.startDates[1] && 
      this.othersArr.startDates[0] == this.othersArr.startDates[2] && 
      this.othersArr.startDates[0] == this.othersArr.startDates[3]){
        this.tierIdExists.othersMsg="Others Tier Start Date cannot be same for 3 times";
        this.tierIdExists.othersFlag=true;            
      }
    else if(this.othersArr.startDates.length==4 && 
      this.othersArr.startDates[1] == this.othersArr.startDates[0] && 
      this.othersArr.startDates[1] == this.othersArr.startDates[2] && 
      this.othersArr.startDates[1] == this.othersArr.startDates[3]){
        this.tierIdExists.othersMsg="Others Tier Start Date cannot be same for 3 times";
        this.tierIdExists.othersFlag=true;            
      }
    else if(this.othersArr.startDates.length==4 && 
      this.othersArr.startDates[2] == this.othersArr.startDates[0] && 
      this.othersArr.startDates[2] == this.othersArr.startDates[1] && 
      this.othersArr.startDates[2] == this.othersArr.startDates[3]){
        this.tierIdExists.othersMsg="Others Tier Start Date cannot be same for 3 times";
        this.tierIdExists.othersFlag=true;            
      }
    else if(this.othersArr.startDates.length==4 && 
      this.othersArr.startDates[3] == this.othersArr.startDates[0] && 
      this.othersArr.startDates[3] == this.othersArr.startDates[1] && 
      this.othersArr.startDates[3] == this.othersArr.startDates[2]){
        this.tierIdExists.othersMsg="Others Tier Start Date cannot be same for 3 times";
        this.tierIdExists.othersFlag=true;            
      }
    else if(this.othersArr.startDates.length==4 && 
      this.othersArr.startDates[0] == this.othersArr.startDates[1] && 
      this.othersArr.startDates[1] != this.othersArr.startDates[2] &&  
      this.othersArr.startDates[2] != this.othersArr.startDates[3] && this.othersArr.termCovs[0]==this.othersArr.termCovs[1]){
        this.tierIdExists.othersMsg="Two Others Tiers with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.othersFlag=true;            
      }
    else if(this.othersArr.startDates.length==4 && 
      this.othersArr.startDates[0] != this.othersArr.startDates[1] && 
      this.othersArr.startDates[1] == this.othersArr.startDates[2] &&  
      this.othersArr.startDates[2] != this.othersArr.startDates[3] && this.othersArr.termCovs[1]==this.othersArr.termCovs[2]){
        this.tierIdExists.othersMsg="Two Others Tiers with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.othersFlag=true;            
      }
    else if(this.othersArr.startDates.length==4 && 
      this.othersArr.startDates[0] != this.othersArr.startDates[1] && 
      this.othersArr.startDates[1] != this.othersArr.startDates[2] &&  
      this.othersArr.startDates[2] == this.othersArr.startDates[3] && this.othersArr.termCovs[2]==this.othersArr.termCovs[3]){
        this.tierIdExists.othersMsg="Two Others Tiers with same Start Dates should not have same Terminal Coverage ";
        this.tierIdExists.othersFlag=true;            
      }  
      else{
        this.tierIdExists.othersMsg='';
        this.tierIdExists.othersFlag=false;                  
      }      
  }

  decimalValue(inputValue:number){
      
    if(inputValue==0){
      inputValue=0;
    }
    else{
       let kk=this.decimalPipe.transform(inputValue,this.format);
      
      inputValue= Number(this.decimalPipe.transform(inputValue,this.format).replace(/,/g, ""));
      
      if(this.isPatchInputValue)
        this.patchInputValue=inputValue.toFixed(2);
      //inputValue= Number(this.decimalPipe.transform(inputValue,this.format).replace(',', "")); 
      //inputValue= Number(this.decimalPipe.transform(inputValue, this.format).replace(/\D,/g, "")); 
            
    }
    console.log(inputValue); 
    if(!this.isPatchInputValue)     
    return inputValue;
    if(this.isPatchInputValue)
    return this.patchInputValue;
  }     

  onSubmit() {
    this.clearErrorMessages();
      this.submitted = true;
      // reset alerts on submit
    //  this.validateYear();
      this.alertService.clear();
    this.validateTierIDs();
    // let stopLossTierStartDate=this.f.stopLossTierStartDate.value;
    // let stopLossTierEndDate=this.f.stopLossTierEndDate.value;
      // stop here if form is invalid
      if (this.planForm.invalid) return;
      if(this.isContractYearInvalid.flag) return;
      if(this.tierIdExists.singleFlag) return;
      if(this.tierIdExists.dualFlag) return;
      if(this.tierIdExists.familyFlag) return;
      if(this.tierIdExists.othersFlag) return;
      if(this.tierIdRequiredErr.flag) return;
      if(this.tierDateErr.flag) return;
       //(V.E 27-Jul-2021 starts )
      if(this.planForm.valid){
      //   if(stopLossTierStartDate!=null && stopLossTierEndDate!=null && stopLossTierStartDate!='' &&  stopLossTierEndDate!=''){
      //     if(stopLossTierStartDate > stopLossTierEndDate){
      //       this.slTierSDateErr.isDateErr=true;
      //       this.slTierSDateErr.dateErrMsg = 'Tier start date should not be greater than Tier end date';  
      //       return;
      //     }
       
      //     if(stopLossTierStartDate == stopLossTierEndDate){
      //       this.slTierEDateErr.isDateErr=true;
      //       this.slTierEDateErr.dateErrMsg = 'Tier Start date should not be Equal to Tier End date';    
      //       return;
      //     }
   
      //  }
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
        // if(this.t.length>0){
        //   for(let i=0;i<this.t.length; i++){
            
        //     this.validateNumber("Tier Amount", this.t.value[i].tierAmount, i);
        //     this.validateNumber("Expected Claims Rate", this.t.value[i].expectedClaimsRate, i);
            
        //     this.validateTierDates(this.t.value[i].stopLossTierStartDate, this.t.value[i].stopLossTierEndDate);
            
        //     if(this.isPlanFormInvalid)
        //       return;
        //   }

        // }

      }
     
      if(this.duplicatePlanTierErr.flag) return;
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
            

          });
          
          this.updatePlan();
        }
       }
  
  
  private addPlan() {
    this.isAddTier=false;
    this.isPatchInputValue=false;
    
    if(!this.isAddTier){
      
        this.isDisabled=true;
        this.isNoFactAmount=false;
        console.log(this.t.value[0].isTerminalExtCoverage);
        
        this.t.patchValue(this.t.value);
        
    let flag=false;
        //let tiersArr=this.t.value;
        for (let i = 0; i < this.t.value.length;) {
            this.t.value[i].planId=0;
            this.t.value[i].tierId=Number(this.t.value[i].tierId);
            this.t.value[i].tierAmount=this.t.value[i].tierAmount==''?0:this.decimalValue(this.t.value[i].tierAmount),
            this.t.value[i].expectedClaimsRate=this.t.value[i].expectedClaimsRate==('' || null)?0:this.decimalValue(this.t.value[i].expectedClaimsRate),
            this.t.value[i].isTerminalExtCoverage=this.t.value[i].isTerminalExtCoverage==true?'Y':'N';    
            this.t.value[i].stopLossTierStartDate=this.dateValue(this.t.value[i].stopLossTierStartDate),
            this.t.value[i].stopLossTierEndDate=this.dateValue(this.t.value[i].stopLossTierEndDate),
            this.tierIdRequiredErr.flag=false;
            this.tierIdRequiredErr.msg='';        
            i++;
        }
        //this.planForm.patchValue(this.planForm.value);
        
        this.addPlanObj = {
          planID: 0,
          clientId: this.f.clientId.value,
          contractId: Number(this.f.contractId.value),
          userId: this.loginService.currentUserValue.name,
          planCode: this.f.planCode.value,
          planName: this.f.planName.value,
          contractYear: '',
          //clientName: this.locClientName,
          status: this.f.status.value==true?1:0,
          lstTblPlanTier: this.t.value
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
                      
                     this.t.patchValue(this.t.value);
                      this.getActiveClients();
                      
                      for(let i=0;i<this.t.length;i++){       
                        this.t.value[i].expectedClaimsRate=this.t.value[i].expectedClaimsRate==0?'':this.t.value[i].expectedClaimsRate;
                                         
                          this.t.value[i].isTerminalExtCoverage=this.t.value[i].isTerminalExtCoverage=='Y'?true:false;
                      }
                      this.t.patchValue(this.t.value);
                      this.isAdded=true;
                      this.isPatchInputValue=true;
                      this.tiersLimitExceeded.flag=false;
                      this.tiersLimitExceeded.value='';
                      
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
    
  this.isPatchInputValue=false;
  
  let flag=false;
  //this.patchInputValue='';
    this.isDisabled=true;
    this.isNoFactAmount=false;
    //console.log(this.updatePlanID);
    //this.planForm.patchValue(this.planForm.value);
    for (let i = 0; i < this.t.value.length;) {
      this.t.value[i].planId=this.updatePlanID;
      this.t.value[i].tierId=Number(this.t.value[i].tierId);
      this.t.value[i].tierAmount=this.t.value[i].tierAmount==''?0:Number(this.decimalValue(this.t.value[i].tierAmount));
      this.t.value[i].expectedClaimsRate=this.t.value[i].expectedClaimsRate==('' || null)?0:Number(this.decimalValue(this.t.value[i].expectedClaimsRate));
      
      this.t.value[i].isTerminalExtCoverage=this.t.value[i].isTerminalExtCoverage==true?'Y':'N';
      this.t.value[i].stopLossTierStartDate=this.dateValue(this.t.value[i].stopLossTierStartDate),
      this.t.value[i].stopLossTierEndDate=this.dateValue(this.t.value[i].stopLossTierEndDate),
      i++;
      console.log(this.t.value);
    
  }
    this.t.patchValue(this.t.value);
    
    
    
   // this.t.patchValue(this.t.value); 
    this.updatePlanObj = {
      planID: this.updatePlanID,
      clientId: this.f.clientId.value,
      contractId: Number(this.f.contractId.value),
      userId: this.loginService.currentUserValue.name,
      planCode: this.f.planCode.value,
      planName: this.f.planName.value,
      contractYear: '',
     // clientName: this.locClientName,
      status: this.f.status.value==true?1:0,
      lstTblPlanTier: this.t.value
    }
    
    
      console.log(this.updatePlanObj);
      
    
      this.planService.updatePlan(this.updatePlanObj)
          .pipe(first())
          .subscribe({
              next: () => {
                   // 
                   // this.planForm.patchValue(this.planForm.value);
                    console.log(this.updatePlanObj);
                    console.log(this.t.value);
                    this.t.patchValue(this.t.value);
                    
                  this.isPatchInputValue=true;
                    
                    for (let i = 0; i < this.t.length; i++) {
                      
                        this.t.value[i].tierAmount=this.t.value[i].tierAmount==0?'':this.decimalValue(this.t.value[i].tierAmount);
                        this.t.value[i].expectedClaimsRate=this.t.value[i].expectedClaimsRate==0?'':this.decimalValue(this.t.value[i].expectedClaimsRate);
                        this.t.value[i].isTerminalExtCoverage=this.t.value[i].isTerminalExtCoverage=='Y'?true:false
                        
                      }
                      this.t.patchValue(this.t.value);
                    
                    this.getAllPlans();
                    this.tiersLimitExceeded.flag=false;
                    this.tiersLimitExceeded.value='';
                  this.alertService.success('Plan & Tier updated', {
                    keepAfterRouteChange: true });

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
