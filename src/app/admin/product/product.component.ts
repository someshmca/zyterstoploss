import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';
import {DecimalPipe} from '@angular/common';
import { IProductAll, IProductAdd,
  IProductUpdate,IActiveClient, ICoveredClaims, IListContractClaims
  } from '../models/product-model';
import {ProductService} from '../services/product.service';
import { first } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { formatDate, DatePipe } from '@angular/common';
import { ClientsService } from '../services/clients.service';
import { IClient } from '../models/clients-model';
import {IContractsByClient} from '../models/contracts-model';
import { LoginService } from 'src/app/shared/services/login.service';
import { ContractService } from '../services/contract.service';
import {CLAIM_BASIS_CONSTANT} from '../claim-basis.constant';
import { HealthPlanService } from '../services/health-plan.service';
import {NavPopupService} from '../services/nav-popup.service';
import { IClientObj } from '../models/nav-popups.model';
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  providers: [DatePipe]
})
export class ProductComponent implements OnInit {
  productForm: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;
    isCustomModalOpen: boolean = false;
    @ViewChild("focusElem") focusTag: ElementRef;
    @ViewChild("filterSearchInput") filterSearchInput: ElementRef;
  products:IProductAll[] = [];
  activeClients: IActiveClient[]=[];
  contractsByClientId: IContractsByClient[] = [];
  displayedColumns: string[] = ['clientName','contractId', 'claimBasis','productId'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  isFilterOn: boolean = false;
  coveredClaims: ICoveredClaims[] = [];
  listContractClaims: IListContractClaims[] = [];
  contractIDsAll: any[] = [];
  addObj:IProductAdd;
  uProductId: number;
  uClientId: string;
  uContractId: number;
  claimBasis : string[];
  toSwitchOtherScreen: boolean=false;
  sslClaimBasisErr = {isValid: false,errMsg:''};
  aslClaimBasisErr = {isValid: false,errMsg:''};

  format = '2.2-2';
  isViewModal: boolean;
  sslIncurredEndErr = {
    isDateErr: false,
    dateErrMsg: ''
  };
  sslPaidEndErr = {
    isDateErr: false,
    dateErrMsg: ''
  };
  contractIds:number;
  tempProductObj: IClientObj;
  aslIncurredEndErr = {
    isDateErr: false,
    dateErrMsg: ''
  };
  sslSPecificErr= // starts here Venkatesh Enigonda
  {
    isDateErr:false,
    dateErrMsg:''
  };
  
  aslAggregateErr = {
    isDateErr: false,
    dateErrMsg: ''
  }; //Ends Here
  aslPaidEndErr = {
    isDateErr: false,
    dateErrMsg: ''
  };
  sslTermCovrErr = {
    isDateErr: false,
    dateErrMsg: ''
  };
  aslTermCovrErr = {
    isDateErr: false,
    dateErrMsg: ''
  };
  sslDeductibleErr = {
    isValid: false,
    errMsg : ''
  }
  isDisabled:boolean=false;
  isEditSelected: boolean = false;
  searchInputValue: string='';
  sharedContractID: number;
  // contractAddStatus: boolean;
  // contractUpdateStatus: boolean;
  // productAddStatus: boolean;
  // productUpdateStatus: boolean;
  // planAddStatus: boolean;
  // planUpdateStatus: boolean;
  
  isAdded: boolean;
  planObj:IClientObj;
  isAdmin: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private clientService: ClientsService,
    private contractService: ContractService,
    private planService: HealthPlanService,
    private alertService: AlertService,
    private datePipe: DatePipe,
    private loginService: LoginService,
    private navService: NavPopupService,
    private decimalPipe: DecimalPipe)
    {
   }
   

  ngOnInit() {  

    this.productForm = this.formBuilder.group({
      productId: 0,
      clientId: ['', Validators.required],
      contractId: ['', Validators.required],     
      sslClaimBasis: ['', Validators.required],     
      sslIncurredStartDate: ['', Validators.required],
      sslIncurredEndDate: ['', Validators.required],
      sslContractStartDate:[''],
      sslContractEndDate: [''],

      sslPaidStartDate: ['', Validators.required],
      sslPaidEndDate: ['', Validators.required],
      //below from sslRunInLimit to sslLifetimeLimit are number fields
      sslRunInLimit:0,
      sslDeductible: ['', Validators.required],
      sslAggDeductible:0,
      sslAnnualLimit:0,
      sslLifetimeLimit:0,
      sslPartcipantLimit:0,//(VE 1-08-2021 starts)

      sslIsImmediateReimbursement:false,
      sslTermCoverageExtEndDate:'',
      sslCoveredClaims: ['', Validators.required],
      sslLasering: false,

      //below from aslDeductible to aslExpecteddClaimLiability are number fields
      aslDeductible:0,
      aslMinDeductible:['', Validators.required],
      aslExpectedClaimLiability:0,

      aslIncurrredStartDate: ['', Validators.required],
      aslIncurredEndDate: ['', Validators.required],
      
      aslContractStartDate: [''],
      aslContractEndDate: [''],
      aslCorridor:[''],

      aslPaidStartDate:['', Validators.required],
      aslPaidEndDate:['', Validators.required],
      // below aslRunInLimit is a number field
      aslRunInLimit:0,
      aslClaimBasis:['', Validators.required],

      aslAnnualLimit:0,  // this is a number field
      aslLifeTimeLimit:0, // this is a number field

      aslIsMonthlyAccomidation:false,
      aslTermCoverageExtEndDate:'',
      aslCoveredClaims: ['', Validators.required],
      


      isMaxLiability:false,
      ibnrPercentage:['', Validators.required], // this is a number field
      defferedFeePercentage:['', Validators.required], // this is a number field

      status:false,
      userId: this.loginService.currentUserValue.name,
      lstContractClaims: []
    });
    this.isAdded=false;
    this.toSwitchOtherScreen=false;
    this.claimBasis = CLAIM_BASIS_CONSTANT.values;
    
    this.getAllProducts();
    this.getActiveClients();     
    this.getCoveredClaims();
    //this.getAllContracts();
    //this.isClientSelected = false;
    this.checkMaxLiability(); 
    this.navService.planObj.subscribe((data)=>{this.planObj=data;})
    this.navService.contractID.subscribe((data)=>{this.sharedContractID=Number(data.id);  })
    this.getProductStatus();
    // this.getContractAddStatus();
    // this.getContractUpdateStatus();

    //this.getProductUpdateStatus();    
    this.loginService.getLoggedInRole();
    this.isAdmin = this.loginService.isAdmin;
  }
  getProductStatus(){
    this.navService.productObj.subscribe((data)=>{
      this.tempProductObj=data;
      
      if(data.isAdd && !this.planObj.isAdd){
        this.getContractIDs(data.clientId);        
        this.productForm.patchValue({
          clientId: data.clientId,
          contractId: this.sharedContractID
        });
        this.openCustomModal(true,null);
      }
      else if(data.isAdd && this.planObj.isAdd){
        this.searchInputValue=data.clientName;
        setTimeout(()=>{this.filterSearchInput.nativeElement.blur()},500);
        setTimeout(()=>{this.filterSearchInput.nativeElement.focus()},1000);
      }
      else if(data.isUpdate){          
        this.searchInputValue = data.clientName;       
        setTimeout(()=>{this.filterSearchInput.nativeElement.blur()},500);
        setTimeout(()=>{this.filterSearchInput.nativeElement.focus()},1000);
        //this.doFilter(this.searchInputValue);
      }
      else{     
        this.searchInputValue = '';
        this.filterSearchInput.nativeElement.blur(); 
        this.getAllProducts();
      }
    });
  }
  get f() { return this.productForm.controls; }

  checkMaxLiability(){    
    console.log(this.f.isMaxLiability.value);
    if(this.f.isMaxLiability.value==true){
      this.f.ibnrPercentage.enable();
      this.f.defferedFeePercentage.enable();
    }
    else{
      this.f.ibnrPercentage.disable();
      this.f.defferedFeePercentage.disable();
    }
  }
  getActiveClients(){    
    this.productService.getAllClients().subscribe(
      (data)=>{       
        data.sort((a, b) => (a.clientName > b.clientName) ? 1 : -1); // sorts Ascending order by alphabet
        this.activeClients = data;        
      })
  }
  
  getCoveredClaims(){
    this.productService.getCoveredClaims().subscribe((data)=>{
        this.coveredClaims = data;
    })
  }
  getContractIDs(clientId){
    this.contractService.getContractsByClientID(clientId).subscribe((data)=>{
      data.sort((x,y) => x.contractId - y.contractId);
      this.contractsByClientId = data;     
      if(this.sharedContractID>0){
        this.productForm.patchValue({
          contractId: this.sharedContractID
        })
      }
    })
  }
  getAllContracts(){
    this.contractService.getAllContracts().subscribe((data)=>{
        this.contractIDsAll = data;
    })
  }
  getAllProducts(){    
    this.productService.getAllProducts().subscribe(
      (data: IProductAll[]) => {
        
          this.products = data;
          //this.contracts = data;
          this.dataSource = new MatTableDataSource(this.products);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      }
    )
  }  
 
  doFilter(filterValue:string){ //added by Venkatesh Enigonda
    this.dataSource.filter=filterValue.trim().toLowerCase();
    this.dataSource.filterPredicate = (data:IProductAll, filter: string) => {
      const Id=data.contractId.toString();
      const CompareData=data.clientName.toLowerCase() ||'';
      const CompareData1=Id||'';
      const CompareData2=data.aslClaimBasis.toLowerCase() ||'';
      return CompareData.indexOf(filter)!==-1 || CompareData1.indexOf(filter)!==-1 || CompareData2.indexOf(filter)!==-1;
    };

  }//Ends here
  
  clearErrorMessages(){
    this.sslIncurredEndErr.isDateErr=false;
    this.sslIncurredEndErr.dateErrMsg='';
    this.sslPaidEndErr.isDateErr=false;
    this.sslPaidEndErr.dateErrMsg='';
    this.aslIncurredEndErr.isDateErr=false;
    this.aslIncurredEndErr.dateErrMsg='';
    this.aslPaidEndErr.isDateErr=false;
    this.aslPaidEndErr.dateErrMsg='';    
    this.sslTermCovrErr.isDateErr=false;
    this.sslTermCovrErr.dateErrMsg='';  
    this.aslTermCovrErr.isDateErr=false;
    this.aslTermCovrErr.dateErrMsg=''; 
    this.sslDeductibleErr.isValid=false;
    this.sslDeductibleErr.errMsg='';
    this.sslClaimBasisErr.isValid=false;
    this.sslClaimBasisErr.errMsg='';
    this.aslClaimBasisErr.isValid=false;
    this.aslClaimBasisErr.errMsg='';
    this.sslSPecificErr.isDateErr=false;// starts here added by Venkatesh Enigonda
    this.sslSPecificErr.dateErrMsg='';
    this.aslAggregateErr.isDateErr=false;
    this.aslAggregateErr.dateErrMsg='';//Ends Here
  }
 
  onSubmit() {
    this.submitted = true;
    this.alertService.clear();

    // reset alerts on submit
    this.clearErrorMessages();
    // stop here if form is invalid
   if (this.productForm.invalid) {
     this.clearErrorMessages();
     return;
   }

   if( this.f.sslClaimBasis.value.length < 5 ) // starts here added by Venkatesh Enigonda
   {
    this.sslClaimBasisErr.isValid=true;
    this.sslClaimBasisErr.errMsg='In-Valid Format in Specific ClaimBasis';
    return;
   }
  
   if(this.f.sslClaimBasis.value.charAt(2)!='/')
   {  
     this.sslClaimBasisErr.isValid=true;
     this.sslClaimBasisErr.errMsg='In-Valid Format in Specific ClaimBasis';
     return;
   }
   if( this.f.aslClaimBasis.value.length < 5 )
   {
    this.aslClaimBasisErr.isValid=true;
    this.aslClaimBasisErr.errMsg='In-Valid Format in Aggregate ClaimBasis';
    return;
   }
  
   if(this.f.aslClaimBasis.value.charAt(2)!='/')
   {
     this.aslClaimBasisErr.isValid=true;
     this.aslClaimBasisErr.errMsg='In-Valid Format in Aggregate ClaimBasis';
     return;
   }// Ends Here
      
   if(this.productForm.valid && this.f.sslIncurredStartDate.value > this.f.sslIncurredEndDate.value){
    this.sslIncurredEndErr.isDateErr=true;
    this.sslIncurredEndErr.dateErrMsg = 'SSL Incurred start date should not be greater than SSL Incurred End date';
    
    return;
  }
  
  // Starts here added by Venkatesh Enigonda
  if(this.productForm.valid && this.f.sslIncurredStartDate.value == this.f.sslIncurredEndDate.value){
 
    this.sslIncurredEndErr.isDateErr=true;
    this.sslIncurredEndErr.dateErrMsg = 'SSL Incurred start date should not be Equal to SSL Incurred End date';
    
    return;
  }//Ends here
  if(this.productForm.valid && this.f.sslPaidStartDate.value > this.f.sslPaidEndDate.value){
   this.sslPaidEndErr.isDateErr=true;
   this.sslPaidEndErr.dateErrMsg = 'SSL Paid Start date should not be greater than SSL Paid End date';
   
   return;
 }
//Starts here added by Venkatesh Enigonda
if(this.productForm.valid && this.f.sslPaidStartDate.value == this.f.sslPaidEndDate.value){
 
  this.sslPaidEndErr.isDateErr=true;
  this.sslPaidEndErr.dateErrMsg ='SSL Paid Start date should not be Equal to SSL Paid End date';
    
  return;
}


// Ends here
 if(this.productForm.valid && this.f.aslIncurrredStartDate.value > this.f.aslIncurredEndDate.value){
  this.aslIncurredEndErr.isDateErr=true;
  this.aslIncurredEndErr.dateErrMsg = 'ASL Incurred start date should not be greater than ASL Incurred End date';
  
  return;
}
 //Starts here added by Venkatesh Enigonda
 if(this.productForm.valid && this.f.sslPaidStartDate.value == this.f.sslPaidEndDate.value){
 
  this.sslPaidEndErr.isDateErr=true;
  this.sslPaidEndErr.dateErrMsg ='SSL Paid Start date should not be Equal to SSL Paid End date';
  
  return;
}
if(this.f.sslContractStartDate.value !=null && this.f.sslContractStartDate.value !='' && this.f.sslContractEndDate.value!=null && this.f.sslContractEndDate.value!=''){  
  if(this.f.sslContractStartDate.value == this.f.sslContractEndDate.value){  
    this.sslSPecificErr.isDateErr=true;
    this.sslSPecificErr.dateErrMsg ='SSL Specific Start date should not be Equal to SSL Specific End date' ;    
    return;
  }
  if(this.f.sslContractStartDate.value == this.f.sslContractEndDate.value){
    this.sslSPecificErr.isDateErr=true;
    this.sslSPecificErr.dateErrMsg ='SSL Specific Start date should not be Equal to SSL Specific End date' ;    
    return;
  }
}
if((this.f.sslContractStartDate.value ==null || this.f.sslContractStartDate.value =='') && this.f.sslContractEndDate.value!=null && this.f.sslContractEndDate.value!=''){  
  this.sslSPecificErr.isDateErr=true;
  this.sslSPecificErr.dateErrMsg ='SSL Specific Start date is not valid' ;    
  return;

}
if(this.f.sslContractStartDate.value !=null && this.f.sslContractStartDate.value !='' && (this.f.sslContractEndDate.value==null || this.f.sslContractEndDate.value=='')){  
  this.sslSPecificErr.isDateErr=true;
  this.sslSPecificErr.dateErrMsg ='SSL Specific End date is not valid' ;    
  return;

}
// Ends here
if(this.productForm.valid && this.f.aslPaidStartDate.value > this.f.aslPaidEndDate.value){
 this.aslPaidEndErr.isDateErr=true;
 this.aslPaidEndErr.dateErrMsg = 'ASL Paid Start date should not be greater than ASL Paid End date';
 
 return;
}
// Starts here added by Venkatesh Enigonda
if(this.productForm.valid && this.f.aslIncurrredStartDate.value ==this.f.aslIncurredEndDate.value){
  this.aslIncurredEndErr.isDateErr=true;
  this.aslIncurredEndErr.dateErrMsg = 'ASL Incurred start date should not be Equal to ASL Incurred End date ' ;
  
  return;
}
if(this.f.aslContractStartDate.value !=null && this.f.aslContractStartDate.value !='' && this.f.aslContractEndDate.value!=null && this.f.aslContractEndDate.value!=''){
  if(this.productForm.valid && this.f.aslContractStartDate.value == this.f.aslContractEndDate.value){

    this.aslAggregateErr.isDateErr=true;
    this.aslAggregateErr.dateErrMsg ='Aggregate Start date should not be Equal to Aggregate End date ';
    
    return;
  }
  if(this.productForm.valid && this.f.aslContractStartDate.value > this.f.aslContractEndDate.value){
  
    this.aslAggregateErr.isDateErr=true;
    this.aslAggregateErr.dateErrMsg =' Aggregate Start date should not be greater than Aggregate End date ';
    
    return;
  }
}
if((this.f.aslContractStartDate.value ==null || this.f.aslContractStartDate.value =='') && this.f.aslContractEndDate.value!=null && this.f.aslContractEndDate.value!=''){  
  this.sslSPecificErr.isDateErr=true;
  this.sslSPecificErr.dateErrMsg ='Aggregate Start date is not valid' ;    
  return;
}
if(this.f.aslContractStartDate.value !=null && this.f.aslContractStartDate.value !='' && (this.f.aslContractEndDate.value==null || this.f.aslContractEndDate.value=='')){  
  this.sslSPecificErr.isDateErr=true;
  this.sslSPecificErr.dateErrMsg ='Aggregate End date is not valid' ;    
  return;
}
if(this.productForm.valid && this.f.aslPaidStartDate.value > this.f.aslPaidEndDate.value){
 this.aslPaidEndErr.isDateErr=true;
 this.aslPaidEndErr.dateErrMsg = 'ASL Paid Start date should not be greater than ASL Paid End date';
 
 return;
}
// starts here added by Venkatesh Enigonda
if(this.productForm.valid && this.f.aslPaidStartDate.value == this.f.aslPaidEndDate.value){
  this.aslPaidEndErr.isDateErr=true;
  this.aslPaidEndErr.dateErrMsg = 'ASL Paid Start date should not be Equal to ASL Paid End date ';
  
  return;
 }
 //Ends here
if(this.productForm.valid && Number(this.f.sslDeductible.value)<=0){
  this.sslDeductibleErr.isValid=true;
  this.sslDeductibleErr.errMsg="SSL Deductible value should be greater than 0";
  return;
}
if(this.productForm.valid && this.f.sslDeductible.value==''){
  this.sslDeductibleErr.isValid=true;
  this.sslDeductibleErr.errMsg="SSL Deductible is not valid";
  return;
}
console.log(this.f.sslTermCoverageExtEndDate.value );
console.log(this.f.sslTermCoverageExtEndDate.valid);

let sslTermVal=this.f.sslTermCoverageExtEndDate.value;

if(sslTermVal!='' && this.productForm.valid){
  
  if(this.f.sslTermCoverageExtEndDate.value <= this.f.sslIncurredEndDate.value){
    this.sslTermCovrErr.isDateErr=true;
    
    this.sslTermCovrErr.dateErrMsg = 'SSL Term Coverage Date should be greater than SSL Incurred End Date';  
    return;
  }
}
let aslTermVal=this.f.aslTermCoverageExtEndDate.value;

if(aslTermVal!='' && this.productForm.valid){
  
  if(this.f.aslTermCoverageExtEndDate.value <= this.f.aslIncurredEndDate.value){
    this.aslTermCovrErr.isDateErr=true;
    
    this.aslTermCovrErr.dateErrMsg = 'ASL Term Coverage Date should be greater than ASL Incurred End Date';  
    return;
  }
}

   this.loading = true;
   
      if (this.isAddMode) {
        
          this.addProduct();
      } else {
          this.updateProduct();          
      }
    
}

openViewModal(bool, id:any){
  this.isViewModal = true;
  this.openCustomModal(bool, id);
}
  openCustomModal(open: boolean, id:any) {    
    
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100);
    this.submitted = false;
    this.loading = false;
    this.isDisabled=false;
    if(open && id==null){
      this.isAddMode = true;    
      this.isEditSelected = false;
      this.isFilterOn=false;
      this.f.clientId.enable();
      this.f.contractId.enable();
    }
    
   
    this.isCustomModalOpen = open;
    if (!open && id==null) {
      this.getAllProducts();
      this.productForm.reset();
      this.clearErrorMessages();
      this.isAddMode = false;
      this.isEditSelected = false;
      this.searchInputValue='';
      this.isAdded=false;
      this.isViewModal=false;
      if(!this.isFilterOn){
        this.navService.resetProductObj();
        this.navService.resetContractID();
        this.clearSearchInput();        
      }
    }
    console.log("id inside modal: "+id);
    
    if(id!=null && open){
      this.isAddMode = false;
      this.isEditSelected = true;
      this.isFilterOn=false;

      this.f.clientId.disable();
      this.f.contractId.disable();
      this.getAllProducts();
      
      this.productService.getProduct(id.productId).subscribe(x => {     
        
        this.uProductId = x[0].productId;  
        this.uClientId = x[0].clientId,
        this.uContractId = x[0].contractId,
        this.getContractIDs(x[0].clientId);
        
        console.log(x[0].productId);  
        console.log("Account "+this.uClientId);
        console.log("Contract ID "+this.uContractId);
             console.log("x of 0 id "+x[0].contractId);
             
        this.getContractIDs(x[0].clientId);
            this.productForm.patchValue({
              productId:x[0].productId,
              contractId:x[0].contractId,
              clientId:this.uClientId,
              sslIncurredStartDate:this.datePipe.transform(new Date(x[0].sslIncurredStartDate), 'yyyy-MM-dd'),
              sslIncurredEndDate:this.datePipe.transform(new Date(x[0].sslIncurredEndDate), 'yyyy-MM-dd'),
              sslContractStartDate:x[0].sslContractStartDate==null?"":this.datePipe.transform(new Date(x[0].sslContractStartDate), 'yyyy-MM-dd'),
              sslContractEndDate:x[0].sslContractEndDate==null?"":this.datePipe.transform(new Date(x[0].sslContractEndDate), 'yyyy-MM-dd'),
              sslPaidStartDate:this.datePipe.transform(new Date(x[0].sslPaidStartDate), 'yyyy-MM-dd'),
              sslPaidEndDate:this.datePipe.transform(new Date(x[0].sslPaidEndDate), 'yyyy-MM-dd'),
              sslRunInLimit:x[0].sslRunInLimit,
              sslClaimBasis:x[0].sslClaimBasis,
              sslDeductible:this.decimalValueString(x[0].sslDeductible),
              sslAggDeductible:x[0].sslAggDeductible,
              sslAnnualLimit:x[0].sslAnnualLimit,
              sslLifetimeLimit:x[0].sslLifetimeLimit,
              sslPartcipantLimit:x[0].sslPartcipantLimit,//(VE 1-08-2021 starts)
              sslIsImmediateReimbursement:x[0].sslIsImmediateReimbursement,
              sslTermCoverageExtEndDate:x[0].sslTermCoverageExtEndDate==null?"":this.datePipe.transform(new Date(x[0].sslTermCoverageExtEndDate), 'yyyy-MM-dd'),
              sslLasering: x[0].sslLasering,
              aslDeductible:0,
              aslMinDeductible:x[0].aslMinDeductible,
              aslExpectedClaimLiability:x[0].aslExpectedClaimLiability,
              aslIncurrredStartDate:this.datePipe.transform(new Date(x[0].aslIncurrredStartDate), 'yyyy-MM-dd'),
              aslIncurredEndDate:this.datePipe.transform(new Date(x[0].aslIncurredEndDate), 'yyyy-MM-dd'),
              aslContractStartDate:x[0].aslContractStartDate==null?"":this.datePipe.transform(new Date(x[0].aslContractStartDate), 'yyyy-MM-dd'),
              aslContractEndDate:x[0].aslContractEndDate==null?"":this.datePipe.transform(new Date(x[0].aslContractEndDate), 'yyyy-MM-dd'),
              aslCorridor: x[0].aslCorridor,
              aslPaidStartDate:this.datePipe.transform(new Date(x[0].aslPaidStartDate), 'yyyy-MM-dd'),
              aslPaidEndDate:this.datePipe.transform(new Date(x[0].aslPaidEndDate), 'yyyy-MM-dd'),
              aslRunInLimit:x[0].aslRunInLimit,
              aslClaimBasis:x[0].aslClaimBasis,
              aslAnnualLimit:x[0].aslAnnualLimit,
              aslLifeTimeLimit:x[0].aslLifeTimeLimit,
              aslIsMonthlyAccomidation:x[0].aslIsMonthlyAccomidation,
              aslTermCoverageExtEndDate:x[0].aslTermCoverageExtEndDate==null?"":this.datePipe.transform(new Date(x[0].aslTermCoverageExtEndDate), 'yyyy-MM-dd'),
              isMaxLiability:x[0].isMaxLiability,
              ibnrPercentage:x[0].ibnrPercentage,
              defferedFeePercentage:x[0].defferedFeePercentage,
              status:x[0].status, 
              userId: this.loginService.currentUserValue.name     
            });
            let aslCc=[];
            let sslCc=[];
            console.log(x[0].lstContractClaims.length)
            for(let i=0; i<x[0].lstContractClaims.length; i++){
                console.log(x[0].lstContractClaims[i].sltype);
                console.log(x[0].lstContractClaims[i].claimtypecode);
                if(x[0].lstContractClaims[i].sltype=='A'){
                  aslCc.push(x[0].lstContractClaims[i].claimtypecode);
                }
                if(x[0].lstContractClaims[i].sltype=='S'){
                  sslCc.push(x[0].lstContractClaims[i].claimtypecode);
                }
            }
            
            this.productForm.patchValue({
              sslCoveredClaims: sslCc,
              aslCoveredClaims: aslCc
            });
            this.checkMaxLiability();
            console.log(this.productForm.value);
            
          });
          if(this.isViewModal){
            this.productForm.disable();
          }
          else{
            this.productForm.enable();
            this.f.clientId.disable();
            this.f.contractId.disable();
          }
         }
      }
      clearSearchInput(){
        this.searchInputValue='';
        this.filterSearchInput.nativeElement.value='';
        this.filterSearchInput.nativeElement.focus();
        this.getAllProducts();
      }
      goBackPreviousNoFilter(){
        this.toSwitchOtherScreen=true;
        this.router.navigate(['/contracts']);
        this.navService.resetContractObj();
      }
      goBackPreviousScreen(){  
        if(this.isAdded){
          this.isFilterOn=true;
          this.openCustomModal(false,null);
          this.searchInputValue = this.tempProductObj.clientName;
          setTimeout(()=>this.filterSearchInput.nativeElement.blur(),500);
          setTimeout(()=>this.filterSearchInput.nativeElement.focus(),1000);
        }
        else{
          this.router.navigate(['/contracts']);
        }
      }
      goBackCurrentScreen(){  // from Update Modal going back to current screen
        this.isFilterOn=true;
          if(this.tempProductObj.isUpdate){
            
            this.openCustomModal(false,null);
            this.searchInputValue=this.tempProductObj.clientName;
            setTimeout(()=>this.filterSearchInput.nativeElement.focus(),500);
          }
          else{
            this.openCustomModal(false,null);
          }
      }
    gotoPlanAdd(){
      this.toSwitchOtherScreen=true;
      if(this.isAdded){
        this.clientService.getClient(this.f.clientId.value).subscribe((data)=>{
          this.navService.setPlanObj(data[0].clientId, data[0].clientName, true,false);
          
          this.router.navigate(['/health-plan']);
        });
      }
    }
    gotoPlanUpdate(){
      this.toSwitchOtherScreen=true;
      this.clientService.getClient(this.f.clientId.value).subscribe(
        (data: IClient[]) => {    
          this.isFilterOn=false;
          this.navService.setPlanObj(data[0].clientId, data[0].clientName, false, true);
          this.router.navigate(['/health-plan']);   
        });    
    }
    gotoLaseringAdd(){
      this.toSwitchOtherScreen=true;
      if(this.isAdded){
        this.clientService.getClient(this.f.clientId.value).subscribe((data)=>{
          this.navService.setLaseringObj(data[0].clientId, data[0].clientName, true,false);
          
          this.router.navigate(['/lasering']);
        });
      }
    }
    gotoLaseringUpdate(){
      this.toSwitchOtherScreen=true;
      this.clientService.getClient(this.f.clientId.value).subscribe(
        (data: IClient[]) => {                  
          this.navService.setLaseringObj(data[0].clientId, data[0].clientName, false, true);
          this.isAdded = false;
          this.router.navigate(['/lasering']);
        });
    }
    dateValue(dateVal){
      if(dateVal==''){
        dateVal=null;
      }
      else{
        dateVal=this.datePipe.transform(dateVal, 'yyyy-MM-dd')
      }
      console.log(dateVal);
      return dateVal;
    }
    decimalValueString(inputValue){
      let a;
      if(inputValue==0 || inputValue==''){
        a=0;
      }
      else{
        a= this.decimalPipe.transform(inputValue,this.format);        
      }
      console.log(a);      
      
      return a;
    }
    decimalValue(inputValue:number){
      if(inputValue==0){
        inputValue=0;
      }
      else{
        inputValue= Number(this.decimalPipe.transform(inputValue,this.format));        
      }
      console.log(inputValue);      
      return inputValue;
    }     
patchProductForm(){
  this.productForm.patchValue({
    productId: 0,
    contractId: this.sharedContractID>0?this.sharedContractID:Number(this.f.contractId.value),
    status:this.f.status.value==true?1:1,
    //clientId: string;
    //sslClaimBasis: string;
    sslIncurredStartDate:this.dateValue(this.f.sslIncurredStartDate.value),
    sslIncurredEndDate: this.dateValue(this.f.sslIncurredEndDate.value),
    sslPaidStartDate: this.dateValue(this.f.sslPaidStartDate.value),
    sslPaidEndDate: this.dateValue(this.f.sslPaidEndDate.value),
    sslRunInLimit: this.decimalValue(this.f.sslRunInLimit.value),
    sslDeductible: this.decimalValue(this.f.sslDeductible.value),
    sslAggDeductible: this.decimalValue(this.f.sslAggDeductible.value),
    sslAnnualLimit: this.decimalValue(this.f.sslAnnualLimit.value),
    sslLifetimeLimit: this.decimalValue(this.f.sslLifetimeLimit.value),
    sslPartcipantLimit:this.decimalValue(this.f.sslPartcipantLimit.value),//(VE 1-08-2021 starts)
    sslTermCoverageExtEndDate: this.dateValue(this.f.sslTermCoverageExtEndDate.value),
    //sslIsImmediateReimbursement: boolean;
    sslLasering: this.f.sslLasering.value,

    //aslClaimBasis: string;
   // aslDeductible:0, // not using currently
    aslMinDeductible: this.decimalValue(this.f.aslMinDeductible.value),
    aslExpectedClaimLiability: this.decimalValue(this.f.aslExpectedClaimLiability.value),
    aslIncurrredStartDate: this.dateValue(this.f.aslIncurrredStartDate.value),
    aslIncurredEndDate: this.dateValue(this.f.aslIncurredEndDate.value),
	  aslContractStartDate:this.dateValue(this.f.aslContractStartDate.value),
    aslContractEndDate: this.dateValue(this.f.aslContractEndDate.value),
    aslPaidStartDate: this.dateValue(this.f.aslPaidStartDate.value),
    aslPaidEndDate: this.dateValue(this.f.aslPaidEndDate.value),
    aslRunInLimit: this.decimalValue(this.f.aslRunInLimit.value),
    aslAnnualLimit: this.decimalValue(this.f.aslAnnualLimit.value),
    aslLifeTimeLimit: this.decimalValue(this.f.aslLifeTimeLimit.value),
    //aslIsMonthlyAccomidation: boolean;
    aslTermCoverageExtEndDate: this.dateValue(this.f.aslTermCoverageExtEndDate.value),
	  aslCorridor: this.decimalValue(this.f.aslCorridor.value),
   // isMaxLiability: boolean;
    ibnrPercentage:this.decimalValue(this.f.ibnrPercentage.value),
    defferedFeePercentage: this.decimalValue(this.f.defferedFeePercentage.value),
    sslContractStartDate:this.dateValue(this.f.sslContractStartDate.value),
    sslContractEndDate: this.dateValue(this.f.sslContractEndDate.value),
    userId: this.loginService.currentUserValue.name,
    sslCoveredClaims: this.f.sslCoveredClaims.value,
    aslCoveredClaims: this.f.aslCoveredClaims.value
  });
  console.log(this.productForm.value);
  
}
private addProduct() {   
  

  console.log(this.f.sslCoveredClaims.value); // 'M', 'P'
  console.log(this.f.aslCoveredClaims.value); // 'M'
  
  this.listContractClaims=[];
 // this.productForm.patchValue(this.productForm.value);
 this.patchProductForm();
  
  for(let i=0; i<this.f.sslCoveredClaims.value.length; i++){
    this.listContractClaims.push({
      productid: 0,
      claimtypecode: this.f.sslCoveredClaims.value[i],
      sltype: 'S'
    })
  }
  for(let i=0; i<this.f.aslCoveredClaims.value.length; i++){
    this.listContractClaims.push({
      productid: 0,
      claimtypecode: this.f.aslCoveredClaims.value[i],
      sltype: 'A'
    })
  }
 console.log(this.listContractClaims);
 this.productForm.patchValue({
  clientId: this.f.clientId.value,
  contractId: this.sharedContractID>0?this.sharedContractID:this.f.contractId.value,  
  lstContractClaims: this.listContractClaims
 })
 
 
  this.productService.addProduct(this.productForm.value)
      .pipe(first())
      .subscribe({ 
          next: () => {
            
            this.getAllProducts(); 
            this.clearErrorMessages();           
              this.alertService.success('New Product added', { keepAfterRouteChange: true });   
              this.isAdded=true;
                
              // this.isDisabled=true;      
              //this.router.navigate(['../'], { relativeTo: this.route });
          },
          error: error => {
              this.alertService.error(error);
              this.loading = false;
          }
      });
      
  }

  private updateProduct() { 
  

    this.f.clientId.enable();
    this.f.contractId.enable();
    this.productForm.patchValue({  
    clientId: this.f.clientId.value,
    contractId: this.sharedContractID>0?this.sharedContractID:this.f.contractId.value,  
    status:this.f.status.value==true?1:0,
    aslTermCoverageExtEndDate: this.productForm.get('aslTermCoverageExtEndDate').value==""?null:this.datePipe.transform(this.f.aslTermCoverageExtEndDate.value, 'yyyy-MM-dd'),
    sslTermCoverageExtEndDate: this.productForm.get('sslTermCoverageExtEndDate').value==""?null:this.datePipe.transform(this.f.sslTermCoverageExtEndDate.value, 'yyyy-MM-dd'),
    sslContractStartDate:this.productForm.get('sslContractStartDate').value==""?null:this.datePipe.transform(this.f.sslContractStartDate.value,'yyyy-MM-dd'),
    sslContractEndDate:this.productForm.get('sslContractEndDate').value==""?null:this.datePipe.transform(this.f.sslContractEndDate.value,'yyyy-MM-dd'),
    aslContractStartDate:this.productForm.get('aslContractStartDate').value==""?null:this.datePipe.transform(this.f.aslContractStartDate.value,'yyyy-MM-dd'),
    aslContractEndDate:this.productForm.get('aslContractEndDate').value==""?null:this.datePipe.transform(this.f.aslContractEndDate.value,'yyyy-MM-dd')
    
  });
  //this.productForm.patchValue(this.productForm.value);
  console.log(this.f.ibnrPercentage.errors);
  console.log(this.f.defferedFeePercentage.errors);
  
  this.listContractClaims=[];
  
  for(let i=0; i<this.f.sslCoveredClaims.value.length; i++){
    this.listContractClaims.push({
      productid: this.uProductId,
      claimtypecode: this.f.sslCoveredClaims.value[i],
      sltype: 'S'
    })
  }
  for(let i=0; i<this.f.aslCoveredClaims.value.length; i++){
    this.listContractClaims.push({
      productid: this.uProductId,
      claimtypecode: this.f.aslCoveredClaims.value[i],
      sltype: 'A'
    })
  }
 console.log(this.listContractClaims);
 this.productForm.patchValue({
  sslDeductible: this.decimalValue(this.f.sslDeductible.value),
  lstContractClaims: this.listContractClaims
 })
 console.log(this.productForm.value);
 
    if(!this.toSwitchOtherScreen){
      this.productService.updateProduct(this.productForm.value)
          .pipe(first())
          .subscribe({
              next: () => {
                
                  this.getAllProducts();
                 // this.openCustomModal(false,null);                     
                   // this.productForm.reset();   
                    
                    this.clearErrorMessages();
                    
                  this.alertService.success('Product updated', { 
                    keepAfterRouteChange: true });
                    this.isDisabled=true;
                    this.f.clientId.disable();
                    this.f.contractId.disable();
                 // this.router.navigate(['../../'], { relativeTo: this.route });                    
              },
              error: error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
          });
        }
  }


  }
 

