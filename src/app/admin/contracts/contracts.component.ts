import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { IContract, IContractIDRequest,
  IContractAdd, IAddContractSuccess,IActiveClient,
  IContractUpdate, IUpdateContractSuccess} from '../models/contracts-model';
import {ContractService} from '../services/contract.service';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { formatDate, DatePipe } from '@angular/common';
import { ClientsService } from '../services/clients.service';
import { IClient } from '../models/clients-model';
import { LoginService } from 'src/app/shared/services/login.service';
@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css'],
  providers: [DatePipe]
})
export class ContractsComponent implements OnInit {
  contracts:IContract[] = [];
  contractIDs:IContract[] = [];
  clients: IClient[] = [];
  contract: IContractIDRequest;
  activeClients: IActiveClient[]=[];
  updateObj: IContract[]=[];
  ustartDate:string;
  uendDate:string;
  uRunInStartDate:string;
  uRunInEndDate:string;
  uRunOutStartDate:string;
  uRunOutEndDate:string;
  uTerminationDate:string;
  isDateValid:boolean;
  contractStartDateErrMsg: any = '';
  contractForm: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    isCustomModalOpen: boolean = false;
    uContractId: number;
    startDateErr = {isDateErr: false,dateErrMsg: ''};
    endDateErr = {isDateErr: false,dateErrMsg: ''};
    runInStartErr = {isDateErr: false, dateErrMsg: ''};
    runInEndErr = {isDateErr: false, dateErrMsg: ''};
    runOutStartErr = {isDateErr: false, dateErrMsg: ''};
    runOutEndErr = {isDateErr: false, dateErrMsg: ''};
    terminationDateErr = {isDateErr: false, dateErrMsg: ''};

  isDisabled: boolean;
  @ViewChild("focusElem") focusTag: ElementRef;
  isContractStartDateInvalid: boolean=false;

  displayedColumns: string[] = ['clientName','contractId', 'description', 'startDate','endDate','clientId'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contractService: ContractService,
    private clientService: ClientsService,
    private alertService: AlertService,
    private datePipe: DatePipe,
    private loginService: LoginService
  ) { }
  ngOnInit(){
    
    this.getAllContracts();
    this.getActiveClients();   
    this.contractForm = this.formBuilder.group({
      contractId: '',
      clientId:['', Validators.required],
      startDate:['', Validators.required],
      endDate:['', Validators.required],
      claimsAdministrator:"",
      pharmacyClaimsAdministrator:"",
      runInStartDate:[''],
      runInEndDate:[''],
      runOutStartDate:[''],
      runOutEndDate:[''],
      terminationDate:[''],
      status:0,
      userId:this.loginService.currentUserValue.name,
      ftn: '',
      ftnName: '',
      policyYear: 0,
    }
      
     );    
  }

  getAllContracts(){    
    this.contractService.getAllContracts().subscribe(
      (data: IContract[]) => {
        
          this.contractIDs = data;
          this.contracts = data;
          this.dataSource = new MatTableDataSource(this.contracts);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      }
    )
  }  
  getActiveClients(){
    
    this.contractService.getAllClients().subscribe(
      (data)=>{
        data.sort((a, b) => (a.clientName > b.clientName) ? 1 : -1);
        this.activeClients = data;
      }
    )
  }
  getContract(contractId){
    this.contractService.getContract(contractId).subscribe((data)=>{
      this.updateObj = data;
      console.log(this.updateObj[0].clientId);
      console.log(this.updateObj[0].contractId);
      this.uContractId = this.updateObj[0].contractId;
      this.contractForm.patchValue({
        contractId: Number(this.uContractId),
        clientId: this.updateObj[0].clientId,
        startDate: this.datePipe.transform(this.updateObj[0].startDate, 'yyyy-MM-dd'),
        endDate: this.datePipe.transform(this.updateObj[0].endDate, 'yyyy-MM-dd'),
        claimsAdministrator:this.updateObj[0].claimsAdministrator,
        pharmacyClaimsAdministrator:this.updateObj[0].pharmacyClaimsAdministrator,            
        runInStartDate:this.datePipe.transform(this.updateObj[0].runInStartDate, 'yyyy-MM-dd'),
        runInEndDate:this.datePipe.transform(this.updateObj[0].runInEndDate, 'yyyy-MM-dd'),
        runOutStartDate: this.datePipe.transform(this.updateObj[0].runOutStartDate, 'yyyy-MM-dd'),
        runOutEndDate: this.datePipe.transform(this.updateObj[0].runOutEndDate, 'yyyy-MM-dd'),
        terminationDate:this.datePipe.transform(this.updateObj[0].terminationDate, 'yyyy-MM-dd'),
        status:this.updateObj[0].status  
      });
      
    })
  }
  dateLessThan(from: string, to: string) {
  
    return (group: FormGroup): {[key: string]: any} => {
      let f = group.controls[from];
      let t = group.controls[to];
      
      if(t.value !=null)
      {
      if (f.value > t.value) {
        this.isDateValid=false;
          return { 
            dates: "Start Date should not be greater than End Date"
          }; 
      }
    }
      return {};
  }
}
clearErrorMessages(){  
  this.startDateErr.isDateErr=false;
  this.startDateErr.dateErrMsg='';
  this.endDateErr.isDateErr=false;
  this.endDateErr.dateErrMsg='';
  this.runInStartErr.dateErrMsg='';
  this.runInStartErr.isDateErr=false;
  this.runInEndErr.dateErrMsg=''
  this.runInEndErr.isDateErr=false;
  this.runOutStartErr.isDateErr=false;
  this.runOutStartErr.dateErrMsg='';
  this.runOutEndErr.isDateErr=false;
  this.runOutEndErr.dateErrMsg='';
  this.terminationDateErr.dateErrMsg='';
  this.contractStartDateErrMsg = '';
  this.isContractStartDateInvalid=false;
}
  openCustomModal(open: boolean, id:any) {
    setTimeout(()=>{
      this.focusTag.nativeElement.focus();
    }, 100);
    this.submitted = false;
    this.loading = false;
    this.isDisabled=false;
    if(open && id==null){
      this.isAddMode = true;
    }
    this.clearErrorMessages();
    this.isCustomModalOpen = open;
    if (!open && id==null) {
      this.getAllContracts();
      this.contractForm.reset();
      this.isAddMode = false;
    }
    console.log("id inside modal: "+id);
    //this.contId=id.contractId==0?"":id.contractId;
    if(id!=null && open){
      this.isAddMode = false;
      this.getContract(id);
      console.log(this.updateObj);
           
          
    }
  }
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  get f() { return this.contractForm.controls; }

  onSubmit() {
      this.submitted = true;
      let flag:boolean= false;
      this.alertService.clear();
      this.clearErrorMessages();
     if (this.contractForm.invalid) {
      return;
     }
      //call service
      let clientId:string = this.f.clientId.value;
      let ContractStartDate = this.datePipe.transform(this.f.startDate.value, 'MM-dd-yyyy');  
      this.contractService.validateContractStartDate(clientId, ContractStartDate).pipe(first())    
      .subscribe({ 
            next: (data) => {
              console.log(data);  
              
              if(data!=''){      
                this.isContractStartDateInvalid=true;            
                  this.contractStartDateErrMsg = data;
                  flag=false;
                  this.contractForm.invalid;
                  return;
              }                
              if(data==''){
                this.isContractStartDateInvalid = false;          
                this.contractStartDateErrMsg = data;
                flag=false;
    if(this.contractForm.valid && this.f.startDate.value!=null && this.f.endDate.value!=null){
      if(this.contractForm.valid && this.f.startDate.value > this.f.endDate.value){
        this.startDateErr.isDateErr=true;
        this.startDateErr.dateErrMsg = 'Contract start date should not be greater than Contract end date'; 
        flag=false;     
        return;
      }
    }
    if(this.contractForm.valid && this.f.startDate.value==null && this.f.endDate.value!=null){
      this.startDateErr.isDateErr=true;
      this.startDateErr.dateErrMsg = 'Contract start date should not be empty or Invalid';  
      flag=false;         
      return;
    }
    if(this.contractForm.valid && this.f.startDate.value!=null && this.f.endDate.value==null){
      this.endDateErr.isDateErr=true;
      this.endDateErr.dateErrMsg = 'Contract End date should not be empty or Invalid';    
      flag=false;       
      return;
    }
    if(this.contractForm.valid && this.f.runInStartDate.value!=null && this.f.runInEndDate.value!=null){
     if(this.f.runInStartDate.value > this.f.runInEndDate.value){
       this.runInStartErr.isDateErr=true;
       this.runInStartErr.dateErrMsg = 'Run-In Start date should not be greater than Run-In End date';  
       flag=false;          
       return;
     }
    }
    if(this.contractForm.valid && this.f.runInStartDate.value==null && this.f.runInEndDate.value!=null){
      this.runInStartErr.isDateErr=true;
      this.runInStartErr.dateErrMsg = 'Run-In Start date should not be empty';
      flag=false;
             
      return;
    }
    if(this.contractForm.valid && this.f.runInStartDate.value!=null && this.f.runInEndDate.value==null){
     this.runInEndErr.isDateErr=true;
     this.runInEndErr.dateErrMsg = 'Run-In End date should not be empty';    
     flag=false;        
     return;
   }
   if(this.contractForm.valid && this.f.runOutStartDate.value!=null && this.f.runOutEndDate.value!=null){
    if(this.f.runOutStartDate.value > this.f.runOutEndDate.value){
      this.runOutStartErr.isDateErr=true;
      this.runOutStartErr.dateErrMsg = 'Run-Out Start date should not be greater than Run-Out End date'; 
      flag=false;           
      return;
    }
  }
  if(this.contractForm.valid && this.f.runOutStartDate.value==null && this.f.runOutEndDate.value!=null){
    this.runOutStartErr.isDateErr=true;
    this.runOutStartErr.dateErrMsg = 'Run-Out Start date should not be empty';       
    flag=false;     
    return;
  }
   if(this.contractForm.valid && this.f.runOutStartDate.value!=null && this.f.runOutEndDate.value==null){
      this.runOutEndErr.isDateErr=true;
      this.runOutEndErr.dateErrMsg = 'Run-Out End date should not be empty';  
      flag=false;         
      return;
    }
  if(this.f.terminationDate.value !='' || this.f.terminationDate.value!=null){
      if(this.f.terminationDate.value < this.f.startDate.value || this.f.terminationDate.value > this.f.endDate.value){        
        this.terminationDateErr.isDateErr=true;
        this.terminationDateErr.dateErrMsg = 'Termination date should be between Contract Start and End Dates'; 
        flag=false;          
        return;
      }
    }

      if (this.isAddMode) {
        
        this.addContract();
      } else {
          
          this.updateContract();            
      }
      
                
                  
              }                      
            },
            error: error => {
              console.log(error);           
              
              this.isContractStartDateInvalid = false; 
            }
        });
      //end of call service

    
     //this.contractForm.valid;
      this.loading = true;
      // setTimeout(
      //   () => {  
      //   }, 1400
      // )
      
    
           
  }
  // callAddUpdate(){        
  //   
  //   if(!this.isContractStartDateInvalid){
  //           
  //     if (this.isAddMode) {
  //       this.addContract();
  //     } else {
  //         this.updateContract();            
  //     }
  //   }
  // }
  private addContract() {
    this.isDisabled=true;
    console.log(this.contractForm.value);
    let addObj = {
      contractId: 0,
      clientId: this.contractForm.get('clientId').value,
      startDate: this.datePipe.transform(this.f.startDate.value, 'yyyy-MM-dd'),
      endDate: this.datePipe.transform(this.f.endDate.value, 'yyyy-MM-dd'),
      claimsAdministrator:this.contractForm.get('claimsAdministrator').value,
      pharmacyClaimsAdministrator:this.contractForm.get('pharmacyClaimsAdministrator').value,          
      runInStartDate:this.datePipe.transform(this.f.runInStartDate.value, 'yyyy-MM-dd'),
      runInEndDate:this.datePipe.transform(this.f.runInEndDate.value, 'yyyy-MM-dd'),
      runOutStartDate: this.datePipe.transform(this.f.runOutStartDate.value, 'yyyy-MM-dd'),
      runOutEndDate: this.datePipe.transform(this.f.runOutEndDate.value, 'yyyy-MM-dd'),
      terminationDate:this.datePipe.transform(this.f.terminationDate.value,  'yyyy-MM-dd'),
      status: 1,
      userId: this.loginService.currentUserValue.name,
      ftn: '',
      ftnName: '',
      policyYear: null
    }
    if(addObj.runInStartDate=='')
      addObj.runInStartDate = null;
    if(addObj.runInEndDate=='')
      addObj.runInEndDate = null
    if(addObj.runOutStartDate=='')
      addObj.runOutStartDate = null;
    if(addObj.runOutEndDate=='')
      addObj.runOutEndDate = null;
    if(addObj.terminationDate=='')
      addObj.terminationDate = null;
    console.log(addObj);
    
    this.contractService.addContract(addObj)
        .pipe(first())
        .subscribe({
            next: () => {
              this.openCustomModal(false, null);
              this.getAllContracts();
              this.contractForm.reset();                
                this.alertService.success('New Contract added', { keepAfterRouteChange: true });               
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        });
        
    }

    private updateContract() {
      this.isDisabled = true;
        let updateConObj={
          contractId: this.uContractId,
          clientId: this.contractForm.get('clientId').value,
          startDate: this.datePipe.transform(this.contractForm.get('startDate').value, 'yyyy-MM-dd'),
          endDate: this.datePipe.transform(this.contractForm.get('endDate').value, 'yyyy-MM-dd'),
          claimsAdministrator:this.contractForm.get('claimsAdministrator').value,
          pharmacyClaimsAdministrator:this.contractForm.get('pharmacyClaimsAdministrator').value,            
          runInStartDate:this.datePipe.transform(this.f.runInStartDate.value, 'yyyy-MM-dd'),
          runInEndDate:this.datePipe.transform(this.f.runInEndDate.value, 'yyyy-MM-dd'),
          runOutStartDate: this.datePipe.transform(this.f.runOutStartDate.value, 'yyyy-MM-dd'),
          runOutEndDate: this.datePipe.transform(this.f.runOutEndDate.value, 'yyyy-MM-dd'),
          terminationDate:this.datePipe.transform(this.f.terminationDate.value,  'yyyy-MM-dd'),
          status:this.contractForm.get('status').value==true?1:0,
          userId: this.loginService.currentUserValue.name,
          ftn: '',
          ftnName: '',
          policyYear: null,   
        };
        if(updateConObj.runInStartDate=='')
          updateConObj.runInStartDate = null;
        if(updateConObj.runInEndDate=='')
          updateConObj.runInEndDate =  null;
        if(updateConObj.runOutStartDate=='')
          updateConObj.runOutStartDate =  null;
        if(updateConObj.runOutEndDate=='')
          updateConObj.runOutEndDate = null;
        if(updateConObj.terminationDate=='')
          updateConObj.terminationDate = null;
        if(updateConObj.runInStartDate > updateConObj.runInEndDate){
          console.log("start date should not be greater than end date");
          
        }
        
        this.contractService.updateContract(updateConObj)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.openCustomModal(false,null); 
                    this.contractForm.reset();
                    
                    this.getAllContracts();
                    this.alertService.success('Contract updated', { 
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
