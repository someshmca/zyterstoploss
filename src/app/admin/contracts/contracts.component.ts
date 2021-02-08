import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { IContract, IContractIDRequest,
  IContractAdd, IAddContractSuccess,
  IContractUpdate, IUpdateContractSuccess} from '../models/contracts-model';
import {ContractService} from '../services/contract.service';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { formatDate, DatePipe } from '@angular/common';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.css'],
  providers: [DatePipe]
})
export class ContractsComponent implements OnInit {
  contracts:IContract[] = [];
  contractIDs:IContract[] = [];
  contract: IContractIDRequest;
  contractForm: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    isCustomModalOpen: boolean = false;

  displayedColumns: string[] = ['contractsId', 'contractEffectiveDate', 'contractEndDate', 'contractStatus', 'contractType', 'description', 'updateid'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contractService: ContractService,
    private alertService: AlertService,
    private datePipe: DatePipe
  ) { }
  ngOnInit(){
    this.getAllContracts();
    
    this.contractForm = this.formBuilder.group({
      contractsId: [''],
      contractEffectiveDate: ['', [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],
      contractEndDate: ['', [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],
      contractStatus:  ['Active'],
      contractType:  ['', Validators.required],
      maxAllowedPeriod: [''],
      description: ['', Validators.required],
      createid: 'john',
      createdOn: "2012-01-01",
      updateid: 'cena',
      lastupdate: "2021-01-01"          
    });

    
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

  openCustomModal(open: boolean, id:string) {
    this.submitted = false;
    this.loading = false;
    if(open && id==null){
      this.isAddMode = true;
    }
    this.isCustomModalOpen = open;
    if (!open && id==null) {
      this.contractForm.reset();
      this.isAddMode = false;
    }
    console.log("id inside modal: "+id);
    
    if(id!=null && open){
      this.isAddMode = false;
      //dfdfdfdf
        // let contractId = this.id;
         this.contractService.getContract(id)
         .pipe(first())
         .subscribe(x => {
           console.log(x[0].contractEffectiveDate);
           this.contractForm.patchValue({
             contractsId: x[0].contractsId,
             contractEffectiveDate: this.datePipe.transform(x[0].contractEffectiveDate, 'yyyy-MM-dd'),
             contractEndDate: this.datePipe.transform(x[0].contractEndDate, 'yyyy-MM-dd'),
             contractType: x[0].contractType,
             description: x[0].description,
             maxAllowedPeriod: x[0].maxAllowedPeriod
           });
          
         }
           );

      //dfdfddfdfdfdf




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

      this.loading = true;
      if (this.isAddMode) {
          this.addContract();
      } else {
          this.updateContract();
          
      }
  }
  
  private addContract() {
    this.contractService.addContract(this.contractForm.value)
        .pipe(first())
        .subscribe({
            next: () => {
              this.openCustomModal(false, null);
              this.getAllContracts();
              this.contractForm.reset();                
                this.alertService.success('New Contract added', { keepAfterRouteChange: true });
                //this.router.navigate(['../'], { relativeTo: this.route });
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        });
        
    }

    private updateContract() {
      debugger;
        this.contractService.updateContract(this.contractForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.getAllContracts();
                    debugger;
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
