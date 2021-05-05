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
  displayedColumns: string[] = ['memberId','subscriberId', 'fname', 'lname', 'mname', 'gender','memberStartDate', 'memberEndDate','dateOfBirth','status', 'userId'];
  searchDataSource: any;
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
  
  activeClients: IActiveClient[] = [];
  activeContracts: IContract[]=[];
  plans: IPlanAll[]=[];
  tires: ITire[] = [];

  memberSearchErr: any;
  isSearchDataThere: boolean = false;
  noSearchResultsFound: boolean = false;

  constructor(private mb: FormBuilder, private fb: FormBuilder, private memberService:MemberService, private alertService: AlertService, private datePipe: DatePipe, private loginService: LoginService, private clientService: ClientsService, private contractService: ContractService, private planService: HealthPlanService) { }

  ngOnInit() {
    this.memberSearchForm = this.mb.group({
      MemberId: [''],
      SubscriberId:[''],
      MemberStartDate: [''],
      MemberEndDate: [''],
      Fname:[''],
      Lname: [''],
      Mname: '',
      DateOfBirth:[''],
      Gender: ['']
    });
    

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
      dateOfBirth: ['', Validators.required]
    });
    
    setTimeout(()=>{
      this.focusMSTag.nativeElement.focus();
      //this.focusTag.nativeElement.focus();
    }, 200);
    this.getActiveClients();
  }  // end of ngOnInit 

  getActiveClients(){
    this.clientService.getActiveClients().subscribe(
      (data)=>{
        this.activeClients = data;
        debugger;
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

  searchMember(formData: FormGroup){
    this.memSearchSubmitted = true;
    this.memSearchError=false;
   // console.log(formData.get());
   let memberId = this.memberSearchForm.get('MemberId').value;
   let fname=this.memberSearchForm.get("Fname").value;
   let mname=this.memberSearchForm.get("Mname").value;   
   let lname=this.memberSearchForm.get("Lname").value;
   let subscriberId=this.memberSearchForm.get("SubscriberId").value;
   let Gender=this.memberSearchForm.get("Gender").value;
   let dob=this.memberSearchForm.get("DateOfBirth").value;
   let memberStartDate=this.memberSearchForm.get("MemberStartDate").value;
   let memberEndDate=this.memberSearchForm.get("MemberEndDate").value;
    console.log(this.memberSearchForm.value);
    
   // stop here if form is invalid
   if (this.memberSearchForm.invalid || this.memberSearchForm.value=='') {
     this.memSearchError=true;
       return;
   }
   if(memberId=='' && fname=='' && mname=='' && lname=='' && subscriberId=='' && dob=='' && Gender=='' && memberStartDate=='' && memberEndDate==''){
    this.memSearchError = true;
     return;
   }
   console.log(JSON.stringify(formData.value));
   console.log(this.m.Gender.value);
   debugger;
   this.memberService.memberSearch(memberId,fname,mname, lname, subscriberId, dob, Gender, memberStartDate, memberEndDate).subscribe(
     (data:IMemberSearchResponse[])=>{
       console.log(data);
       setTimeout(()=>{
          this.searchDataSource = new MatTableDataSource(data);
          this.isSearchDataThere = true;
          this.noSearchResultsFound = false;
       }, 400);
       setTimeout(()=>{         
        this.searchDataSource.paginator = this.paginator;
        this.searchDataSource.sort = this.sort;
       },700)
     }, (error) => {
       this.isSearchDataThere = false;
       this.noSearchResultsFound = true;
       this.searchErrorMessage = error.message;
     }
   )
  }

  openCustomModal(open: boolean, id:any) {
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
    }
    console.log("id inside modal: "+id);

    if(id!=null && open){
      this.isAddMode = false;      
      if(id!=null){
          this.memberForm.patchValue({
            memberId: id.memberHrid,
            fname: id.fname,
            lname: id.lname,
            mname: id.mname,
            subscriberId: id.subscriberId,
            gender: id.gender,
            status: id.status,
            memberStartDate: this.datePipe.transform(id.memberStartDate, 'yyyy-MM-dd'),
            memberEndDate: this.datePipe.transform(id.memberEndDate, 'yyyy-MM-dd'),
            dateOfBirth: this.datePipe.transform(id.dateOfBirth, 'yyyy-MM-dd')          
          })        
       }        
  }
}
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
    let addMembObj = {
      memberId: this.f.memberHrid.value,
      memberHrid: this.f.memberHrid.value,
      fname: this.f.fname.value,
      lname: this.f.lname.value,
      mname: this.f.mname.value==''?'E':this.f.mname.value,
      gender: this.f.gender.value,
      status: 1,      
      laserValue: 10,
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
      let updateMemberObj = {
        memberId: 'M111',
        memberHrid: this.f.memberHrid.value,
        alternateId: this.f.alternateId.value,
        clientId: this.f.clientId.value,
        contractId: Number(this.f.contractId.value),
        planId: Number(this.f.planId.value),
        tierId: Number(this.f.tierId.value),
        fname: this.f.fname.value,
        lname: this.f.lname.value,
        mname: this.f.mname.value,
        gender: this.f.gender.value,
        status: this.f.status.value==true?1:0,
        laserValue: 10,
        isUnlimited: this.f.isUnlimited.value==true?'Y':'N',
        userId: this.loginService.currentUserValue.name,
        memberStartDate: this.f.memberStartDate.value,
        memberEndDate: this.f.memberEndDate.value,
        subscriberId: this.f.subscriberId.value,
        subscriberFname: this.f.subscriberFname.value,
        subscriberLname: this.f.subscriberLname.value,
        dateOfBirth: this.f.dateOfBirth.value 
      }
      
      this.memberService.updateMember(updateMemberObj)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.openCustomModal(false,null); 
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
