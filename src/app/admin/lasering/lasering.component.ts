import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import {IPlanAll, ITire} from '../models/health-plan.model';
import {ILaseringList, ILaseringAdd, ILaseringUpdate} from '../models/lasering.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IActiveClient, IClient } from '../models/clients-model';
import {IContract} from '../models/contracts-model';
import {LaseringService} from '../services/lasering.service';
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
import { Router } from '@angular/router';
import { IClientObj } from '../models/nav-popups.model';

@Component({
  selector: 'app-lasering',
  templateUrl: './lasering.component.html',
  styleUrls: ['./lasering.component.css'],
  providers: [DatePipe]
})
export class LaseringComponent implements OnInit {
  
  memberForm: FormGroup;
  searchErrorMessage: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  
  @ViewChild("focusElem") focusTag: ElementRef;
  @ViewChild("filterSearchInput") filterSearchInput: ElementRef;
  laseringColumns: string[] = ['fname', 'lname', 'memberId', 'laserValue', 'clientId'];
  laseringDataSource: any;
  
  uClientId:any;
  uContractId:any;
  uPlanId:any;
  uTierId:any;
  today: string;
  searchInputValue: string;

  isAddMode: boolean = false;
  isAdded: boolean;
  loading = false;
  submitted = false;
  isCustomModalOpen: boolean = false;
  memSearchError: boolean = false;
  noSearchFieldEntered: boolean = false;
  tempLaseringObj:IClientObj;

  activeClients: IActiveClient[] = [];
  activeContracts: IContract[]=[];
  plans: IPlanAll[]=[];
  tires: ITire[] = [];
  show: boolean = true;
  memberSearchErr: any;
  memIdErr = {isValid: false, errMsg: ''};
  memStartDateErr = {isValid: false, errMsg: ''};
  memEndDateErr = {isValid: false, errMsg: ''};

  isSearchDataThere: boolean = false;
  noSearchResultsFound: boolean = false;
  uMemberId: any;
  isDisabled: boolean=false;
  isFilterOn: boolean = false;
  isViewModal: boolean;

  constructor(private mb: FormBuilder, 
    private fb: FormBuilder, 
    private laseringService:LaseringService, 
    private alertService: AlertService, 
    private datePipe: DatePipe, 
    private loginService: LoginService, 
    private clientService: ClientsService, 
    private contractService: ContractService, 
    private planService: HealthPlanService, 
    private navService: NavPopupService,
    private router: Router) { }

  ngOnInit() {
    this.show=true;
    this.isAdded=false;

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
    this.today=this.datePipe.transform(new Date(Date.now()), "MM/dd/yyyy");    
    this.getLaseringStatus();
    this.getAllMembers();
    this.getActiveClients();
    this.clearErrorMessages();  
  } // end of ngOninit() method 
  
  public doFilter = (value: string) => {
    this.laseringDataSource.filter = value.trim().toLocaleLowerCase();
  }
  getLaseringStatus(){
    
    this.navService.laseringObj.subscribe((data)=>{
      this.tempLaseringObj = data;
      
      if(data.isAdd){
        this.memberForm.patchValue({
          clientId: data.clientId
        });
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
        this.getAllMembers();
      }
    });   
  }
  getAllMembers(){     
         
        this.laseringService.getAllMembers().subscribe(
          (data)=>{                
            
            this.laseringDataSource = new MatTableDataSource(data);   
            this.laseringDataSource.paginator = this.paginator;
            this.laseringDataSource.sort = this.sort;             
          }
        )
  }
  clearSearchInput(){
    this.searchInputValue='';
    this.filterSearchInput.nativeElement.value='';
    this.filterSearchInput.nativeElement.focus();
  }
  clearErrorMessages(){  
    this.memIdErr.isValid=false;
    this.memIdErr.errMsg='';
    this.memStartDateErr.isValid=false;
    this.memStartDateErr.errMsg='';
    this.memEndDateErr.isValid=false;
    this.memEndDateErr.errMsg='';
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
      this.isAdded=false;
      if(!this.isFilterOn){
        this.navService.resetLaseringObj();
        this.filterSearchInput.nativeElement.value='';
        this.filterSearchInput.nativeElement.blur();
      }
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
              tierId: id.tierId,
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
          debugger;
          this.memberForm.disable();
          this.f.laserValue.enable();
          this.f.isUnlimited.enable(); 
          //this.isUnlimitedChecked();
          if(this.isViewModal==true){
            this.memberForm.disable();
          }
          if(this.isViewModal==false){
            this.memberForm.disable();
            this.f.laserValue.enable();
            this.f.isUnlimited.enable(); 
          }
          if(this.f.isUnlimited.value==true || id.isUnlimited=='Y'){
            this.memberForm.patchValue({
              laserValue: 0
            });
            this.f.laserValue.disable();
          } 
       }        
  }
 }
 isUnlimitedChecked(){  
   if(this.f.isUnlimited.value){
     this.memberForm.patchValue({
       laserValue: 0
     });
 
     this.f.laserValue.disable();
   }
   else{
     this.f.laserValue.enable();            
   }
 }
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
 
 goBackPreviousNoFilter(){
  this.navService.resetProductObj();
  this.router.navigate(['/product']);
}
goBackPreviousScreen(){     
  if(this.isAdded){
    this.openCustomModal(false,null);
    this.searchInputValue = this.tempLaseringObj.clientName;
    this.filterSearchInput.nativeElement.focus();
  }
  if(!this.isAdded){
    this.router.navigate(['/product']);
  }
}
goBackCurrentScreen(){  
  this.isFilterOn=true;
  if(this.tempLaseringObj.isUpdate){
    
    this.openCustomModal(false,null);
    this.searchInputValue=this.tempLaseringObj.clientName;
    setTimeout(()=>this.filterSearchInput.nativeElement.focus(),500);
  }
  else{
    this.openCustomModal(false,null);
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

  this.laseringService.addMember(addMembObj)
      .pipe(first())
      .subscribe({
          next: () => {
            
            this.openCustomModal(false, null);
            this.memberForm.reset();     
                 
              this.alertService.success('New Member added', { keepAfterRouteChange: true });
              this.isAdded=true;
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
      
      this.laseringService.updateMember(updateMemberObj)
          .pipe(first())
          .subscribe({
              next: () => {
                  //this.openCustomModal(false,null); 
                  //this.memberForm.reset();
                  
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
