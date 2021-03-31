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
     
    @ViewChild("focusElem") focusTag: ElementRef;

  displayedColumns: string[] = ['clientName','contractId', 'effectiveDate','endDate','clientId'];
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
   clientId:['', Validators.required],
   effectiveDate:['', Validators.required],
   endDate:['', Validators.required],
   claimsAdministrator:"",
   pharmacyClaimsAdministrator:"",
   runInStartDate:['', Validators.required],
   runInEndDate:['', Validators.required],
   runOutStartDate:['', Validators.required],
   runOutEndDate:['', Validators.required],
   terminationDate:['', Validators.required],
   status:0,
   userId:"",
   contractId:""
    },{validator: this.dateLessThan('effectiveDate', 'endDate')}   
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
  dateLessThan(from: string, to: string) {
  
    return (group: FormGroup): {[key: string]: any} => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        this.isDateValid=false;
        return {
          dates: from+' '+"should be greater than" +' '+to
        };
      }
      return {};
    }
}
  openCustomModal(open: boolean, id:any) {
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
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
      if(id!=null){
        //this.selectedValue=id.parentID;
        this.isAddMode = false;
        this.ustartDate = this.datePipe.transform(id.effectiveDate, 'yyyy-MM-dd');
        this.uendDate = this.datePipe.transform(id.endDate, 'yyyy-MM-dd');
        this.uRunInStartDate= this.datePipe.transform(id.runInStartDate, 'yyyy-MM-dd');
        this.uRunInEndDate= this.datePipe.transform(id.runInEndDate, 'yyyy-MM-dd');
        this.uRunOutStartDate= this.datePipe.transform(id.runOutStartDate, 'yyyy-MM-dd');
        this.uRunOutEndDate= this.datePipe.transform(id.runOutEndDate, 'yyyy-MM-dd');
        this.uTerminationDate= this.datePipe.transform(id.terminationDate, 'yyyy-MM-dd');
          this.contractForm.patchValue({
            contractId:Number.parseInt(id.contractId),
            clientId: id.clientId,
            clientName: id.clientName,
            //status: id.status,
            effectiveDate: this.ustartDate,
            endDate: this.uendDate,
            claimsAdministrator:id.claimsAdministrator,
            pharmacyClaimsAdministrator:id.pharmacyClaimsAdministrator,            
            runInStartDate:this.uRunInStartDate,
           runInEndDate:this.uRunInEndDate,
           runOutStartDate:this.uRunOutStartDate,
           runOutEndDate:this.uRunOutEndDate,
           terminationDate:this.uTerminationDate,
           status:id.status
          
            //: id.clientId
          });
         
          
         }
          
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

      // stop here if form is invalid
     if (this.contractForm.invalid) {
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
   
    this.contractForm.patchValue({
      userId:this.loginService.currentUserValue.name,
      contractId:0,
      status:Boolean(this.contractForm.get('status').value)==true?1:0,
      runInStartDate:String(this.contractForm.get('runInStartDate').value)==""?null: String(this.contractForm.get('runInStartDate').value),
      runInEndDate:String(this.contractForm.get('runInEndDate').value)==""?null: String(this.contractForm.get('runInEndDate').value),
      runOutStartDate:String(this.contractForm.get('runOutStartDate').value)==""?null: String(this.contractForm.get('runOutStartDate').value),
      runOutEndDate:String(this.contractForm.get('runOutEndDate').value)==""?null: String(this.contractForm.get('runOutEndDate').value),
      terminationDate:String(this.contractForm.get('terminationDate').value)==""?null: String(this.contractForm.get('terminationDate').value),
     
    //: id.clientId
    });
    this.contractService.addContract(this.contractForm.value)
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
      
      this.contractForm.patchValue({
        userId:this.loginService.currentUserValue.name,
        status:Boolean(this.contractForm.get('status').value)==true?1:0,
      
      runInStartDate:String(this.contractForm.get('runInStartDate').value)=="null"?null: String(this.contractForm.get('runInStartDate').value),
      runInEndDate:String(this.contractForm.get('runInEndDate').value)=="null"?null: String(this.contractForm.get('runInEndDate').value),
      runOutStartDate:String(this.contractForm.get('runOutStartDate').value)=="null"?null: String(this.contractForm.get('runOutStartDate').value),
      runOutEndDate:String(this.contractForm.get('runOutEndDate').value)=="null"?null: String(this.contractForm.get('runOutEndDate').value),
      terminationDate:String(this.contractForm.get('terminationDate').value)=="null"?null: String(this.contractForm.get('terminationDate').value),
     
        //: id.clientId
      });
        this.contractService.updateContract(this.contractForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.openCustomModal(false,null); 
                    this.contractForm.reset();
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
