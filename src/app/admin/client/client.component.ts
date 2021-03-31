import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {IClient, IClientIDRequest, IClientAdd, IClientAddSuccess, IClientUpdate, IClientUpdateSuccess, IActiveClient, IParentClient} from '../models/clients-model';
import {IContract} from '../models/contracts-model';
import {ClientsService} from '../services/clients.service';
import {ContractService} from '../services/contract.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { first } from 'rxjs/operators';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {DatePipe} from '@angular/common';
import { AlertService } from '../services/alert.service';
import { LoginService } from 'src/app/shared/services/login.service';
let dp = new DatePipe(navigator.language);
let p = 'y-MM-dd'; // YYYY-MM-DD
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
  providers: [DatePipe]
})
export class ClientComponent implements OnInit {  
  displayedColumns: string[] = ['clientId','clientName','startDate','endDate','parentName','clientID'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private clientsService: ClientsService, private fb: FormBuilder, private contractService: ContractService, private alertService: AlertService, private datePipe: DatePipe,private loginService: LoginService) { }
  
  clients:IClient[] = [];
  clientIDs: IClient[] = [];
  client: IClientIDRequest;
  singleClient: IClient[] = [];

  contractIDs: IContract[];
  clientForm: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  ustartDate:string;
  uendDate:string;
  parentCLientId:string
select:boolean;
  parentClientIds: IParentClient[];
selectedValue:any;
isDateValid:boolean;

  isCustomModalOpen: boolean = false;
  @ViewChild("focusElem") focusTag: ElementRef;

  ngOnInit() {
    this.getAllClients();
    this.getAllContracts();
    this.getParentClient();
    this.clientFormInit();
  }
  
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }  

  clientFormInit(){    
    this.clientForm = this.fb.group({   
      clientId: [''],
      clientName:  ['', Validators.required],
      startDate:['', [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],
      endDate:['', [Validators.required, Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)]],
      parentID:[''],
      status:0,
      userId:""//this.loginService.currentUserValue.name
  },{validator: this.dateLessThan('startDate', 'endDate')});    
  }
  getAllClients(){    
    this.clientsService.getAllClients().subscribe(
      (data: IClient[]) => {
          this.clientIDs =  data;
          this.clients = data;
          this.dataSource = new MatTableDataSource(this.clients);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
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
          dates: "End Date  should be greater than Start Date."
        };
      }
      return {};
    }
}
  getParentClient(){   
     
    this.clientsService.getParentClient().subscribe(
      (data:IParentClient[]) => {
        
          this.parentClientIds = data;
          //this.roles = data;
      }
    )
  }
  
  getAllContracts(){    
    this.contractService.getAllContracts().subscribe(
      (data: IContract[]) => {
          this.contractIDs = data;
      }
    )
  }  
  getClient(clientId){
    this.clientsService.getClient(clientId).subscribe(
      (data: IClient[]) => {
        

        console.log("data 0 : "+data[0].clientId);
        this.singleClient = data;
        
      }
    );
  }
  
  get f() { return this.clientForm.controls; }
  openCustomModal(open: boolean, id:any) {
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100);
    this.select=true;
    this.submitted = false;
    this.loading = false;
    if(open && id==null){
      this.isAddMode = true;
    }
    this.isCustomModalOpen = open;
    if (!open && id==null) {
      this.clientForm.reset();
      this.isAddMode = false;
    }
    this.getAllClients();
    console.log("id inside modal: "+id);

    if(id!=null && open){
      this.isAddMode = false;
      // this.getClient(id);
      //id.status==1?this.clientForm.get('status').setValue(true):this.clientForm.get('status').setValue(false);
      //this.clientForm.get('status').value)==true?1:0,
      
      if(id!=null){
        this.selectedValue=id.parentID;
        this.isAddMode = false;
        this.ustartDate = this.datePipe.transform(id.startDate, 'yyyy-MM-dd');
        this.uendDate = this.datePipe.transform(id.endDate, 'yyyy-MM-dd');
        this.clientsService.getClient(id.clientId).subscribe(x => {
        console.log(x[0].clientId);
         this.clientForm.patchValue({
         clientId:x[0].clientId,
                clientName:x[0].clientName,        
               startDate: this.ustartDate,
                endDate: this.uendDate,
                parentID:id.parentID,
            status:x[0].status
            //: id.clientId
          });
        }
      );

       
        
       }

        
  }
}



            
    patchClientForm(clientObj:IClientUpdate){            
      this.clientForm.patchValue({
        clientId: clientObj.clientID,
        clientName: clientObj.clientName,
        status:clientObj.status,
        startDate: clientObj.startDate,
        endDate: clientObj.endDate,
        parentID:clientObj.parentID,
        parentCLientId:clientObj.parentID,
        userId:this.loginService.currentUserValue.name

       });
    }
    onSubmit() {
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.clientForm.invalid) {
          return;
      }

      this.loading = true;
      if (this.isAddMode) {
          this.addClient();
      } else {
          this.updateClient();
          
      }
  }
  
  private addClient() {
    
    this.clientForm.patchValue({
      userId:this.loginService.currentUserValue.name,
      status:Boolean(this.clientForm.get('status').value==true)?1:0,
      parentID:String(this.clientForm.get('parentID').value)
      //: id.clientId
    });
 //   console.log(this.clientForm.get('status').value);
    this.clientsService.addClient(this.clientForm.value)
        .pipe(first())
        .subscribe({
            next: () => {
              
              this.openCustomModal(false, null);
              this.getAllClients();
              this.clientForm.reset();                
                this.alertService.success('New Client added', { keepAfterRouteChange: true });
                //this.router.navigate(['../'], { relativeTo: this.route });
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        });
        
    }

    private updateClient() {
      
      this.clientForm.patchValue({
        userId:this.loginService.currentUserValue.name,
        status:Boolean(this.clientForm.get('status').value)==true?1:0,
        parentID:String(this.clientForm.get('parentID').value)
        }); 
        this.clientsService.updateClient(this.clientForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.getAllClients();
                    this.openCustomModal(false,null); 
                    this.clientForm.reset();
                    this.alertService.success('Client updated', { 
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
