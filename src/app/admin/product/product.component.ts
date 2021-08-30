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
import { LoaderService } from '../services/loader.service';
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
  uContractPeriod: string;
  claimBasis : string[];
  toSwitchOtherScreen: boolean=false;
  sslClaimBasisErr = {isValid: false,errMsg:''};
  aslClaimBasisErr = {isValid: false,errMsg:''};

  format = '2.2-2';
  isViewModal: boolean;
  sslIncurredEndErr = {isDateErr: false, dateErrMsg: ''};
  sslPaidEndErr = {isDateErr: false, dateErrMsg: ''};
  contractIds:number;
  tempProductObj: IClientObj;
  aslIncurredEndErr = {isDateErr: false, dateErrMsg: ''};
  sslSPecificErr={isDateErr:false, dateErrMsg:''};  
  aslAggregateErr = {isDateErr: false, dateErrMsg: ''}; 
  aslPaidEndErr = {isDateErr: false, dateErrMsg: '' };
  sslTermCovrErr = {isDateErr: false, dateErrMsg: ''};
  aslTermCovrErr = {isDateErr: false, dateErrMsg: ''};
  sslDeductibleErr = {isValid: false, errMsg : ''}
  sslExInStartEndDateErr={ isDateErr: false, dateErrMsg:''}
  sslExInStartDateErr={isDateErr: false, dateErrMsg:''}
  sslExPaidStartEndDateErr={isDateErr: false, dateErrMsg:''}
  sslExPaidStartDateErr= {isDateErr: false, dateErrMsg:''}
  duplicateContractErr={flag:false, message:''}
  isDisabled:boolean=false;
  isEditSelected: boolean = false;
  searchInputValue: string='';
  sharedContractID: number;
  contractPeroidErr={flag:false, message:''};
  isAddContractPeriod: boolean = false;
  // contractAddStatus: boolean;
  // contractUpdateStatus: boolean;
  // productAddStatus: boolean;
  // productUpdateStatus: boolean;
  // planAddStatus: boolean;
  // planUpdateStatus: boolean;
  
  isAdded: boolean;
  planObj:IClientObj;
  isAdmin: boolean;
  updateStatus: boolean;
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
    public loaderService: LoaderService,
    private decimalPipe: DecimalPipe)
    {
   }
   

  ngOnInit() {  
    this.initProductForm();
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
  initProductForm(){
    
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
      sslRunInLimit:'',
      sslDeductible: ['', Validators.required],
      sslAggDeductible:'',
      sslAnnualLimit:'',
      sslLifetimeLimit:'',
      sslPartcipantLimit:'',//(VE 1-08-2021 starts)

      sslIsImmediateReimbursement:false,
      sslTermCoverageExtEndDate:'',
      sslCoveredClaims: ['', Validators.required],
      sslLasering: false,

      sslExclusionIncurredStartDate:[''],
      sslExclusionIncurredEndDate:[''],
      sslExclusionPaidStartDate:[''],
      sslExclusionPaidEndDate:[''],
      
    sslPharmContractLimit: [''],
    sslPharmParticipantLimit: [''],
    aslPharmClaimsLimit: [''],

      //below from aslDeductible to aslExpecteddClaimLiability are number fields
      //aslDeductible:'',
      aslMinDeductible:['', Validators.required],
      aslExpectedClaimLiability:'',

      aslIncurrredStartDate: ['', Validators.required],
      aslIncurredEndDate: ['', Validators.required],
      
      aslContractStartDate: [''],
      aslContractEndDate: [''],
      aslCorridor:[''],

      aslPaidStartDate:['', Validators.required],
      aslPaidEndDate:['', Validators.required],
      // below aslRunInLimit is a number field
      aslRunInLimit:'',
      aslClaimBasis:['', Validators.required],

      aslAnnualLimit:'',  // this is a number field
      aslLifeTimeLimit:'', // this is a number field

      aslIsMonthlyAccomidation:false,
      aslTermCoverageExtEndDate:'',
      aslCoveredClaims: ['', Validators.required],
      


      isMaxLiability:false,
      ibnrPercentage:[''], // this is a number field
      defferedFeePercentage:[''], // this is a number field

      status:false,
      userId: this.loginService.currentUserValue.name,
      lstContractClaims: [],
      contractPeriod: ['', Validators.required]

    });
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
    if(this.f.isMaxLiability.value){
      this.f.ibnrPercentage.setValidators([Validators.required]);
      this.f.ibnrPercentage.updateValueAndValidity(); 
      this.f.defferedFeePercentage.setValidators([Validators.required]);
      this.f.defferedFeePercentage.updateValueAndValidity(); 
    }
    else{
      this.f.ibnrPercentage.clearValidators();
      this.f.ibnrPercentage.updateValueAndValidity(); 
      this.f.defferedFeePercentage.clearValidators();
      this.f.defferedFeePercentage.updateValueAndValidity(); 
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
 
  doFilter(filterValue){ //added by Venkatesh Enigonda
    this.dataSource.filter=filterValue;
    // this.dataSource.filterPredicate = (data:IProductAll, filter: string) => {
    //   const Id=data.contractId.toString();
    //   const CompareData=data.clientName.toLowerCase() ||  '';
    //   const CompareData1=Id||'';
    //   const CompareData2=data.aslClaimBasis.toLowerCase() ||'';
    //   return CompareData.indexOf(filter)!==-1 || CompareData1.indexOf(filter)!==-1 || CompareData2.indexOf(filter)!==-1 || ;
    // };

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
    this.sslExInStartEndDateErr.isDateErr=false;
    this.sslExInStartEndDateErr.dateErrMsg='';
    this.sslExInStartDateErr.isDateErr=false;
    this.sslExInStartDateErr.dateErrMsg='';
    this.sslExPaidStartEndDateErr.isDateErr=false;
    this.sslExPaidStartEndDateErr.dateErrMsg='';
    this.sslExPaidStartDateErr.isDateErr=false;
    this.sslExPaidStartDateErr.dateErrMsg='';
    this.duplicateContractErr.flag=false;
    this.duplicateContractErr.message='';
    this.contractPeroidErr={flag:false, message:''};
    this.isAddContractPeriod=false;
    if(this.isAddMode)
        this.productForm.patchValue({isMaxLiability:false})
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
   if(this.duplicateContractErr.flag) return;
   if( this.f.sslClaimBasis.value.length < 5 ) // starts here added by Venkatesh Enigonda
   {
    this.sslClaimBasisErr.isValid=true;
    this.sslClaimBasisErr.errMsg='In-Valid Format in Specific ClaimBasis';
    return;
   }
   if(this.contractPeroidErr.flag) return;
   if(this.isAddContractPeriod){
     this.isAddMode = true;
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
// venkatesh exclusion code start 
if(this.f.sslExclusionIncurredStartDate.value !=null && this.f.sslExclusionIncurredStartDate.value !='' && this.f.sslExclusionIncurredEndDate.value!=null && this.f.sslExclusionIncurredEndDate.value!=''){ 
  if(this.f.sslExclusionIncurredStartDate.value == this.f.sslExclusionIncurredEndDate.value)
  {
    this.sslExInStartEndDateErr.isDateErr=true;
    this.sslExInStartEndDateErr.dateErrMsg="SSL Exclusion Incurred start date should not be equal to SSL Exclusion Incurred End date"
    return;
  }
  if(this.f.sslExclusionIncurredStartDate.value > this.f.sslExclusionIncurredEndDate.value)
  {
    this.sslExInStartDateErr.isDateErr=true;
    this.sslExInStartDateErr.dateErrMsg="SSL Exclusion Incurred start date should not be greaterthan SSL Exclusion Incurred End date"
    return;
  }
   
  }
  if(this.f.sslExclusionPaidStartDate.value !=null && this.f.sslExclusionPaidStartDate.value !='' && this.f.sslExclusionPaidEndDate.value!=null && this.f.sslExclusionPaidEndDate.value!=''){ 
    if(this.f.sslExclusionPaidStartDate.value == this.f.sslExclusionPaidEndDate.value)
    {
      this.sslExPaidStartEndDateErr.isDateErr=true;
      this.sslExPaidStartEndDateErr.dateErrMsg="SSL Exclusion Paid start date should not be equal to SSL Exclusion paid End date"
      return;
    }
    if(this.f.sslExclusionPaidStartDate.value > this.f.sslExclusionPaidEndDate.value)
    {
      this.sslExPaidStartDateErr.isDateErr=true;
      this.sslExPaidStartDateErr.dateErrMsg="SSL Exclusion Paid start date should not be greaterthan SSL Exclusion paid End date"
      return;  
    }
    
    }
  // exclusion code ends

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
    this.checkMaxLiability();
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100);
    this.submitted = false;
    this.loading = false;
    this.isDisabled=false;
    this.f.clientId.enable();
    this.f.contractId.enable();
    if(open && id==null){
      this.initProductForm();
      this.isAddMode = true;    
      
      this.isEditSelected = false;
      this.isFilterOn=false;
      this.isViewModal=false;
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
      this.uContractId=id;
      this.uContractPeriod='Year 1';
      this.getProductByContractPeriod(this.uContractPeriod);
      this.f.clientId.disable();
      this.f.contractId.disable();
      this.getAllProducts();

      if(this.isAddMode){
        this.productForm.enable();
      }
      if(!this.isAddMode){
        this.productForm.enable();
        this.f.clientId.disable();
        this.f.contractId.disable();
      }
      if(this.isViewModal){
        this.productForm.disable();
      }
    }
  }

      
      getProductByContractPeriod(contractPeriod:string){
        debugger;
        if(!this.isAddMode){
          this.productService.getProductByContractPeriod(this.uContractId,contractPeriod).subscribe((res)=>{
            debugger;
           // this.productForm.patchValue(res);
           if(res.length==0 && contractPeriod=='Year 1'){
             debugger;
             this.clearSSLSection();
             this.uProductId=0;             
           }
           else if(res.length==0 && contractPeriod=='Year 2'){
             debugger;
            this.clearSSLSection();   
           }
           else if(res.length>0 && contractPeriod=='Year 1'){
            debugger;
            this.patchSSL(res);
            this.updateStatus = false;   
            debugger;
            debugger;
           }
           else if(res.length>0 && contractPeriod=="Year 2"){
            debugger;
            this.patchSSL(res);
            this.updateStatus = true;
            debugger;
           }
          });
        }
      }
      clearSSLSection(){
        this.productForm.patchValue({
          sslClaimBasis: '',
          sslIncurredStartDate: '',
          sslIncurredEndDate: '',
          sslPaidStartDate: '',
          sslPaidEndDate: '',
          sslRunInLimit: '',
          sslDeductible: '',
          sslAggDeductible: '',
          sslAnnualLimit: '',
          sslLifetimeLimit: '',
          sslPartcipantLimit: '',
          sslPharmContractLimit:'',    
          sslPharmParticipantLimit: '',
          sslTermCoverageExtEndDate: '',
          sslLasering: '',
          sslExclusionIncurredStartDate: '',
          sslExclusionIncurredEndDate: '',
          sslExclusionPaidStartDate:'',
          sslExclusionPaidEndDate:'',
          sslContractStartDate:'',
          sslContractEndDate: '',
          sslCoveredClaims: ''
        });
      }
      patchSSL(x){
        console.log(x[0].contractPeriod);
        console.log(x[0].contractId);
        console.log(this.contractsByClientId.length);
        console.log(x[0].clientName);
        debugger;
        this.productForm.patchValue({
        productId:x[0].productId,
        contractId:x[0].contractId,
        clientId:x[0].clientId,
          
        sslIncurredStartDate: this.dateValueString(x[0].sslIncurredStartDate),
        sslIncurredEndDate: this.dateValueString(x[0].sslIncurredEndDate),
        sslContractStartDate:this.dateValueString(x[0].sslContractStartDate),
        sslContractEndDate: this.dateValueString(x[0].sslContractEndDate),
        sslPaidStartDate:this.dateValueString(x[0].sslPaidStartDate),
        sslPaidEndDate:this.dateValueString(x[0].sslPaidEndDate),
        sslRunInLimit:this.numberValueString(x[0].sslRunInLimit),

        sslClaimBasis:x[0].sslClaimBasis,

        sslDeductible:this.numberValueString(x[0].sslDeductible),
        sslAggDeductible:this.numberValueString(x[0].sslAggDeductible),
        sslAnnualLimit: this.numberValueString(x[0].sslAnnualLimit),
        sslLifetimeLimit: this.numberValueString(x[0].sslLifetimeLimit),
        sslPartcipantLimit: this.numberValueString(x[0].sslPartcipantLimit),
        sslPharmContractLimit: this.numberValueString(x[0].sslPharmContractLimit),                
        sslPharmParticipantLimit:this.numberValueString(x[0].sslPharmParticipantLimit),
        sslIsImmediateReimbursement:x[0].sslIsImmediateReimbursement,
        sslTermCoverageExtEndDate:this.dateValueString(x[0].sslTermCoverageExtEndDate),
        sslLasering: x[0].sslLasering,
        sslExclusionIncurredStartDate: this.dateValueString(x[0].sslExclusionIncurredStartDate),
        sslExclusionIncurredEndDate:this.dateValueString(x[0].sslExclusionIncurredEndDate),
        sslExclusionPaidStartDate:this.dateValueString(x[0].sslExclusionPaidStartDate),
        sslExclusionPaidEndDate:this.dateValueString(x[0].sslExclusionPaidEndDate),
        
        aslMinDeductible:this.numberValueString(x[0].aslMinDeductible),
        aslExpectedClaimLiability:this.numberValueString(x[0].aslExpectedClaimLiability),
        aslIncurrredStartDate:this.dateValueString(x[0].aslIncurrredStartDate),
        aslIncurredEndDate: this.dateValueString(x[0].aslIncurredEndDate),
        aslContractStartDate:this.dateValueString(x[0].aslContractStartDate),
        aslContractEndDate:this.dateValueString(x[0].aslContractEndDate),
        aslCorridor: this.numberValueString(x[0].aslCorridor),
        aslPaidStartDate:this.dateValueString(x[0].aslPaidStartDate),
        aslPaidEndDate:this.dateValueString(x[0].aslPaidEndDate),
        aslRunInLimit:this.numberValueString(x[0].aslRunInLimit),
        aslClaimBasis:x[0].aslClaimBasis,
        aslAnnualLimit:this.numberValueString(x[0].aslAnnualLimit),
        aslLifeTimeLimit:this.numberValueString(x[0].aslLifeTimeLimit),
        aslPharmClaimsLimit:this.numberValueString(x[0].aslPharmClaimsLimit),
        aslIsMonthlyAccomidation:x[0].aslIsMonthlyAccomidation,
        aslTermCoverageExtEndDate:this.dateValueString(x[0].aslTermCoverageExtEndDate),
        isMaxLiability:x[0].isMaxLiability,
        ibnrPercentage:this.numberValueString(x[0].ibnrPercentage),
        defferedFeePercentage:this.numberValueString(x[0].defferedFeePercentage),
        status:x[0].status, 
        userId: this.loginService.currentUserValue.name,
        contractPeriod: (x[0].contractPeriod==null ||  x[0].contractPeriod==undefined)?"Year 1": x[0].contractPeriod
      });
      console.log(this.productForm.value);
      debugger;
      }

      checkDuplicateContract(contractId){       
        if(contractId=='' || contractId==null){
          this.duplicateContractErr.flag=true;
          this.duplicateContractErr.message="Contract ID should not be empty. Choose a contract ID";
        }
        else{
          this.productService.checkDuplicateContract(Number(contractId)).subscribe((res)=>{
            if(res==0){
              this.duplicateContractErr.flag=true;
              this.duplicateContractErr.message="Contract ID already exists. Choose different one";
            }
            if(res==1){
              this.duplicateContractErr.flag=false;
              this.duplicateContractErr.message='';
            }
          });
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
    dateValueString(dateVal){
      if(dateVal==null) dateVal='';
      else dateVal=this.datePipe.transform(dateVal, 'yyyy-MM-dd');
      console.log(dateVal);
      return dateVal;
    }
    dateValue(dateVal){
      if(dateVal=='') dateVal=null;
      else dateVal=this.datePipe.transform(dateVal, 'yyyy-MM-dd');
      console.log(dateVal);
      return dateVal;
    }
    decimalValueString(inputValue){
      let a;
      if(inputValue==0 || inputValue==null) a='';
      else a= this.decimalPipe.transform(inputValue,this.format).replace(/,/g, ""); 
      console.log(a);      
      return a;
    }
    decimalValue(inputValue:number){      
      if(inputValue==0 || inputValue==null) inputValue=0;
      else{
         let kk=this.decimalPipe.transform(inputValue,this.format);        
        inputValue= Number(this.decimalPipe.transform(inputValue,this.format).replace(/,/g, ""));        
        //inputValue= Number(this.decimalPipe.transform(inputValue,this.format).replace(',', "")); 
        //inputValue= Number(this.decimalPipe.transform(inputValue, this.format).replace(/\D,/g, ""));
      }
      console.log(inputValue);      
      return inputValue;
    }     
numberValueString(numValue){
  if(numValue==null || numValue==0){
    numValue='';    
  }
  else{
    numValue=this.decimalValueString(numValue);
  }
  return numValue;
}
numberValue(numValue){
  if(numValue==null || numValue==''){
    numValue=0;    
  }
  else{
    numValue=this.decimalValue(numValue);
  }
  return numValue;
}
patchProductForm(){
  this.productForm.patchValue({
    productId: 0,
    contractId: this.sharedContractID>0?this.sharedContractID:Number(this.f.contractId.value),
    status:this.f.status.value==true?1:1,
    //clientId: string;
    sslClaimBasis: this.f.sslClaimBasis.value,
    sslIncurredStartDate:this.dateValue(this.f.sslIncurredStartDate.value),
    sslIncurredEndDate: this.dateValue(this.f.sslIncurredEndDate.value),
    sslPaidStartDate: this.dateValue(this.f.sslPaidStartDate.value),
    sslPaidEndDate: this.dateValue(this.f.sslPaidEndDate.value),
    sslRunInLimit: this.numberValue(this.f.sslRunInLimit.value),
    sslDeductible: this.numberValue(this.f.sslDeductible.value),
    sslAggDeductible: this.numberValue(this.f.sslAggDeductible.value),
    sslAnnualLimit: this.numberValue(this.f.sslAnnualLimit.value),
    sslLifetimeLimit: this.numberValue(this.f.sslLifetimeLimit.value),
    sslPartcipantLimit:this.numberValue(this.f.sslPartcipantLimit.value),//(VE 1-08-2021 starts)
    sslPharmContractLimit:this.numberValue(this.f.sslPharmContractLimit.value),    
    sslPharmParticipantLimit:this.numberValue(this.f.sslPharmParticipantLimit.value),
    sslTermCoverageExtEndDate: this.dateValue(this.f.sslTermCoverageExtEndDate.value),
    //sslIsImmediateReimbursement: boolean;
    sslLasering: this.f.sslLasering.value==false?false:true,
    sslExclusionIncurredStartDate: this.dateValue(this.f.sslExclusionIncurredStartDate.value),
    sslExclusionIncurredEndDate: this.dateValue(this.f.sslExclusionIncurredEndDate.value),
    sslExclusionPaidStartDate:this.dateValue(this.f.sslExclusionPaidStartDate.value),
    sslExclusionPaidEndDate:this.dateValue(this.f.sslExclusionPaidEndDate.value),
    aslClaimBasis: this.f.aslClaimBasis.value,
    //aslDeductible:0, // not using currently

    aslMinDeductible: this.numberValue(this.f.aslMinDeductible.value),
    aslExpectedClaimLiability:this.numberValue(this.f.aslExpectedClaimLiability.value),
    aslIncurrredStartDate: this.dateValue(this.f.aslIncurrredStartDate.value),
    aslIncurredEndDate: this.dateValue(this.f.aslIncurredEndDate.value),
	  aslContractStartDate:this.dateValue(this.f.aslContractStartDate.value),
    aslContractEndDate: this.dateValue(this.f.aslContractEndDate.value),
    aslPaidStartDate: this.dateValue(this.f.aslPaidStartDate.value),
    aslPaidEndDate: this.dateValue(this.f.aslPaidEndDate.value),
    aslRunInLimit: this.numberValue(this.f.aslRunInLimit.value),
    aslAnnualLimit: this.numberValue(this.f.aslAnnualLimit.value),
    aslLifeTimeLimit: this.numberValue(this.f.aslLifeTimeLimit.value),
    aslPharmClaimsLimit: this.numberValue(this.f.aslPharmClaimsLimit.value),
    //aslIsMonthlyAccomidation: boolean;
    aslTermCoverageExtEndDate: this.dateValue(this.f.aslTermCoverageExtEndDate.value),
	  aslCorridor:this.numberValue(this.f.aslCorridor.value),
   // isMaxLiability: boolean;
    ibnrPercentage:this.numberValue(this.f.ibnrPercentage.value),
    defferedFeePercentage: this.numberValue(this.f.defferedFeePercentage.value),
    sslContractStartDate:this.dateValue(this.f.sslContractStartDate.value),
    sslContractEndDate: this.dateValue(this.f.sslContractEndDate.value),
    userId: this.loginService.currentUserValue.name,
    sslCoveredClaims: this.f.sslCoveredClaims.value,
    aslCoveredClaims: this.f.aslCoveredClaims.value,
    contractPeriod: this.f.contractPeriod.value
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
 debugger;
  this.productService.addProduct(this.productForm.value)
      .pipe(first())
      .subscribe({ 
          next: () => {
            debugger;
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
  

    this.patchProductForm();
    this.f.clientId.enable();
    this.f.contractId.enable();
    this.productForm.patchValue({  
    clientId: this.f.clientId.value,
    contractId: this.sharedContractID>0?this.sharedContractID:this.f.contractId.value,  
    status:this.f.status.value==true?1:0,
    
    //sslIncurredStartDate:this.dateValue(this.f.sslIncurredStartDate.value),

    // aslTermCoverageExtEndDate:this.dateValue(this.f.aslTermCoverageExtEndDate.value),
    // sslTermCoverageExtEndDate: this.dateValue(this.f.sslTermCoverageExtEndDate.value),
    // sslContractStartDate:this.dateValue(this.f.sslContractStartDate.value),
    // sslContractEndDate:this.dateValue(this.f.sslContractEndDate.value),
    // aslContractStartDate:this.dateValue(this.f.aslContractStartDate.value),
    // aslContractEndDate:this.dateValue(this.f.aslContractEndDate.value),
    // sslExclusionIncurredStartDate:this.dateValue(this.f.sslExclusionIncurredStartDate.value),
    // sslExclusionIncurredEndDate:this.dateValue(this.f.sslExclusionIncurredEndDate.value),
    // sslExclusionPaidStartDate:this.dateValue(this.f.sslExclusionPaidStartDate.value),
    // sslExclusionPaidEndDate:this.dateValue(this.f.sslExclusionPaidEndDate.value),
    
  });
  //this.productForm.patchValue(this.productForm.value);
  
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
  lstContractClaims: this.listContractClaims
 })
 console.log(this.productForm.value);
 
    if(!this.toSwitchOtherScreen){
      
    this.productForm.patchValue({
      productId: this.uProductId
    })
    
      this.productService.updateProduct(this.productForm.value)
          .pipe(first())
          .subscribe({
              next: () => {
                
                  this.getAllProducts();
                //  this.productForm.setValue(this.productForm.value);
                  
                 // this.openCustomModal(false,null);                     
                   // this.productForm.reset();                       
                  
                    this.getProductByContractPeriod(this.uContractPeriod);
                    this.f.clientId.disable();
                    this.f.contractId.disable();
                    
                  this.alertService.success('Product updated', { 
                    keepAfterRouteChange: true });
                    this.isDisabled=true;
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
 

