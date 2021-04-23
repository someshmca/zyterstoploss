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

  contractForm: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    isCustomModalOpen: boolean = false;
    uContractId: number;
    startEndDateErr = {
      isDateErr: false,
      dateErrMsg: ''
    };
    runInStartEndErr = {
      isDateErr: false,
      dateErrMsg: ''
    };
    runOutStartEndErr = {
      isDateErr: false,
      dateErrMsg: ''
    };
    @ViewChild("focusElem") focusTag: ElementRef;

  displayedColumns: string[] = ['clientName','contractId', 'startDate','endDate','clientId'];
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
      contractId: 0,
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
    },{validators: this.dateLessThan('startDate', 'endDate')}
      
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
      if (f.value > t.value) {
        this.isDateValid=false;
          return { 
            dates: "Start Date should not be greater than End Date"
          }; 
      }
      return {};
    }
}
  openCustomModal(open: boolean, id:any) {
    setTimeout(()=>{
      this.focusTag.nativeElement.focus();
    }, 100);
    this.submitted = false;
    this.loading = false;
    if(open && id==null){
      this.isAddMode = true;
    }
    
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

      // reset alerts on submit
      this.alertService.clear();
      this.runInStartEndErr.isDateErr=false;
      this.runInStartEndErr.dateErrMsg='';
      this.runOutStartEndErr.isDateErr=false;
      this.runOutStartEndErr.dateErrMsg='';

      // stop here if form is invalid
     if (this.contractForm.invalid) {
      return;
     }
     if(this.contractForm.valid && this.f.runInStartDate.value > this.f.runInEndDate.value){
       this.runInStartEndErr.isDateErr=true;
       this.runInStartEndErr.dateErrMsg = 'Run-In Start date should not be greater than Run-In End date';
       
       return;
     }
     
     if(this.contractForm.valid && this.f.runOutStartDate.value > this.f.runOutEndDate.value){
      this.runOutStartEndErr.isDateErr=true;
      this.runOutStartEndErr.dateErrMsg = 'Run-Out Start date should not be greater than Run-Out End date';
      
      return;
    }
     //this.contractForm.valid;
      this.loading = true;
      if (this.isAddMode) {
          this.addContract();
      } else {
          this.updateContract();
          
      }
  }
  
  private addContract() {
   
    console.log(this.contractForm.value);
    let addObj = {
      contractId: 0,
      clientId: this.contractForm.get('clientId').value,
      startDate: this.contractForm.get('startDate').value,
      endDate: this.contractForm.get('endDate').value,
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
      policyYear: 0,
    }
    if(addObj.runInStartDate=='')
      addObj.runInStartDate = "2010-01-01";
    if(addObj.runInEndDate=='')
      addObj.runInEndDate = "2011-01-01";
    if(addObj.runOutStartDate=='')
      addObj.runOutStartDate = "2010-01-01";
    if(addObj.runOutEndDate=='')
      addObj.runOutEndDate = "2011-01-01";
    if(addObj.terminationDate=='')
      addObj.terminationDate = "2012-01-01";
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
          policyYear: 0,   
        };
        if(updateConObj.runInStartDate=='')
          updateConObj.runInStartDate = "2009-10-10";
        if(updateConObj.runInEndDate=='')
          updateConObj.runInEndDate = "2009-11-11";
        if(updateConObj.runOutStartDate=='')
          updateConObj.runOutStartDate = "2009-10-10";
        if(updateConObj.runOutEndDate=='')
          updateConObj.runOutEndDate = "2009-11-11";
        if(updateConObj.terminationDate=='')
          updateConObj.terminationDate = "2010-10-10";
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
