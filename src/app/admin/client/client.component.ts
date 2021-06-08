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
import { MatSort, Sort } from '@angular/material/sort';
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
  displayedColumns: string[] = ['clientId','clientName','startDate','endDate','userId'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private clientsService: ClientsService, private fb: FormBuilder, private contractService: ContractService, private alertService: AlertService, private datePipe: DatePipe,private loginService: LoginService) { }
  
  clients:IClient[] = [];
  clientIDs: IClient[] = [];
  client: IClientIDRequest;
  singleClient: IClient[] = [];
  activeClients: IActiveClient[] = [];

  contractIDs: IContract[];
  clientForm: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  ustartDate:string;
  uendDate:string;
  parentCLientId:string;
  select:boolean;
  parentClientIds: IParentClient[];
  selectedValue:any;
  isDateValid:boolean;
  isDisabled:boolean;
  isCustomModalOpen: boolean = false;
  accIdStatus: number;
  accNameStatus: number;

  startDateErr = {isDateErr: false,dateErrMsg: ''};
  endDateErr = {isDateErr: false,dateErrMsg: ''};
  accNameErr = {isDuplicate: false, errMsg: ''};
  accIdErr = {isDuplicate: false, errMsg: ''};

  @ViewChild("focusElem") focusTag: ElementRef;
  

  ngOnInit() {
    this.getAllClients();
    this.getAllContracts();
    this.getParentClient();
    this.clientFormInit();
    this.clientsService.getActiveClients().subscribe(
      (data) => {
        data.filter((value,index)=>data.indexOf(value)===index);
        this.activeClients = data;
      }
    )
  }
  
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }  

  clientFormInit(){    
    this.clientForm = this.fb.group({   
      clientId: ['', Validators.required],
      clientName:  ['', Validators.required],
      startDate: null,
      endDate:null,
      claimsAdministrator: '',
      pharmacyClaimsAdministrator: '',
      subAccountid: '',
      subSubAccountid: '',
      ftn: '',
      ftnname: '',
      status:false,
      userId: ''//this.loginService.currentUserValue.name
  })//,{validator: this.dateLessThan('startDate', 'endDate')});    
  }
  getAllClients(){    
    this.clientsService.getAllClients().subscribe(
      (data: IClient[]) => {
          this.clientIDs =  data;
          this.clients = data; 
          this.dataSource = new MatTableDataSource(this.clients);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      
          const sortState: Sort = {active: 'clientId', direction: 'asc'};
          this.sort.active = sortState.active;
          this.sort.direction = sortState.direction;
          this.sort.sortChange.emit(sortState);
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
          dates: "End Date should be greater than Start Date."
        };
      }
      return {};
    }
}
  getParentClient(){        
    this.clientsService.getParentClient().subscribe(
      (data:IParentClient[]) => {        
          this.parentClientIds = data;
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
  
clearErrorMessages(){  
  this.startDateErr.isDateErr=false;
  this.startDateErr.dateErrMsg='';
  this.endDateErr.isDateErr=false;
  this.endDateErr.dateErrMsg='';
  this.accNameErr.isDuplicate=false;
  this.accNameErr.errMsg='';
  this.accIdErr.isDuplicate=false;
  this.accIdErr.errMsg='';
}
checkDuplicateAccountName(aname){
  this.clientsService.checkDuplicateAccountName(aname).subscribe(
    (data)=>{
      this.accNameStatus = data;
      if(this.accNameStatus>0){
        this.accNameErr.isDuplicate=true;
        this.accNameErr.errMsg='The account name '+this.f.clientName.value+' already exists. Please enter different Account Name'; 
        
        return;       
      }
    }
  );
}
checkDuplicateAccountId(aid){
  this.clientsService.checkDuplicateAccountId(aid).subscribe(
    (data)=>{
      this.accIdStatus = data;
      if(this.accIdStatus>0){
        this.accIdErr.isDuplicate=true;
        this.accIdErr.errMsg='The account Id '+this.f.clientId.value+' already exists. Please enter different Account Id'; 
        
        return;       
      }
    }
  );
}
  openCustomModal(open: boolean, id:any) {
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100);
    this.select=true;
    this.submitted = false;
    this.loading = false;
    this.isDisabled=false;
    this.clearErrorMessages();
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
        //this.selectedValue=id.parentID;
        this.isAddMode = false;
        this.ustartDate = this.datePipe.transform(id.startDate, 'yyyy-MM-dd');
        this.uendDate = this.datePipe.transform(id.endDate, 'yyyy-MM-dd');
        // this.parentClientIds.filter(item => {
        //   item.parentName == id.clientName;
        //   if(item.parentName == id.clientName){
        //     console.log(item.parentName);
        //     
        //   }          
        // });
        // console.log(this.parentClientIds.length);
        
        // let index = this.parentClientIds.findIndex(x => x.parentName == id.clientName); 
        // console. log(index);
        
        // this.parentClientIds.splice(index, 1);
        
        console.log(this.activeClients.length);
        
        let index = this.activeClients.findIndex(x => x.clientName == id.clientName); 
        console. log(index);
        
        this.activeClients.splice(index, 1);

        this.clientsService.getClient(id.clientId).subscribe(x => {
        console.log(x[0].clientId);
         this.clientForm.patchValue({
            clientId:x[0].clientId,
            clientName:x[0].clientName,        
            startDate: this.ustartDate,
            endDate: this.uendDate,
            //parentID:id.parentID,
            claimsAdministrator: x[0].claimsAdministrator,
            pharmacyClaimsAdministrator: x[0].pharmacyClaimsAdministrator,
            subAccountid: x[0].subAccountid,
            subSubAccountid: x[0].subSubAccountid,
            ftn: x[0].ftn,
            ftnname: x[0].ftnname,
            status:x[0].status,
            createdon: x[0].createdon
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
        //parentID:clientObj.parentID,
        //parentCLientId:clientObj.parentID,
        claimsAdministrator: clientObj.claimsAdministrator,
        pharmacyClaimsAdministrator: clientObj.pharmacyClaimsAdministrator,
        subAccountid: clientObj.subAccountid,
        subSubAccountid: clientObj.subSubAccountid,
        ftn: clientObj.ftn,
        ftnname: clientObj.ftnname,
        userId:this.loginService.currentUserValue.name,
        createdon: clientObj.createdon

       });
    }
    onSubmit() {
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();
      this.clearErrorMessages();

      if (this.clientForm.invalid) {
        return;
      }
      this.clientForm.patchValue(this.clientForm.value);
      // stop here if form is invalid
      let startDateValue=this.f.startDate.value;
      let endDateValue=this.f.endDate.value;
      if(this.clientForm.valid){
          this.checkDuplicateAccountName(this.f.clientName.value);
          this.checkDuplicateAccountId(this.f.clientId.value);
          console.log("acc id status "+this.accIdStatus);
          console.log('acc name status '+this.accNameStatus);
          
          if(startDateValue!=null && endDateValue!=null && startDateValue!='' && endDateValue!=''){
            if(startDateValue > endDateValue){
              this.startDateErr.isDateErr=true;
              this.startDateErr.dateErrMsg = 'Start date should not be greater than End date';  
                      
              return;
            }
          }
          if((startDateValue==null || startDateValue=='') && endDateValue!='' && endDateValue!=null){
            this.startDateErr.isDateErr=true;
            this.startDateErr.dateErrMsg = 'Start date should not be empty or Invalid';
                                      
            return;
          }
          if((endDateValue==null || endDateValue=='') && startDateValue!='' && startDateValue!=null){
          this.endDateErr.isDateErr=true;
          this.endDateErr.dateErrMsg = 'End date should not be empty or Invalid';    
                
          return;
        }
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
      status:this.clientForm.get('status').value==true?1:1,
      //parentID:this.clientForm.get('parentID').value,
      createdon: this.datePipe.transform(Date.now(), 'yyyy-MM-dd')
      //: id.clientId
    });
 //   console.log(this.clientForm.get('status').value);
    this.clientsService.addClient(this.clientForm.value)
        .pipe(first())
        .subscribe({
            next: () => { 
              this.isDisabled=true;              
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
        startDate: this.f.startDate.value==''?null:this.f.startDate.value,
        endDate: this.f.endDate.value==''?null:this.f.endDate.value,
        userId:this.loginService.currentUserValue.name,
        status:Boolean(this.clientForm.get('status').value)==true?1:0
        //parentID:String(this.clientForm.get('parentID').value)
      }); 
        if(this.f.startDate.value==''){
          
        }
        
        this.clientsService.updateClient(this.clientForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.isDisabled=true;  
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
