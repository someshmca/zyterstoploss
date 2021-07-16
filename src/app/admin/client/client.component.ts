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
import { combineLatest } from 'rxjs';
import { ModuleNames } from 'ag-grid-community';
import { Router } from '@angular/router';
import { ɵbypassSanitizationTrustStyle } from '@angular/core';
import {NavPopupService} from '../services/nav-popup.service';
import { IClientObj } from '../models/nav-popups.model';

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

  constructor(private clientService: ClientsService, private fb: FormBuilder, private contractService: ContractService, private alertService: AlertService, private datePipe: DatePipe,private loginService: LoginService, private route: Router, private navService: NavPopupService) { }

  clients:IClient[] = [];
  clientIDs: IClient[] = [];
  client: IClientIDRequest;
  singleClient: IClient[] = [];
  activeClients: IActiveClient[] = [];

  contractIDs: IContract[];
  clientForm: FormGroup;
  id: string;
  isAddMode: boolean;
  isAdded: boolean;
  loading = false;
  submitted = false;
  ustartDate:string;
  uendDate:string;
  uAccountId: string;
  uAccountName: string;
  parentCLientId:string;
  select:boolean;
  parentClientIds: IParentClient[];
  selectedValue:any;
  isDateValid:boolean;
  isDisabled:boolean;
  isCustomModalOpen: boolean = false;
  accIdStatus: number;
  accNameStatus: number;
  
  contractAddStatus: boolean;
  contractUpdateStatus: boolean;
  clientUpdateStatus: boolean;
  searchInputValue: string= '';
  startDateErr = {isDateErr: false,dateErrMsg: ''};
  endDateErr = {isDateErr: false,dateErrMsg: ''};
  accountIdErr=  {isValid: false, errMsg: ''};// Modified by Venkatesh Enigonda
  accountNameErr={isValid: false, errMsg: ''};// Modified by Venkatesh Enigonda
  accNameErr = {isDuplicate: false, errMsg: ''};
  accIdErr = {isDuplicate: false, errMsg: ''};
  subSubIdAcErr = { isValid: false, errMsg: '' };// Modified by Venkatesh Enigonda
  subChkErr = { isValid: false, errMsg: '' };
  subSubChkErr = { isValid: false, errMsg: '' };
  tempClientObj:IClientObj;
  @ViewChild("focusElem") focusTag: ElementRef;
  @ViewChild("filterSearchInput") filterSearchInput: ElementRef;

  ngOnInit() {
    this.getAllClients();
    this.getAllContracts();
    this.getParentClient();
    this.clientFormInit();
    this.clientService.getActiveClients().subscribe(
      (data) => {
        data.filter((value,index)=>data.indexOf(value)===index);
        this.activeClients = data;
      });
    this.isAdded = false;
    // this.getContractAddStatus();
    // this.getContractUpdateStatus();
    //this.getClientUpdateStatus();
    this.getClientStatus();
  }
  
  getClientStatus(){
    this.navService.clientObj.subscribe((data)=>{
      this.tempClientObj = data;
      if(data.isAdd){
        this.searchInputValue = data.clientName;
        setTimeout(()=>{this.filterSearchInput.nativeElement.focus();}, 1000);        
      }
      else if(data.isUpdate){          
          this.searchInputValue = data.clientName;
          setTimeout(()=>{this.filterSearchInput.nativeElement.focus(); this.isAdded = false;}, 1000);
        }
      else{
        this.searchInputValue='';
        this.filterSearchInput.nativeElement.blur();
        this.getAllClients();
      }
      });
  }
  // getClientUpdateStatus(){
  //   this.clientService.clientUpdateStatus.subscribe((status)=>{
  //       this.clientUpdateStatus = status;
        
  //       this.clientService.clientIdValue.subscribe((data)=>{                   
  //         let d:string=data;
  //         this.inpValue = d;
  //         setTimeout(()=>{
  //             this.filterInput.nativeElement.focus();                  
  //           }, 1000);
  //       });
  //     })
  // }
  // getContractAddStatus(){   
  //   this.contractService.contractAddStatus.subscribe((status)=> {
  //       this.contractAddStatus = status;        
  //     });
  // }
  // getContractUpdateStatus(){       
  //   this.contractService.contractUpdateStatus.subscribe((status)=> {
  //       this.contractUpdateStatus = status;        
  //     });
  // }

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
    this.clientService.getAllClients().subscribe(
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
    this.clientService.getParentClient().subscribe(
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
    this.clientService.getClient(clientId).subscribe(
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
  this.accountIdErr.isValid=false; // Start by Venkatesh Enigonda
  this.accountIdErr.errMsg='';
  this.accountNameErr.isValid=false;
  this.accountNameErr.errMsg='';// End by Venkatesh Enigonda

  this.accNameErr.isDuplicate=false;
  this.accNameErr.errMsg='';
  this.accIdErr.isDuplicate=false;
  this.accIdErr.errMsg='';
    this.subSubIdAcErr.isValid = false;//Modified by Venkatesh Enigonda
    this.subSubIdAcErr.errMsg = '';
    this.subChkErr.isValid = false;//Modified by Venkatesh Enigonda
    this.subChkErr.errMsg = '';
    this.subSubChkErr.isValid = false;//Modified by Venkatesh Enigonda
    this.subSubChkErr.errMsg = '';
}
checkDuplicateAccountName(aname){
  return this.clientService.checkDuplicateAccountName(aname).toPromise();
  // promise.then((data)=>{
  //     //this.accNameStatus = data;
  //
  //     if(data>0){
  //       this.accNameErr.isDuplicate=true;
  //       this.accNameErr.errMsg='The account name '+this.f.clientName.value+' already exists. Please enter different Account Name';

  //      // return;
  //     }
  //   }
  // ).catch((error)=>{
  //   console.log("Promise rejected with " + JSON.stringify(error));
  // });
}
// async fetchData(){
//   const data = await this.httpClient.get(this.apiUrl).toPromise();
//   console.log("Data: " + JSON.stringify(data));
// }
async checkDuplicateAccountId(aid){
  const promise = this.clientService.checkDuplicateAccountId(aid).toPromise();
  promise.then((data)=>{
    console.log("Promise resolved with: " + data);
    this.accIdStatus = data;
      if(this.accIdStatus>0){
        this.accIdErr.isDuplicate=true;
        this.accIdErr.errMsg='The account Id '+this.f.clientId.value+' already exists. Please enter different Account Id';
        return;
      }

  }).catch((error)=>{
    console.log("Promise rejected with " + JSON.stringify(error));
  });


  // (
  //   (data)=>{
  //     this.accIdStatus = data;
  //     if(this.accIdStatus>0){
  //       this.accIdErr.isDuplicate=true;
  //       this.accIdErr.errMsg='The account Id '+this.f.clientId.value+' already exists. Please enter different Account Id';
  //       return;
  //     }
  //   }
  // );
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
      this.isAdded=false;
      this.navService.resetClientObj();
      this.clearSearchInput();
    }
   // this.getAllClients();
    console.log("id inside modal: "+id);
    this.clientForm.patchValue(this.clientForm.value);
    if(id!=null && open){
      this.isAddMode = false;
      if(id!=null){
        this.isAddMode = false;

        console.log(this.activeClients.length);

        let index = this.activeClients.findIndex(x => x.clientName == id.clientName);
        console. log(index);

        this.activeClients.splice(index, 1);
        this.ustartDate = this.datePipe.transform(id.startDate, 'yyyy-MM-dd');
        this.uendDate = this.datePipe.transform(id.endDate, 'yyyy-MM-dd');

        this.clientService.getClient(id.clientId).subscribe(x => {

        console.log(x[0].clientId);
         this.clientForm.patchValue({
            clientId:x[0].clientId,
            clientName:x[0].clientName,
            startDate:  this.datePipe.transform(x[0].startDate, 'yyyy-MM-dd'),
            endDate:  this.datePipe.transform(x[0].endDate, 'yyyy-MM-dd'),
            claimsAdministrator: x[0].claimsAdministrator,
            pharmacyClaimsAdministrator: x[0].pharmacyClaimsAdministrator,
            subAccountid: x[0].subAccountid,
            subSubAccountid: x[0].subSubAccountid,
            ftn: x[0].ftn,
            ftnname: x[0].ftnname,
            status:x[0].status,
            createdon: x[0].createdon
          });
          this.uAccountName = x[0].clientName;
          this.navService.setClientObj(x[0].clientId, x[0].clientName, false, true);
        });
        //this.uAccountId = this.f.clientId.value;
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
    gotoAddContract(){
      if(this.isAdded){
        this.clientService.getClient(this.f.clientId.value).subscribe((data)=>{
          this.navService.setContractObj(data[0].clientId, data[0].clientName, true,false);
          this.route.navigate(['/contracts']); 
        });
      } 
    }
    clearSearchInput(){
      this.searchInputValue='';
      this.filterSearchInput.nativeElement.value='';
      this.filterSearchInput.nativeElement.focus();
      this.getAllClients();
    }
    gotoUpdateContract(){
      this.clientService.getClient(this.f.clientId.value).subscribe(
        (data: IClient[]) => {                  
          this.navService.setContractObj(data[0].clientId, data[0].clientName, false, true);
          this.isAdded = false;
          this.route.navigate(['/contracts']);   
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

      let checkAccountId = /^([a-zA-Z0-9]+)$/; // start by Venkatesh Enigonda
     
      console.log(checkAccountId.test(this.f.clientId.value));
      let accountIdTest=checkAccountId.test(this.f.clientId.value);

      console.log(checkAccountId.test(this.f.clientName.value));
      let AccountNameCheck=checkAccountId.test(this.f.clientName.value); // end by Venkatesh Enigonda
      

      //let subid = this.f.subAccountid.value;
      let subSubid = this.f.subSubAccountid.value;
  
      let subSubId: any;// Modified by Venkatesh Enigonda
      let startDateValue = this.f.startDate.value;
      let endDateValue = this.f.endDate.value;

      if(!accountIdTest && this.f.clientId.value!=''){ // Start by Venkatesh Enigonda
        this.accountIdErr.isValid=true;
        this.accountIdErr.errMsg='Account Id is not valid.Special Characters not Allowed';
        return;
      }
      if(!AccountNameCheck && this.f.clientName.value!=''){
        this.accountNameErr.isValid=true;
        this.accountNameErr.errMsg='Account Name is not valid.Special Characters not Allowed';
        return;
      } // End by Venkatesh Enigonda


      let alphaNum = /^([A-Za-z0-9]+)$/; //From line number 336 to 341 Modified by Venkatesh Enigonda
      console.log(alphaNum.test(this.f.subAccountid.value));
      let checkSubId = alphaNum.test(this.f.subAccountid.value);
  
      console.log(alphaNum.test(this.f.subSubAccountid.value));
      let checksubSubId = alphaNum.test(this.f.subSubAccountid.value);
  
      if (!checkSubId && this.f.subAccountid.value != '') { // From Line 343 to 352 Modified by Venkatesh Enigonda 
        this.subChkErr.isValid = true;
        this.subChkErr.errMsg = 'Sub-Account Id is not Valid.Special Characters not Allowed';
        return;
      }
      if (!checksubSubId && this.f.subSubAccountid.value != '') {
        this.subSubChkErr.isValid = true;
        this.subSubChkErr.errMsg = 'Sub Sub-Account is not Valid.Special Characters not Allowed';
        return;
      }
  
      if (this.f.subAccountid.value !== null)// Modified by Venkatesh Enigonda
      {
        subSubId = this.f.subAccountid.value.length;
      }
      else {
        subSubId = 0;
      }
      console.log(subSubid);// Modified by Venkatesh Enigonda
      if (subSubid == null) {
        console.log(subSubid);
      }
      else if (subSubid != '' && subSubId == 0) {
        console.log(subSubId);
        this.subSubIdAcErr.isValid = true;
        this.subSubIdAcErr.errMsg = ' Sub-Account ID Required*';//// Modified by Venkatesh Enigonda
        return;
      }
      if(this.clientForm.valid){
        if(this.isAddMode){
          const cid= this.clientService.checkDuplicateAccountId(this.f.clientId.value);
          const cname = this.clientService.checkDuplicateAccountName(this.f.clientName.value);
          const connectStream = combineLatest([cid, cname]);
          connectStream.subscribe(
            ([id,name]) => {
              console.log('client Id : '+id);
              console.log('client Namem : '+name);
              if(id>0 && name>0){
                this.accNameErr.isDuplicate=true;
                this.accNameErr.errMsg="Accound Name and Account ID already exists";
                return;
              }
              if(id>0){
                this.accIdErr.isDuplicate=true;
                this.accIdErr.errMsg="Account ID already exists";
                return;
              }
              if(name>0){
                this.accNameErr.isDuplicate=true;
                this.accNameErr.errMsg="Accound Name already exists";
                return;
              }
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
              this.addClient();

            });
        }

      }

      this.loading = true;
      if (!this.isAddMode) {

        if(this.uAccountName.toLowerCase() !== this.f.clientName.value.toLowerCase()){
          this.checkDuplicateAccountName(this.f.clientName.value).then(data => {
            if(data>0) {
              this.accNameErr.isDuplicate=true;
              this.accNameErr.errMsg='The account name '+this.f.clientName.value+' already exists. Please enter different Account Name';
              return;
            }
            else{

              this.updateClient();
            }
          });
        } else  {
          this.updateClient();
        }

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
    this.clientService.addClient(this.clientForm.value)
        .pipe(first())
        .subscribe({
            next: () => {
              this.isDisabled=true;
              this.getAllClients();
              this.clientService.getClient(this.f.clientId.value).subscribe((data)=>{
                this.navService.setClientObj(data[0].clientId, data[0].clientName, true,false);
              });              
              this.isAdded = true;
              //this.getContractAddStatus();
              this.alertService.success('New Client added', { keepAfterRouteChange: true });
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

        this.clientService.updateClient(this.clientForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.getAllClients();

                    this.uAccountName='';
                    //this.clientForm.reset();
                    this.alertService.success('Client updated', {
                      keepAfterRouteChange: true });
                    this.isDisabled=true;
                    this.contractService.setContractAddStatus(false);  
                   // this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}
