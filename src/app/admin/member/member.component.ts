import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import {IMemberSearch, IMemberSearchResponse, IMemberAdd} from '../models/member-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IActiveClient } from '../models/clients-model';
import {IContract} from '../models/contracts-model';
import {IPlanAll, ITire} from '../models/health-plan.model';
import {MemberService} from '../services/member.service';
import {Paths} from '../admin-paths';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { first } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import {DatePipe} from '@angular/common';
import { AlertService } from '../services/alert.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { from } from 'rxjs';
import { ClientsService } from '../services/clients.service';
import { ContractService } from '../services/contract.service';
import { HealthPlanService } from '../services/health-plan.service';
import {NavPopupService} from '../services/nav-popup.service';
import { LoaderService } from '../services/loader.service';//added by Venkatesh Enigonda

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css'],
  providers: [DatePipe]
})
export class MemberComponent implements OnInit {
  memberSearchForm: FormGroup;
  searchResult: any;
  memberForm: FormGroup;
  searchErrorMessage: string;
  displayedColumns: string[] = ['memberHrid', 'clientName', 'contractId', 'planId', 'tierId', 'fname', 'lname', 'mname', 'gender','memberStartDate', 'memberEndDate','dateOfBirth', 'subscriberId','alternateId', 'laserValue', 'isUnlimited','tier','benefitPlanId','userId'];    //(VE 30-Jul-2021)
  searchDataSource: any;

  
  uClientId:any;
  uContractId:any;
  uPlanId:any;
  uTierId:any;
  today: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("focusElem") focusTag: ElementRef;
  @ViewChild("focusMemSearch") focusMSTag: ElementRef;
  
  isAddMode: boolean = false;
  loading = false;
  memSearchSubmitted = false;
  submitted = false;
  isCustomModalOpen: boolean = false;
  memSearchError: boolean = false;
  noSearchFieldEntered: boolean = false;
  
  activeClients: IActiveClient[] = [];
  activeContracts: IContract[]=[];
  plans: IPlanAll[]=[];
  tires: ITire[] = [];
  show: boolean = true;
  memberSearchErr: any;
  memIdErr = {isValid: false, errMsg: ''};
  memSubIdErr={isValid: false, errMsg: ''}; // Start by Venkatesh Enigonda
  memFnameErr = {isValid: false, errMsg: ''};
  memMnameErr= {isValid: false, errMsg: ''};
  memLnameErr= {isValid: false, errMsg: ''}; // End by Venkatesh Enigonda 
  memStartDateErr = {isValid: false, errMsg: ''};
  memEndDateErr = {isValid: false, errMsg: ''};
  
  isSearchDataThere: boolean = false;
  noSearchResultsFound: boolean = false;
  uMemberId: any;
  isDisabled: boolean=false;
  isViewModal: boolean=false;
  isAdmin: boolean;
  constructor(public loaderService: LoaderService, private mb: FormBuilder, private fb: FormBuilder, private memberService:MemberService, private alertService: AlertService, private datePipe: DatePipe, private loginService: LoginService, private clientService: ClientsService, private contractService: ContractService, private planService: HealthPlanService, private navService: NavPopupService) { }

  ngOnInit() {
    this.show=true;

    this.initMemberSearchForm();
    this.memberForm = this.fb.group({
      memberId: [''],
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      mname: '',
      gender: ['', Validators.required],
      status: true, // status is number field 0 is false and 1 is true
      memberHrid: ['',Validators.required],
      laserValue: 0,
      isUnlimited: false,
      userId: '',
      memberStartDate: ['', Validators.required],
      memberEndDate: ['', Validators.required],
      subscriberId: [''],
      subscriberFname: '',
      subscriberLname: '',
      alternateId: '',
      clientId: ['', Validators.required],
      contractId: ['', Validators.required],
      planId: ['', Validators.required],
      tierId: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      tier:[''],//(VE 30-07-2021)
      benefitPlanId:['']//(VE 30-07-2021)
    });
    //this.today=this.datePipe.transform(new Date(Date.now()), "MM/dd/yyyy");    
    this.today=new Date().toJSON().split('T')[0];
    setTimeout(()=>{
      this.focusMSTag.nativeElement.focus();
      //this.focusTag.nativeElement.focus();
    }, 200);
    this.getActiveClients();
    this.clearErrorMessages();    
    this.loginService.getLoggedInRole();
    this.isAdmin = this.loginService.isAdmin;
    if(!this.isAdmin){
      this.isViewModal=true;
    }
  }  // end of ngOnInit 

  clearErrorMessages(){  
    this.memIdErr.isValid=false;
    this.memIdErr.errMsg='';
    this.memSubIdErr.isValid=false; // From Line 116 to 123 Modified by Venkatesh Enigonda
    this.memSubIdErr.errMsg='';
    this.memFnameErr.isValid=false;
    this.memFnameErr.errMsg='';
    this.memMnameErr.isValid=false;
    this.memMnameErr.errMsg='';
    this.memLnameErr.isValid=false;
    this.memLnameErr.errMsg='';
    this.memStartDateErr.isValid=false;
    this.memStartDateErr.errMsg='';
    this.memEndDateErr.isValid=false;
    this.memEndDateErr.errMsg='';
    this.noSearchFieldEntered=false; //Modified by Venkatesh Enigonda
  }
  initMemberSearchForm(){    
    this.memberSearchForm = this.mb.group({
      MemberId: [''],
      SubscriberId:[''],
      MemberStartDate: [''],
      MemberEndDate: [''],
      Fname:[''],
      Lname: [''],
      Mname: '',
      DateOfBirth:[''],
      Gender: [''],
      //(VE 30-Jul-2021 starts)
      clientId:[''],
      benefitPlanId:[''],
      tier:[''],
      alternateId:[''],
      //(VE 30-Jul-2021 ends)
    });
  }

  getActiveClients(){
    this.clientService.getActiveClients().subscribe(
      (data)=>{
        this.activeClients = data;
        
      }
    )
  }

  getContractsByClientId(clientId){
    this.contractService.getContractsByClientID(clientId).subscribe(
      (data)=>{
        this.activeContracts = data;
      }
    )
  }
  getPlans(){
    this.planService.getAllPlans().subscribe(
      (data)=>{
        this.plans = data;
      }
    )
  }
  getTires(){
    this.planService.getTires().subscribe(
      (data)=>{
        this.tires=data;

      }
    )
  }
  resetMemberSearch(){
    this.initMemberSearchForm();
    this.isSearchDataThere= false;
    this.memSearchError=false;
    this.noSearchFieldEntered=false; 
    this.clearErrorMessages();   
  }
  searchMember(formData: FormGroup){
    this.memSearchSubmitted = true;
    this.memSearchError=false;
   // console.log(formData.get());
   this.clearErrorMessages();
   let memberId = this.memberSearchForm.get('MemberId').value.trim();
   let fname=this.memberSearchForm.get("Fname").value.trim();
   let mname=this.memberSearchForm.get("Mname").value.trim();   
   let lname=this.memberSearchForm.get("Lname").value.trim();
   let subscriberId=this.memberSearchForm.get("SubscriberId").value.trim();
   let Gender=this.memberSearchForm.get("Gender").value;
   let dob=this.memberSearchForm.get("DateOfBirth").value;
   let memberStartDate=this.memberSearchForm.get("MemberStartDate").value;
   let memberEndDate=this.memberSearchForm.get("MemberEndDate").value;
   //(VE 30-Jul-2021  starts)
   let benefitPlanId=this.memberSearchForm.get("benefitPlanId").value;
   let clientId =this.memberSearchForm.get("clientId").value;
   let tier =this.memberSearchForm.get("tier").value;
   let alternateId=this.memberSearchForm.get("alternateId").value;
   //(VE 30-Jul-2021  ends)
    console.log(this.memberSearchForm.value);
    //let alphaNum = /^([a-zA-Z0-9 ]+)$/; 
    let alphaNum = /^([a-zA-Z0-9]+)$/; //Modified by venkatesh Enigonda
    let num1 = /^([0-9]+)$/; 
    let nam1 = /^([a-zA-Z]+)$/; //Modified by Venkatesh Enigonda
    console.log(num1.test(memberId));
    let a1=num1.test(memberId);
    console.log(nam1.test(fname)); // From line 202 to 209 Modified by Venkatesh Enigonda
    let a2=nam1.test(fname);
    console.log(nam1.test(mname));
    let a3=nam1.test(mname);
    console.log(nam1.test(lname));
    let a4=nam1.test(lname);
    console.log(alphaNum.test(subscriberId));
    let a5=alphaNum.test(subscriberId);      
    
    // if(memberStartDate!=null && memberStartDate!='' && memberEndDate!=null && memberEndDate!=''){
    //   if(memberStartDate>memberEndDate){
    //   this.memStartDateErr.isValid=true;
    //   this.memSearchError=false;
    //   this.memStartDateErr.errMsg='Member Start Date should not be greater than Member End Date';
    //   return;
    //   }
    //   if(memberStartDate==memberEndDate){
    //   this.memStartDateErr.isValid=true;
    //   this.memSearchError=false;
    //   this.memStartDateErr.errMsg='Member Start Date should not be EQUAL to Member End Date';
    //   return;
    //   }
    // }
    
    // till here
    // if((memberStartDate==null || memberStartDate=='') && (memberEndDate!=null && memberEndDate!='')){
    //   this.memStartDateErr.isValid=true;
    //   this.memSearchError=false;
    //   this.memStartDateErr.errMsg='Member Start Date should not be empty or Invalid';
    //   return;
    // }
    // if((memberEndDate==null || memberEndDate=='') && (memberStartDate!=null && memberStartDate!='')){
    //   this.memEndDateErr.isValid=true;
    //   this.memSearchError=false;
    //   this.memEndDateErr.errMsg='Member End Date should not be empty or Invalid';
    //   return;
    // }
    
    if(!a1 && memberId!=''){
      this.memIdErr.isValid=true;
      this.memIdErr.errMsg='Member Id is not valid. It should be a number';
      return;

    }


    if(!a2 && fname!=''){    // Start by Venkatesh Enigonda
      this.memFnameErr.isValid=true;
      this.memFnameErr.errMsg='First Name is not valid. It should be a Alphabet';
      return;
    }
    if(!a3 && mname!=''){
      this.memMnameErr.isValid=true;
      this.memMnameErr.errMsg='Middle Name is not valid. It should be a Alphabet';
      return;
    }
    if(!a4 && lname!=''){
      this.memLnameErr.isValid=true;
      this.memLnameErr.errMsg='Last Name is not valid. It should be a Alphabet';
      return;
    }
    if(!a5 && subscriberId!=''){
      this.memSubIdErr.isValid=true;
      this.memSubIdErr.errMsg='Invalid Subscriber Id. Special Chracters not allowed';
      return;
    }   // End by Venkatesh Enigonda

   // stop here if form is invalid
   if (this.memberSearchForm.invalid || this.memberSearchForm.value=='') {
     this.memSearchError=true;
       return;
   }
   if(memberId=='' && fname=='' && mname=='' && lname=='' && subscriberId=='' && dob=='' && Gender=='' && memberStartDate=='' && memberEndDate=='' && clientId=='' && tier=='' && alternateId=='' && benefitPlanId =='')  {  //(VE 28-Jul-2021 )
    this.noSearchFieldEntered = true;
     return;
   }
   console.log(JSON.stringify(formData.value));
   console.log(this.m.Gender.value);
   console.log(memberId);

   this.memberService.memberSearch(memberId,fname,mname, lname, subscriberId, dob, Gender, memberStartDate,memberEndDate,benefitPlanId,clientId,tier,alternateId).subscribe(    //(VE 30-Jul-2021  )    
    (data:IMemberSearchResponse[])=>{
       console.log(data);
       this.clearErrorMessages();
       console.log(data[0].memberId)
       if(data==null || data.length==0){
         console.log("Records are Empty");
         
       }
       else{
         console.log("another issue");
         
       }
       setTimeout(()=>{
          this.searchDataSource = new MatTableDataSource(data);
          this.isSearchDataThere = true;
          this.noSearchFieldEntered = false;
          this.memSearchError = false;
       }, 400);
       setTimeout(()=>{         
        this.searchDataSource.paginator = this.paginator;
        this.searchDataSource.sort = this.sort;
       },700)
     }, (error) => {
       console.log("no record found");
       this.isSearchDataThere = false;
       this.memSearchError = true;
       this.noSearchFieldEntered = false;
       this.searchErrorMessage = error.message;
       this.clearErrorMessages();       
     }
   )
  }

  openViewModal(bool, id:any){
    this.isViewModal = true;
    this.openCustomModal(bool, id);
  }
  openCustomModal(open: boolean, id:any) {
    this.isDisabled=false;
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100);
    this.isCustomModalOpen = open;
    this.submitted = false;
    if(open && id==null){
      this.isAddMode = true;
    }
    if (!open && id==null) {
      this.memberForm.reset();
      this.isAddMode = false;
      this.isViewModal=false;
    }
    console.log("id inside modal: "+id);

    if(id!=null && open){
      this.isAddMode = false;      
      if(id!=null){
        console.log(id);
        
          this.uMemberId = id.memberHrid;
          setTimeout(()=>{
            this.uClientId=id.clientId;
            this.uContractId=id.contractId;
            this.uPlanId=id.planId;
            this.uTierId=id.tierId;
            
            this.memberForm.patchValue({
              memberId: id.memberHrid,
              clientId: id.clientId,
              contractId: id.contractId,
              planId: id.planId,
              tier:id.tier,
              benefitPlanId:id.benefitPlanId, //(VE 30-07-2021)
              tierId: id.tierId,//(VE 30-07-2021)
              alternateId:id.alternateId,
              fname: id.fname,
              lname: id.lname,
              mname: id.mname,
              subscriberId: id.subscriberId,
              subscriberFname: id.subscriberFname,
              subscriberLname: id.subscriberLname,
              gender: id.gender,
              status: id.status,
              laserValue: id.laserValue,
              isUnlimited: (id.isUnlimited==null || id.isUnlimited=='N')?false:true,
              memberStartDate: this.datePipe.transform(id.memberStartDate, 'yyyy-MM-dd'),
              memberEndDate: this.datePipe.transform(id.memberEndDate, 'yyyy-MM-dd'),
              dateOfBirth: this.datePipe.transform(id.dateOfBirth, 'yyyy-MM-dd')          
            });

          },900);
          console.log(id.isUnlimited);
          
          
          console.log(this.memberForm.value);
          this.memberForm.disable();
          this.f.laserValue.enable();
         // this.f.isUnlimited.enable(); 
          //this.isUnlimitedChecked();
          
          if(this.isViewModal==true){
            this.memberForm.disable();
            //this.f.isUnlimited.disable(); 
          }
          if(this.isViewModal==false){
            this.memberForm.disable();
             this.f.laserValue.enable();
            // this.f.isUnlimited.enable(); 
            // if(this.f.isUnlimited.value==true || id.isUnlimited=='Y'){
            //   this.memberForm.patchValue({
            //     laserValue: 0
            //   });
            //   this.f.laserValue.disable();
            // }
          }
         
       }        
  }
}
// isUnlimitedChecked(){  
//   if(this.f.isUnlimited.value){
//     this.memberForm.patchValue({
//       laserValue: 0
//     });

//     this.f.laserValue.disable();
//   }
//   else{
//     this.f.laserValue.enable();            
//   }
// }
get m(){return this.memberSearchForm.controls}
get f(){return this.memberForm.controls}
  onSubmit() {
    
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.memberForm.invalid) {
        return;
    }

    this.loading = true;
    
    if (this.isAddMode) {
      
        this.addMember();
    } else {
        this.updateMember();
        
    }
}
private addMember() {
  this.isDisabled=true;
    let addMembObj = {
      memberId: this.f.memberHrid.value,
      memberHrid: this.f.memberHrid.value,
      fname: this.f.fname.value,
      lname: this.f.lname.value,
      mname: this.f.mname.value==''?'E':this.f.mname.value,
      gender: this.f.gender.value,
      status: 1,      
      laserValue: this.f.laserValue.value,
      isUnlimited: this.f.isUnlimited.value==true?'Y':'N',
      subscriptionID: this.f.subscriberId.value,
      userId: this.loginService.currentUserValue.name,
      memberStartDate: this.datePipe.transform(this.f.memberStartDate.value, 'yyyy-MM-dd'),
      memberEndDate: this.datePipe.transform(this.f.memberEndDate.value, 'yyyy-MM-dd'),
      dateOfBirth:  this.datePipe.transform(this.f.dateOfBirth.value, 'yyyy-MM-dd')
    }
    console.log(addMembObj);

  this.memberService.addMember(addMembObj)
      .pipe(first())
      .subscribe({
          next: () => {
            
            this.openCustomModal(false, null);
            this.memberForm.reset();     
                 
              this.alertService.success('New Member added', { keepAfterRouteChange: true });
              //this.router.navigate(['../'], { relativeTo: this.route });
          },
          error: error => {
              this.alertService.error(error);
              this.loading = false;
          }
      });
      
  }

  private updateMember() {
    this.isDisabled=true;
      let updateMemberObj = {
      laserType:"Member",
      laserTypeId: String(this.uMemberId),
      laserValue: Number(this.f.laserValue.value),
      isUnlimited: this.f.isUnlimited.value==true?'Y':'N',
      status: 1,
      createdBy: this.loginService.currentUserValue.name,
      updatedBy: this.loginService.currentUserValue.name,
      createdOn:null,
      updatedOn:null  
      }
      
      this.memberService.updateMember(updateMemberObj)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.openCustomModal(false,null); 
                  this.searchMember(this.memberSearchForm);
                  this.memberForm.reset();
                  
                  this.alertService.success('Member updated', { 
                    keepAfterRouteChange: true });
                 // this.router.navigate(['../../'], { relativeTo: this.route });                    
              },
              error: error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
          });
  }

}
