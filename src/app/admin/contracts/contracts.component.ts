import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { IContract, IContractIDRequest,
  IContractAdd, IAddContractSuccess,IActiveClient,
  IContractUpdate, IUpdateContractSuccess, IContractAudit} from '../models/contracts-model';
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
import { ProductService } from '../services/product.service';
import { NavPopupService } from '../services/nav-popup.service';
import { IClientObj } from '../models/nav-popups.model';
import { LoaderService } from '../services/loader.service';
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
  
  contractAudits: IContractAudit[] = [];
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
  clientStartDate: any;
  clientEndDate: any;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    isCustomModalOpen: boolean = false;
    uContractId: number;
    startDateErr = {isDateErr: false,dateErrMsg: ''};
    endDateErr = {isDateErr: false,dateErrMsg: ''};
    startDateRangeErr = {isDateErr: false,dateErrMsg: ''};
    runInStartErr = {isDateErr: false, dateErrMsg: ''};
    runInEndErr = {isDateErr: false, dateErrMsg: ''};
    runOutStartErr = {isDateErr: false, dateErrMsg: ''};
    checkPolicyYearErr= {isValid: false, errMsg: ''};//Modified by Venkatesh Enigonda
    runOutEndErr = {isDateErr: false, dateErrMsg: ''};
    terminationDateErr = {isDateErr: false, dateErrMsg: ''};
    exIncStartEndErr= {isDateErr: false, dateErrMsg: ''};
    exIncStartErr={isDateErr: false, dateErrMsg: ''};
    exPaidStartEndErr={isDateErr: false, dateErrMsg: ''};
    exPaidStartErr={isDateErr: false, dateErrMsg: ''};
  tempClientObj:IClientObj;
  tempContractObj:IClientObj;
  isDisabled: boolean;
  isFilterOn: boolean = false;
  productObj: IClientObj;
  @ViewChild("focusElem") focusTag: ElementRef;
  @ViewChild("filterSearchInput") filterSearchInput: ElementRef;
  searchInputValue: string;

  isContractStartDateInvalid: boolean=false;
  clientDetails: any;
  fetchContractDetailsOld: any;
  fetchContractDetailsNew: any;
  updateNoChange= {flag: false, message: ''}
  //contractAddStatus: boolean; 
  //contractUpdateStatus: boolean;

  displayedColumns: string[] = ['clientName','contractId', 'startDate', 'endDate', 'clientId'];
  dataSource: any;
  isAdded: boolean;
  isViewModal: boolean;
  isAdmin: boolean;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private contractService: ContractService,
    private clientService: ClientsService,
    private productService: ProductService,
    private alertService: AlertService,
    private datePipe: DatePipe,
    private loginService: LoginService,
    private navService: NavPopupService,
    public loaderService: LoaderService
  ) { }
  ngOnInit(){
    
    //this.filterTable.nativeElement.value = 'Hello';
    //this.filterTable.nativeElement.innerHTML="Hello";
    //
        this.searchInputValue = "";
    // setTimeout(
    //   () => {
    //     this.filterTable.nativeElement.focus();
    //   }, 400
    // )

    this.getAllContracts();
    this.getActiveClients();   
    this.isAdded = false;
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
      policyYear: '',
      description: '',
      exclusionIncurredStartDate:[''],
      exclusionIncurredEndDate:[''],
      exclusionPaidStartDate:[''],
      exclusionPaidEndDate:['']
    });
    this.navService.productObj.subscribe((data)=>{this.productObj = data;});
    this.getContractStatus();
    //this.getContractAddStatus();
    //this.getContractUpdateStatus();
    //this.getClientUpdateStatus();    
    // this.getProductAddStatus();
    // this.getProductUpdateStatus(); 
    this.loginService.getLoggedInRole();
    this.isAdmin = this.loginService.isAdmin;
  }
  getContractStatus(){
    this.navService.contractObj.subscribe(
      (data)=>{
        this.tempContractObj = data;
        if(data.isAdd && !this.productObj.isAdd){
          this.contractForm.patchValue({
            clientId: data.clientId
          });
          this.openCustomModal(true, null);
        }
        else if(data.isAdd && this.productObj.isAdd){
          this.searchInputValue=data.clientName;
          setTimeout(()=>{this.filterSearchInput.nativeElement.blur()},500);
          setTimeout(()=>{this.filterSearchInput.nativeElement.focus()},1000);
        }
        else if(data.isUpdate){          
          this.searchInputValue = data.clientName;
          setTimeout(()=>{this.filterSearchInput.nativeElement.blur()},500);
          setTimeout(()=>{this.filterSearchInput.nativeElement.focus()},1000);
        }
        else{          
          this.searchInputValue = '';
          this.filterSearchInput.nativeElement.blur(); 
          this.getAllContracts();   
        }
      });
  }
  // getContractUpdateStatus(){
  //   this.contractService.contractUpdateStatus.subscribe(
  //     (data)=>{
  //       this.contractUpdateStatus = data;       
         
  //       if(this.contractUpdateStatus){
  //         this.clientService.clientIdValue.subscribe((data)=>{                   
  //             let d:string=data;
  //             this.searchInputValue = d;
  //             setTimeout(()=>{
  //                 this.filterTable.nativeElement.focus();                  
  //               }, 1000);
  //           });
  //       }
  //     }
  //   )
  // }
  // getClientUpdateStatus(){
  //   this.clientService.clientUpdateStatus.subscribe((status)=>{
  //     this.clientUpdateStatus = status;
  //   })
  // }
  // getProductAddStatus(){
  //   this.productService.productAddStatus.subscribe((status)=>{
  //       this.productAddStatus = status;
  //     })
  // }
  // getProductUpdateStatus(){
  //   this.productService.productUpdateStatus.subscribe((status)=>{
  //       this.productUpdateStatus = status;
  //     })
  // }

  getClientDetails(clientId){
    
    this.clientService.getClientDetails(clientId).subscribe(
      (data)=>{
        this.clientDetails = data[0];
        this.clientStartDate = this.datePipe.transform(this.clientDetails.startDate, 'yyyy-MM-dd');
        this.clientEndDate = this.datePipe.transform(this.clientDetails.startDate, 'yyyy-MM-dd');
      }, 
      (error) => {
          console.log("No Details for selected Account ID ");
      }
    )
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
        
      })
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
        status:this.updateObj[0].status,
        policyYear: this.updateObj[0].policyYear,
        description: this.updateObj[0].description,
        exclusionIncurredStartDate:this.datePipe.transform(this.updateObj[0].exclusionIncurredStartDate,'yyyy-MM-dd'),
        exclusionIncurredEndDate:this.datePipe.transform(this.updateObj[0].exclusionIncurredEndDate,'yyyy-MM-dd'),
        exclusionPaidStartDate:this.datePipe.transform(this.updateObj[0].exclusionPaidStartDate,'yyyy-MM-dd'),
        exclusionPaidEndDate:this.datePipe.transform(this.updateObj[0].exclusionPaidEndDate,'yyyy-MM-dd')
      });
      this.fetchContractDetailsOld=this.contractForm.value;
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
  this.startDateRangeErr.isDateErr=false;
  this.startDateRangeErr.dateErrMsg='';
  this.runInStartErr.dateErrMsg='';
  this.runInStartErr.isDateErr=false;
  this.checkPolicyYearErr.isValid=false; // by Venkatesh Enigonda
  this.checkPolicyYearErr.errMsg='';     // by Venkatesh Enigonda
  this.runInEndErr.dateErrMsg='';
  this.runInEndErr.isDateErr=false;
  this.runOutStartErr.isDateErr=false;
  this.runOutStartErr.dateErrMsg='';
  this.runOutEndErr.isDateErr=false;
  this.runOutEndErr.dateErrMsg='';
  this.terminationDateErr.dateErrMsg='';
  this.terminationDateErr.isDateErr=false;
  this.contractStartDateErrMsg = '';
  this.isContractStartDateInvalid=false;
  this.exIncStartEndErr.isDateErr=false;
  this.exIncStartEndErr.dateErrMsg='';
  this.exIncStartErr.isDateErr=false;
  this.exIncStartErr.dateErrMsg='';
  this.exPaidStartEndErr.isDateErr=false;
  this.exPaidStartEndErr.dateErrMsg='';
  this.exPaidStartErr.isDateErr=false;
  this.exPaidStartErr.dateErrMsg='';
  this.updateNoChange= {flag: false, message: ''}
}
openViewModal(bool, id:any){
  this.isViewModal = true;
  this.openCustomModal(bool, id);
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
      this.isFilterOn=false;
      this.isViewModal=false;
      this.contractForm.enable();
    }
    this.clearErrorMessages();
    this.isCustomModalOpen = open;
    if (!open && id==null) {
      this.getAllContracts();
      this.contractForm.reset();
      this.isAddMode = false;
      this.isViewModal=false;
      this.isAdded=false;
      if(!this.isFilterOn){
        this.navService.resetContractObj();
        this.clearSearchInput();
      }
    }
    console.log("id inside modal: "+id);
    //this.contId=id.contractId==0?"":id.contractId;
    if(id!=null && open){
      
      this.isAddMode = false;
      this.isFilterOn=false;
      this.getContract(id);
      this.getClientDetails(id.clientId);
      
      this.getContractAudits(id);
      //   this.clientService.passClientId(id.clientName);
      // 

      console.log(this.updateObj);        
      if(this.isViewModal==true){
        this.contractForm.disable();
      }  
      else{
        this.contractForm.enable();
      }
    }
  }

  doFilter(filterValue:string){ //added by Venkatesh Enigonda
    this.dataSource.filter=filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data1:IContract, filter: string) => {
      const Id=data1.contractId.toString();
      const CompareData=data1.clientName.toLowerCase() ||'';
      const CompareData1=Id ||'';
      const CompareData2=data1.endDate ||'';
      const CompareData3=data1.startDate ||'';
      return CompareData.indexOf(filter)!==-1  || CompareData1.indexOf(filter)!==-1 || CompareData2.indexOf(filter)!==-1 || CompareData3.indexOf(filter)!==-1;
    };

  }//Ends here
  get f() { return this.contractForm.controls; }

  onSubmit() {
      this.submitted = true;
      let flag:boolean= false;
      this.alertService.clear();
      this.clearErrorMessages();
      let a:Date;
      let startDateValue=this.f.startDate.value;
      let endDateValue=this.f.endDate.value;
      let runInStartValue=this.f.runInStartDate.value;
      let runInEndValue=this.f.runInEndDate.value;
      let runOutStartValue= this.f.runOutStartDate.value;
      let runOutEndValue=this.f.runOutEndDate.value;
      let terminationDateValue=this.f.terminationDate.value;
      let exclusionIncurredStartDate= this.f.exclusionIncurredStartDate.value;
      let exclusionIncurredEndDate= this.f.exclusionIncurredEndDate.value;
      let exclusionPaidStartDate= this.f.exclusionPaidStartDate.value;
      let exclusionPaidEndDate= this.f.exclusionPaidEndDate.value;
      // 
      // a = startDateValue;
      // let d=new Date(startDateValue);
      // console.log("Current date "+this.datePipe.transform(d.setDate(d.getDate()+1), 'MM-dd-yyyy'));
      // this.contractForm.patchValue({
      //   runInEndDate: this.datePipe.transform(d.setDate(d.getDate()+1), 'MM-dd-yyyy')
      // });
      // 
      
     if (this.contractForm.invalid) {
      return;
     }
      //call service
      let checkAlphaNum =/^([a-zA-Z0-9]+)$/;  // Start by Venkatesh Enigonda
      console.log(checkAlphaNum.test(this.f.policyYear.value));
      let PolicyYearTest=checkAlphaNum.test(this.f.policyYear.value);  // End by Venkatesh Enigonda

      let clientId:string = this.f.clientId.value;
      let ContractStartDate = this.datePipe.transform(startDateValue, 'MM-dd-yyyy');  
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
                this.contractForm.patchValue(this.contractForm.value);
                console.log(this.contractForm.value);
                
                if(!PolicyYearTest && this.f.policyYear.value!=''){ // Start by Venkatesh Enigonda
                  this.checkPolicyYearErr.isValid=true;
                  this.checkPolicyYearErr.errMsg='Special Characters Not Allowed';
                  return;
                }// End by Venkatesh Enigonda
  
                if(this.contractForm.valid){
                  if(startDateValue!=null && endDateValue!=null && startDateValue!='' && endDateValue!=''){
                    if(startDateValue > endDateValue){
                      this.startDateErr.isDateErr=true;
                      this.startDateErr.dateErrMsg = 'Contract start date should not be greater than Contract end date'; 
                      flag=false;     
                      return;
                    }

                  }
                  // Starts here added by Venkatesh Enigonda
                  if(startDateValue!=null && endDateValue!=null && startDateValue!='' && endDateValue!=''){
                    if(startDateValue == endDateValue){
                      this.startDateErr.isDateErr=true;
                      this.startDateErr.dateErrMsg = 'Contract Start date should not be Equal to Contract End date'; 
                      flag=false;     
                      return;
                    }

                  } //Ends here
                  // if((startDateValue < this.clientStartDate && startDateValue!= this.clientStartDate) || (startDateValue>this.clientEndDate && startDateValue!= this.clientEndDate)){
                  //   this.startDateRangeErr.isDateErr=true;
                  //   this.startDateRangeErr.dateErrMsg = 'Contract start date should be in between Account Start and End Date'; 
                  //   flag=false;     
                  //   return;
                  // }
                  if(startDateValue==null || startDateValue==''){
                    this.startDateErr.isDateErr=true;
                    this.startDateErr.dateErrMsg = 'Contract start date should not be empty or Invalid';  
                    flag=false;         
                    return;
                  }
                  if(endDateValue==null || endDateValue==''){
                    this.endDateErr.isDateErr=true;
                    this.endDateErr.dateErrMsg = 'Contract End date should not be empty or Invalid';    
                    flag=false;       
                    return;
                  }
                  if(runInStartValue!=null && runInEndValue!=null && runInStartValue!='' && runInEndValue!=''){
                    if(runInStartValue > runInEndValue){
                      this.runInStartErr.isDateErr=true;
                      this.runInStartErr.dateErrMsg = 'Run-In Start date should not be greater than Run-In End date';  
                      flag=false;          
                      return;
                    }
                    // Starts here added by Venkatesh Enigonda
                    if(runInStartValue!=null && runInEndValue!=null && runInStartValue!='' && runInEndValue!=''){
                      if(runInStartValue == runInEndValue){
                        this.runInStartErr.isDateErr=true;
                        this.runInStartErr.dateErrMsg = 'Run-In Start date should not be Equal to Run-In End date';  
                        flag=false;          
                        return;
                      }
                    } // Ends here
                    const newDate = new Date(startDateValue);
                    const runInEndValueDate = new Date(runInEndValue);
                    const startDateValueRed = new Date(newDate.setDate(newDate.getDate()-1));
                    console.log(' Date ', startDateValueRed, runInEndValue, runInEndValueDate.getTime() !== startDateValueRed.getTime());
                    if(runInEndValueDate.getTime() !== startDateValueRed.getTime() ){                    
                      this.runInEndErr.isDateErr=true;
                      this.runInEndErr.dateErrMsg = 'Run-In End date should be one day lessthan Contract Start Date';
                      flag=false;                            
                      return;
                    }
                  }
                  if((runInStartValue==null || runInStartValue=='') && runInEndValue!='' && runInEndValue!=null){
                    this.runInStartErr.isDateErr=true;
                    this.runInStartErr.dateErrMsg = 'Run-In Start date should not be empty or Invalid';
                    flag=false;                            
                    return;
                  }
                  if((runInEndValue==null || runInEndValue=='') && runInStartValue!='' && runInStartValue!=null){
                  this.runInEndErr.isDateErr=true;
                  this.runInEndErr.dateErrMsg = 'Run-In End date should not be empty or Invalid';    
                  flag=false;        
                  return;
                }
                if(runOutStartValue!=null && runOutEndValue!=null && runOutStartValue!='' && runOutEndValue!=''){
                  if(runOutStartValue > runOutEndValue){
                    this.runOutStartErr.isDateErr=true;
                    this.runOutStartErr.dateErrMsg = 'Run-Out Start date should not be greater than Run-Out End date'; 
                    flag=false;           
                    return;
                  }
                  // Starts here Venkatesh Enigonda
                  if(runOutStartValue == runOutEndValue){
                    this.runOutStartErr.isDateErr=true;
                    this.runOutStartErr.dateErrMsg = 'Run-Out Start date should not be Equal to Run-Out End date'; 
                    flag=false;           
                    return;
                  }//Ends here
                  const newEndDate = new Date(endDateValue);
                  const runOutStartValueDate = new Date(runOutStartValue);
                  const endDateValueRed = new Date(newEndDate.setDate(newEndDate.getDate()+1));
                  
                    if(runOutStartValueDate.getTime() !== endDateValueRed.getTime() ){                    
                      this.runOutStartErr.isDateErr=true;
                      this.runOutStartErr.dateErrMsg = 'Run-Out Start date should be one day greaterthan Contract End Date';
                      flag=false;
                      return;
                    }
                }
                if((runOutStartValue==null || runOutStartValue=='') && runOutEndValue!='' && runOutEndValue!=null){
                  this.runOutStartErr.isDateErr=true;
                  this.runOutStartErr.dateErrMsg = 'Run-Out Start date should not be empty or Invalid';       
                  flag=false;     
                  return;
                }
                if((runOutEndValue==null || runOutEndValue=='') && runOutStartValue!='' && runOutStartValue!=null){
                    this.runOutEndErr.isDateErr=true;
                    this.runOutEndErr.dateErrMsg = 'Run-Out End date should not be empty or Invalid';  
                    flag=false;         
                    return;
                  }
                  //starts here Added by Venkatesh Enigonda
                  if(terminationDateValue !='' && terminationDateValue!=null){
                    if(terminationDateValue == startDateValue || terminationDateValue == endDateValue){        
                      this.terminationDateErr.isDateErr=true;
                      this.terminationDateErr.dateErrMsg = 'Termination date should not be Equal to Contract Start and End Dates'; 
                      flag=false;          
                      return;
                    }
                  }//Ends here
                if(terminationDateValue !='' && terminationDateValue!=null){
                    if(terminationDateValue < startDateValue || terminationDateValue > endDateValue){   
                           
                      this.terminationDateErr.isDateErr=true;
                      this.terminationDateErr.dateErrMsg = 'Termination date should be between Contract Start and End Dates'; 
                      flag=false;          
                      return;
                    }
                  }
                }
                if(exclusionIncurredStartDate!=null && exclusionIncurredEndDate!=null && exclusionIncurredStartDate!='' && exclusionIncurredEndDate!=''){
                  if(exclusionIncurredStartDate == exclusionIncurredEndDate)
                  {
                    this.exIncStartEndErr.isDateErr=true;
                    this.exIncStartEndErr.dateErrMsg = 'Exclusion_Incurred Start Date should not be equal to Incurred End Date';
                    return;
 
                  }
                  if(exclusionIncurredStartDate > exclusionIncurredEndDate)
                  {
                    console.log("inside");
                    this.exIncStartErr.isDateErr=true;
                    this.exIncStartErr.dateErrMsg = 'Exclusion_Incurred Start Date should not be greaterthan Incurred End Date';
                    return;
 
                  }
                }
                if(exclusionPaidStartDate!=null && exclusionPaidEndDate!=null && exclusionPaidStartDate!='' && exclusionPaidEndDate!=''){
                  if(exclusionPaidStartDate == exclusionPaidEndDate)
                  {
                    this.exPaidStartEndErr.isDateErr=true;
                    this.exPaidStartEndErr.dateErrMsg = 'Exclusion_Paid Start Date should not be equal to  Paid End Date'
                    return;
 
                  }
                  if(exclusionPaidStartDate > exclusionPaidEndDate)
                  {
                    this.exPaidStartErr.isDateErr=true;
                    this.exPaidStartErr.dateErrMsg = 'Exclusion_Paid Start Date should not be greaterthan Paid End Date';
                    return;
 
                  }
                }
                if((exclusionIncurredStartDate ==null || exclusionIncurredStartDate =='') && exclusionIncurredEndDate!='' && exclusionIncurredEndDate!=null){
                  this.exIncStartEndErr.isDateErr=true;
                  this.exIncStartEndErr.dateErrMsg = 'Exclusion_Incurred Start date should not be empty or Invalid';
          
                  return;
                }
                if((exclusionIncurredEndDate==null || exclusionIncurredEndDate=='') && exclusionIncurredStartDate!='' && exclusionIncurredStartDate!=null){
                  this.exIncStartEndErr.isDateErr =true;
                  this.exIncStartEndErr.dateErrMsg = 'Exclusion_Incurred End date should not be empty or Invalid';
          
                return;
              }
              if((exclusionPaidStartDate ==null || exclusionPaidStartDate =='') && exclusionPaidEndDate!='' && exclusionPaidEndDate!=null){
                this.exPaidStartEndErr.isDateErr=true;
                this.exPaidStartEndErr.dateErrMsg = 'Exclusion_Paid Start date should not be empty or Invalid';
        
                return;
              }
              if((exclusionPaidEndDate==null || exclusionPaidEndDate=='') && exclusionPaidStartDate!='' && exclusionPaidStartDate!=null){
                this.exPaidStartEndErr.isDateErr =true;
                this.exPaidStartEndErr.dateErrMsg = 'Exclusion_Paid End date should not be empty or Invalid';
        
              return;
            }
      if (this.isAddMode) {
        
        this.addContract();
      } else {
        //  if(this.updateNoChange.flag) return;
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

  getContractAudits(contractId: number){
    
    this.contractService.getContractAudits(contractId).subscribe((res)=>{
      this.contractAudits = res;
      
    })
  }
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
      policyYear: this.f.policyYear.value,
      description: this.f.description.value,
      exclusionIncurredStartDate:this.datePipe.transform(this.f.exclusionIncurredStartDate.value,'yyyy-MM-dd'),
      exclusionIncurredEndDate:this.datePipe.transform(this.f.exclusionIncurredEndDate.value,'yyyy-MM-dd'),
      exclusionPaidStartDate:this.datePipe.transform(this.f.exclusionPaidStartDate.value,'yyyy-MM-dd'),
      exclusionPaidEndDate:this.datePipe.transform(this.f.exclusionPaidEndDate.value,'yyyy-MM-dd')
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
            next: (data) => {
                console.log(data);
              
              this.navService.setContractID(data.id);
              //this.openCustomModal(false, null);
              this.getAllContracts();
              //this.contractForm.reset();                   
              //this.clientService.passClientId(this.f.clientId.value);   
              this.alertService.success('New Contract added', { keepAfterRouteChange: true });  
              //this.productService.setProductAddStatus(true);  
             
              this.isAdded = true;
              
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
          exclusionIncurredStartDate:this.datePipe.transform(this.f.exclusionIncurredStartDate.value,'yyyy-MM-dd'),
          exclusionIncurredEndDate:this.datePipe.transform(this.f.exclusionIncurredEndDate.value,'yyyy-MM-dd'),
          exclusionPaidStartDate:this.datePipe.transform(this.f.exclusionPaidStartDate.value,'yyyy-MM-dd'),
          exclusionPaidEndDate:this.datePipe.transform(this.f.exclusionPaidEndDate.value,'yyyy-MM-dd'),
          status:this.contractForm.get('status').value==true?1:0,
          userId: this.loginService.currentUserValue.name,
          ftn: '',
          ftnName: '',
          policyYear: this.f.policyYear.value,   
          description: this.f.description.value
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
        this.fetchContractDetailsNew = this.contractForm.value;
        if(JSON.stringify(this.fetchContractDetailsOld) == JSON.stringify(this.fetchContractDetailsNew) ){
          
          this.updateNoChange.flag=true;
          this.updateNoChange.message="No Values updated. Update atleast one value to update";
          return;
        }
        this.contractService.updateContract(updateConObj)
            .pipe(first())
            .subscribe({
                next: () => {
                    //this.openCustomModal(false,null); 
                    //this.contractForm.reset();
                    this.getContractAudits(this.uContractId);
                    this.getAllContracts();
                    this.updateNoChange.flag=false;
                    this.updateNoChange.message="";
                    this.isDisabled = true;
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

    gotoProductAdd(){     
      if(this.isAdded){
        console.log(this.tempContractObj);
        
        this.clientService.getClient(this.f.clientId.value).subscribe((data)=>{
          
          this.navService.setProductObj(data[0].clientId, data[0].clientName, true,false);
          
          this.router.navigate(['/product']); 
        });
      }
    }

    gotoProductUpdate(){
      // this.clientService.getClient(this.f.clientId.value).subscribe(
      //   (data: IClient[]) => {                  
      //     this.navService.setProductObj(data[0].clientId, data[0].clientName, false, true);
      //     this.isAdded = false;
      //     this.router.navigate(['/product']);   
      //   });       
      this.contractService.getContract(this.f.contractId.value).subscribe(
        (data: IContract[]) => {                  
          this.navService.setProductObj(data[0].clientId, data[0].contractId, false, true);
          this.isAdded = false;
          this.router.navigate(['/product']);   
        });   
    }
    clearSearchInput(){
      this.searchInputValue='';
      this.filterSearchInput.nativeElement.value='';
      this.filterSearchInput.nativeElement.focus();
      this.getAllContracts();
    }
    goBackPreviousNoFilter(){
      this.navService.resetClientObj();
      this.router.navigate(['/clients']);
    }
    goBackPreviousScreen(){
      this.isFilterOn=true;
      if(this.isAdded){
        this.isFilterOn=true;
        this.openCustomModal(false,null);
        this.searchInputValue = this.tempContractObj.clientName;
        this.filterSearchInput.nativeElement.focus();
        //setTimeout(()=>{this.filterSearchInput.nativeElement.focus();},500);    
            
      }
      else{
        
        this.router.navigate(['/clients']);
      }
    }
    goBackCurrentScreen(){
      this.isFilterOn=true;
      if(this.tempContractObj.isUpdate){
        
        setTimeout(()=>{this.filterSearchInput.nativeElement.blur();},400);
        this.openCustomModal(false,null);
        this.searchInputValue=this.tempContractObj.clientName;
       // this.filterSearchInput.nativeElement.focus();

        setTimeout(()=>{this.filterSearchInput.nativeElement.focus();},800);
      }
      else{
        this.openCustomModal(false,null);
      }
    }
}
