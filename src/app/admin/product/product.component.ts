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
  listContractClaimsYear2: IListContractClaims[] = []; 
  contractIDsAll: any[] = [];
  addObj:IProductAdd[]=[];
  updateObj: IProductUpdate[]=[];
  year1Obj:IProductAdd;
  year2Obj:IProductAdd;
  uProductId: number;
  uClientId: string;
  uContractId: number;  
  uProductIdYear2:number;
  uClientIdYear2: string;
  uContractIdYear2:number;
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
  // y2 year2 fields init
  y2sslClaimBasisErr = {isValid: false,errMsg:''};
  y2sslDeductibleErr = {isValid: false, errMsg : ''}
  y2sslTermCovrErr = {isDateErr: false, dateErrMsg: ''};
  y2sslSPecificErr={isDateErr:false, dateErrMsg:''};
  y2sslIncurredEndErr = {isDateErr: false, dateErrMsg: ''};
  y2sslPaidEndErr = {isDateErr: false, dateErrMsg: ''};
  y2sslExInStartEndDateErr={ isDateErr: false, dateErrMsg:''}
  y2sslExInStartDateErr={isDateErr: false, dateErrMsg:''}
  y2sslExPaidStartEndDateErr={isDateErr: false, dateErrMsg:''}
  y2sslExPaidStartDateErr= {isDateErr: false, dateErrMsg:''}

  duplicateContractErr={flag:false, message:''}
  isDisabled:boolean=false;
  isEditSelected: boolean = false;
  searchInputValue: string='';
  sharedContractID: number;
  contractPeroidErr={flag:false, message:''};
  isAddContractPeriod: boolean = false;
  year2checked: boolean=true;
  contractPeriodLabel:string='';
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
  year1Added:boolean=false;
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
    this.year2checked=true;
  }
  checkYear2Selected(){
    console.log(this.f.contractPeriod.value);
    
    if(this.f.isContractPeriod.value){
      this.productForm.patchValue({contractPeriod: 'Year 2'});
      this.f.y2sslClaimBasis.enable();  
      this.f.y2sslIncurredStartDate.enable();
      this.f.y2sslIncurredEndDate.enable();
      this.f.y2sslContractStartDate.enable();
      this.f.y2sslContractEndDate.enable();
      this.f.y2sslPaidStartDate.enable();
      this.f.y2sslPaidEndDate.enable();
      this.f.y2sslRunInLimit.enable();
      this.f.y2sslDeductible.enable();
      this.f.y2sslAggDeductible.enable();
      this.f.y2sslAnnualLimit.enable();
      this.f.y2sslLifetimeLimit.enable();
      this.f.y2sslPartcipantLimit.enable();
      this.f.y2sslIsImmediateReimbursement.enable();
      this.f.y2sslTermCoverageExtEndDate.enable();
      this.f.y2sslCoveredClaims.enable();
      this.f.y2sslLasering.enable();
      this.f.y2sslExclusionIncurredStartDate.enable();
      this.f.y2sslExclusionIncurredEndDate.enable();
      this.f.y2sslExclusionPaidStartDate.enable();
      this.f.y2sslExclusionPaidEndDate.enable();
      this.f.y2sslPharmContractLimit.enable();
      this.f.y2sslPharmParticipantLimit.enable();
      this.f.y2aslPharmClaimsLimit.enable();

      
      this.f.y2sslClaimBasis.setValidators([Validators.required]);
      this.f.y2sslClaimBasis.updateValueAndValidity(); 

      this.f.y2sslIncurredStartDate.setValidators([Validators.required]);
      this.f.y2sslIncurredStartDate.updateValueAndValidity(); 
      this.f.y2sslIncurredEndDate.setValidators([Validators.required]);
      this.f.y2sslIncurredEndDate.updateValueAndValidity(); 
      this.f.y2sslPaidStartDate.setValidators([Validators.required]);
      this.f.y2sslPaidStartDate.updateValueAndValidity(); 
      this.f.y2sslPaidEndDate.setValidators([Validators.required]);
      this.f.y2sslPaidEndDate.updateValueAndValidity(); 
      
      this.f.y2sslDeductible.setValidators([Validators.required]);
      this.f.y2sslDeductible.updateValueAndValidity(); 
      
      this.f.y2sslCoveredClaims.setValidators([Validators.required]);
      this.f.y2sslCoveredClaims.updateValueAndValidity(); 
      
    }
    else{
      if(!this.f.isContractPeriod.value){
        this.productForm.patchValue({contractPeriod: 'Year 1'});
        this.disableYear2SSL();
      } 
    }
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
      sslRunInLimit:'', //number
      sslDeductible: ['', Validators.required], //number
      sslAggDeductible:'', //number
      sslAnnualLimit:'', //number
      sslLifetimeLimit:'', //number
      sslPartcipantLimit:'',
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
      
              
      y2sslClaimBasis: [''],     
      y2sslIncurredStartDate: [''],
      y2sslIncurredEndDate: [''],
      y2sslContractStartDate:[''],
      y2sslContractEndDate: [''],
      y2sslPaidStartDate: [''],
      y2sslPaidEndDate: [''],
      y2sslRunInLimit:'', //number
      y2sslDeductible: [''], //number
      y2sslAggDeductible:'', //number
      y2sslAnnualLimit:'', //number
      y2sslLifetimeLimit:'', //number
      y2sslPartcipantLimit:'',
      y2sslIsImmediateReimbursement:false,
      y2sslTermCoverageExtEndDate:'',
      y2sslCoveredClaims: [''],
      y2sslLasering: false,
      y2sslExclusionIncurredStartDate:[''],
      y2sslExclusionIncurredEndDate:[''],
      y2sslExclusionPaidStartDate:[''],
      y2sslExclusionPaidEndDate:[''],      
      y2sslPharmContractLimit: [''],
      y2sslPharmParticipantLimit: [''],
      y2aslPharmClaimsLimit: [''],

      aslMinDeductible:['', Validators.required],  // number
      aslExpectedClaimLiability:'',  // number
      aslIncurrredStartDate: ['', Validators.required],
      aslIncurredEndDate: ['', Validators.required],      
      aslContractStartDate: [''],
      aslContractEndDate: [''],
      aslCorridor:[''],
      aslPaidStartDate:['', Validators.required],
      aslPaidEndDate:['', Validators.required],
      aslRunInLimit:'',  // number field
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
      isContractPeriod:[false],
      contractPeriod: ['Year 1']

    });
    this.disableYear2SSL();
   
  }
  disableYear2SSL(){
    this.f.y2sslClaimBasis.disable();  
    this.f.y2sslIncurredStartDate.disable();
    this.f.y2sslIncurredEndDate.disable();
    this.f.y2sslContractStartDate.disable();
    this.f.y2sslContractEndDate.disable();
    this.f.y2sslPaidStartDate.disable();
    this.f.y2sslPaidEndDate.disable();
    this.f.y2sslRunInLimit.disable();
    this.f.y2sslDeductible.disable();
    this.f.y2sslAggDeductible.disable();
    this.f.y2sslAnnualLimit.disable();
    this.f.y2sslLifetimeLimit.disable();
    this.f.y2sslPartcipantLimit.disable();
    this.f.y2sslIsImmediateReimbursement.disable();
    this.f.y2sslTermCoverageExtEndDate.disable();
    this.f.y2sslCoveredClaims.disable();
    this.f.y2sslLasering.disable();
    this.f.y2sslExclusionIncurredStartDate.disable();
    this.f.y2sslExclusionIncurredEndDate.disable();
    this.f.y2sslExclusionPaidStartDate.disable();
    this.f.y2sslExclusionPaidEndDate.disable();
    this.f.y2sslPharmContractLimit.disable();
    this.f.y2sslPharmParticipantLimit.disable();
    this.f.y2aslPharmClaimsLimit.disable();
    this.f.y2sslClaimBasis.setValidators([Validators.required]);
      this.f.y2sslClaimBasis.updateValueAndValidity(); 

      this.f.y2sslIncurredStartDate.clearValidators();
      this.f.y2sslIncurredStartDate.updateValueAndValidity(); 
      this.f.y2sslIncurredEndDate.clearValidators();
      this.f.y2sslIncurredEndDate.updateValueAndValidity(); 
      this.f.y2sslPaidStartDate.clearValidators();
      this.f.y2sslPaidStartDate.updateValueAndValidity(); 
      this.f.y2sslPaidEndDate.clearValidators();
      this.f.y2sslPaidEndDate.updateValueAndValidity(); 
      
      this.f.y2sslDeductible.clearValidators();
      this.f.y2sslDeductible.updateValueAndValidity(); 
      
      this.f.y2sslCoveredClaims.clearValidators();
      this.f.y2sslCoveredClaims.updateValueAndValidity(); 
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
     // this.productForm.patchValue({isMaxLiability: true });
      this.f.ibnrPercentage.setValidators([Validators.required]);
      this.f.ibnrPercentage.updateValueAndValidity(); 
      this.f.defferedFeePercentage.setValidators([Validators.required]);
      this.f.defferedFeePercentage.updateValueAndValidity(); 
    }
    else{
     // this.productForm.patchValue({isMaxLiability: false });
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
    this.year1Added=false;
    if(this.isAddMode)
        this.productForm.patchValue({isMaxLiability:false});
    
    // y2 
    this.y2sslSPecificErr.isDateErr=false;
    this.y2sslSPecificErr.dateErrMsg='';
    this.y2sslDeductibleErr.isValid=false;
    this.y2sslDeductibleErr.errMsg='';
    this.y2sslClaimBasisErr.isValid=false;
    this.y2sslClaimBasisErr.errMsg='';
    this.y2sslTermCovrErr.isDateErr=false;
    this.y2sslTermCovrErr.dateErrMsg='';  
    this.y2sslIncurredEndErr.isDateErr=false;
    this.y2sslIncurredEndErr.dateErrMsg='';
    this.y2sslPaidEndErr.isDateErr=false;
    this.y2sslPaidEndErr.dateErrMsg='';
    this.sslExInStartEndDateErr.isDateErr=false;
    this.y2sslExInStartEndDateErr.dateErrMsg='';
    this.y2sslExInStartDateErr.isDateErr=false;
    this.y2sslExInStartDateErr.dateErrMsg='';
    this.y2sslExPaidStartEndDateErr.isDateErr=false;
    this.y2sslExPaidStartEndDateErr.dateErrMsg='';
    this.y2sslExPaidStartDateErr.isDateErr=false;
    this.y2sslExPaidStartDateErr.dateErrMsg='';
    
  }
 
  onSubmit() {
    this.submitted = true;
    this.alertService.clear();
    let y2sslTermVal=this.f.y2sslTermCoverageExtEndDate.value;
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
    this.sslClaimBasisErr.errMsg='Year 1 In-Valid Format in Specific ClaimBasis';
    return;
   }
   if(this.contractPeroidErr.flag) return;
   if(this.isAddContractPeriod){
     this.isAddMode = true;
   }
  
   if(this.f.sslClaimBasis.value.charAt(2)!='/')
   {  
     this.sslClaimBasisErr.isValid=true;
     this.sslClaimBasisErr.errMsg='Year 1 In-Valid Format in Specific ClaimBasis';
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
    this.sslIncurredEndErr.dateErrMsg = 'Year 1 SSL Incurred start date should not be greater than SSL Incurred End date';
    
    return;
  }
  
  // Starts here added by Venkatesh Enigonda
  if(this.productForm.valid && this.f.sslIncurredStartDate.value == this.f.sslIncurredEndDate.value){
 
    this.sslIncurredEndErr.isDateErr=true;
    this.sslIncurredEndErr.dateErrMsg = 'Year 1 SSL Incurred start date should not be Equal to SSL Incurred End date';
    
    return;
  }//Ends here
  if(this.productForm.valid && this.f.sslPaidStartDate.value > this.f.sslPaidEndDate.value){
   this.sslPaidEndErr.isDateErr=true;
   this.sslPaidEndErr.dateErrMsg = 'Year 1 SSL Paid Start date should not be greater than SSL Paid End date';
   
   return;
 }
//Starts here added by Venkatesh Enigonda
if(this.productForm.valid && this.f.sslPaidStartDate.value == this.f.sslPaidEndDate.value){
 
  this.sslPaidEndErr.isDateErr=true;
  this.sslPaidEndErr.dateErrMsg ='Year 1 SSL Paid Start date should not be Equal to SSL Paid End date';
    
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
  this.sslPaidEndErr.dateErrMsg ='Year 1 SSL Paid Start date should not be Equal to SSL Paid End date';
  
  return;
}
if(this.f.sslContractStartDate.value !=null && this.f.sslContractStartDate.value !='' && this.f.sslContractEndDate.value!=null && this.f.sslContractEndDate.value!=''){  
  if(this.f.sslContractStartDate.value == this.f.sslContractEndDate.value){  
    this.sslSPecificErr.isDateErr=true;
    this.sslSPecificErr.dateErrMsg ='Year 1 SSL Specific Start date should not be Equal to SSL Specific End date' ;    
    return;
  }
  if(this.f.sslContractStartDate.value == this.f.sslContractEndDate.value){
    this.sslSPecificErr.isDateErr=true;
    this.sslSPecificErr.dateErrMsg ='Year 1 SSL Specific Start date should not be Equal to SSL Specific End date' ;    
    return;
  }
}
if((this.f.sslContractStartDate.value ==null || this.f.sslContractStartDate.value =='') && this.f.sslContractEndDate.value!=null && this.f.sslContractEndDate.value!=''){  
  this.sslSPecificErr.isDateErr=true;
  this.sslSPecificErr.dateErrMsg ='Year 1 SSL Specific Start date is not valid' ;    
  return;

}
if(this.f.sslContractStartDate.value !=null && this.f.sslContractStartDate.value !='' && (this.f.sslContractEndDate.value==null || this.f.sslContractEndDate.value=='')){  
  this.sslSPecificErr.isDateErr=true;
  this.sslSPecificErr.dateErrMsg ='Year 1 SSL Specific End date is not valid' ;    
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
    this.aslAggregateErr.dateErrMsg ='Aggregate Start date should not be greater than Aggregate End date ';
    
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
  this.sslDeductibleErr.errMsg="Year 1 SSL Deductible value should be greater than 0";
  return;
}
if(this.productForm.valid && this.f.sslDeductible.value==''){
  this.sslDeductibleErr.isValid=true;
  this.sslDeductibleErr.errMsg="Year 1 SSL Deductible is not valid";
  return;
}
console.log(this.f.sslTermCoverageExtEndDate.value );
console.log(this.f.sslTermCoverageExtEndDate.valid);

let sslTermVal=this.f.sslTermCoverageExtEndDate.value;

if(sslTermVal!='' && this.productForm.valid){
  
  if(this.f.sslTermCoverageExtEndDate.value <= this.f.sslIncurredEndDate.value){
    this.sslTermCovrErr.isDateErr=true;
    
    this.sslTermCovrErr.dateErrMsg = 'Year 1 SSL Term Coverage Date should be greater than SSL Incurred End Date';  
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
    this.sslExInStartEndDateErr.dateErrMsg="Year 1 SSL Exclusion Incurred start date should not be equal to SSL Exclusion Incurred End date"
    return;
  }
  if(this.f.sslExclusionIncurredStartDate.value > this.f.sslExclusionIncurredEndDate.value)
  {
    this.sslExInStartDateErr.isDateErr=true;
    this.sslExInStartDateErr.dateErrMsg="Year 1 SSL Exclusion Incurred start date should not be greaterthan SSL Exclusion Incurred End date"
    return;
  }
   
  }
  if(this.f.sslExclusionPaidStartDate.value !=null && this.f.sslExclusionPaidStartDate.value !='' && this.f.sslExclusionPaidEndDate.value!=null && this.f.sslExclusionPaidEndDate.value!=''){ 
    if(this.f.sslExclusionPaidStartDate.value == this.f.sslExclusionPaidEndDate.value)
    {
      this.sslExPaidStartEndDateErr.isDateErr=true;
      this.sslExPaidStartEndDateErr.dateErrMsg="Year 1 SSL Exclusion Paid start date should not be equal to SSL Exclusion paid End date"
      return;
    }
    if(this.f.sslExclusionPaidStartDate.value > this.f.sslExclusionPaidEndDate.value)
    {
      this.sslExPaidStartDateErr.isDateErr=true;
      this.sslExPaidStartDateErr.dateErrMsg="Year 1 SSL Exclusion Paid start date should not be greaterthan SSL Exclusion paid End date"
      return;  
    }
    
    }
  // exclusion code ends
  // y2 starts 
    if(this.f.isContractPeriod.value){
      if( this.f.y2sslClaimBasis.value.length < 5 ) // starts here added by Venkatesh Enigonda
      {
       this.y2sslClaimBasisErr.isValid=true;
       this.y2sslClaimBasisErr.errMsg='In-Valid Format in Year 2 Specific ClaimBasis';
       return;
      }
       if(this.f.y2sslClaimBasis.value.charAt(2)!='/')   {​​​​​       this.y2sslClaimBasisErr.isValid=true;     this.y2sslClaimBasisErr.errMsg='In-Valid Format in Year 2 Specific ClaimBasis';     return;   }​​​​​
      
       if(this.productForm.valid && this.f.y2sslIncurredStartDate.value > this.f.y2sslIncurredEndDate.value){​​​​​    this.y2sslIncurredEndErr.isDateErr=true;    this.y2sslIncurredEndErr.dateErrMsg = ' Year 2 SSL Incurred start date should not be greater than SSL Incurred End date';        return;  }​​​​​
      
       if(this.productForm.valid && this.f.y2sslIncurredStartDate.value == this.f.y2sslIncurredEndDate.value){​​​​​     this.y2sslIncurredEndErr.isDateErr=true;    this.y2sslIncurredEndErr.dateErrMsg = ' Year 2 SSL Incurred start date should not be Equal to SSL Incurred End date';        return;  }​​​​​
      
      if(this.productForm.valid && this.f.y2sslPaidStartDate.value > this.f.y2sslPaidEndDate.value){​​​​​  
        this.y2sslPaidEndErr.isDateErr=true;  this.y2sslPaidEndErr.dateErrMsg = 'Year 2 SSL Paid Start date should not be greater than SSL Paid End date';    return;}​​​​​
      
      if(this.productForm.valid && this.f.y2sslPaidStartDate.value == this.f.y2sslPaidEndDate.value){​​​​​   this.y2sslPaidEndErr.isDateErr=true;  this.y2sslPaidEndErr.dateErrMsg ='Year 2 SSL Paid Start date should not be Equal to SSL Paid End date';      return;}​​​​​
      
      if(this.f.y2sslContractStartDate.value !=null && this.f.y2sslContractStartDate.value !='' && this.f.y2sslContractEndDate.value!=null && this.f.y2sslContractEndDate.value!=''){​​​​​    
        
        if(this.f.y2sslContractStartDate.value > this.f.y2sslContractEndDate.value){​​​​​      
          this.y2sslSPecificErr.isDateErr=true;    
          this.y2sslSPecificErr.dateErrMsg =' Year 2 SSL Specific Start date should not be greater than to SSL Specific End date' ;        return;  }​​​​​  
      
      if(this.f.y2sslContractStartDate.value == this.f.y2sslContractEndDate.value){​​​​​    this.y2sslSPecificErr.isDateErr=true;    this.y2sslSPecificErr.dateErrMsg =' Year 2 SSL Specific Start date should not be Equal to SSL Specific End date' ;        return;  }​​​​​}​​​​​
      
      if((this.f.y2sslContractStartDate.value ==null || this.f.y2sslContractStartDate.value =='') && this.f.y2sslContractEndDate.value!=null && this.f.y2sslContractEndDate.value!=''){​​​​​    this.y2sslSPecificErr.isDateErr=true;  this.y2sslSPecificErr.dateErrMsg ='Year 2 SSL Specific Start date is not valid' ;      return;}​​​​​if(this.f.y2sslContractStartDate.value !=null && this.f.y2sslContractStartDate.value !='' && (this.f.y2sslContractEndDate.value==null || this.f.y2sslContractEndDate.value=='')){​​​​​    this.y2sslSPecificErr.isDateErr=true;  this.y2sslSPecificErr.dateErrMsg ='Year 2 SSL Specific End date is not valid' ;      return;}​​​​​
      
      if(this.productForm.valid && Number(this.f.y2sslDeductible.value)<=0){​​​​​  this.y2sslDeductibleErr.isValid=true;  this.y2sslDeductibleErr.errMsg="Year 2 SSL Deductible value should be greater than 0";  return;}​​​​​if(this.productForm.valid && this.f.y2sslDeductible.value==''){​​​​​  this.y2sslDeductibleErr.isValid=true;  this.y2sslDeductibleErr.errMsg="Year 2 SSL Deductible is not valid";  return;}​​​​​
      
      
      if(y2sslTermVal!='' && this.productForm.valid){​​​​​    if(this.f.y2sslTermCoverageExtEndDate.value <= this.f.y2sslIncurredEndDate.value){​​​​​    this.y2sslTermCovrErr.isDateErr=true;        this.y2sslTermCovrErr.dateErrMsg = 'Year 2 SSL Term Coverage Date should be greater than SSL Incurred End Date';      return;  }​​​​​}​​​​​
      
          if(this.f.y2sslExclusionIncurredStartDate.value !=null && this.f.y2sslExclusionIncurredStartDate.value !='' && this.f.y2sslExclusionIncurredEndDate.value!=null && this.f.y2sslExclusionIncurredEndDate.value!=''){​​​​​   if(this.f.y2sslExclusionIncurredStartDate.value == this.f.y2sslExclusionIncurredEndDate.value)  {​​​​​    this.y2sslExInStartEndDateErr.isDateErr=true;    this.y2sslExInStartEndDateErr.dateErrMsg="Year 2 SSL Exclusion Incurred start date should not be equal to SSL Exclusion Incurred End date";    return;  }​​​​​  if(this.f.y2sslExclusionIncurredStartDate.value > this.f.y2sslExclusionIncurredEndDate.value)  {​​​​​    this.y2sslExInStartDateErr.isDateErr=true;    this.y2sslExInStartDateErr.dateErrMsg="Year 2 SSL Exclusion Incurred start date should not be greaterthan SSL Exclusion Incurred End date";    return;  }​​​​​     }​​​​​  if(this.f.y2sslExclusionPaidStartDate.value !=null && this.f.y2sslExclusionPaidStartDate.value !='' && this.f.y2sslExclusionPaidEndDate.value!=null && this.f.y2sslExclusionPaidEndDate.value!=''){​​​​​     if(this.f.y2sslExclusionPaidStartDate.value == this.f.y2sslExclusionPaidEndDate.value)    {​​​​​      this.y2sslExPaidStartEndDateErr.isDateErr=true;      this.y2sslExPaidStartEndDateErr.dateErrMsg="Year 2 SSL Exclusion Paid start date should not be equal to SSL Exclusion paid End date";      return;    }​​​​​    if(this.f.y2sslExclusionPaidStartDate.value > this.f.y2sslExclusionPaidEndDate.value)    {​​​​​      this.y2sslExPaidStartDateErr.isDateErr=true;      this.y2sslExPaidStartDateErr.dateErrMsg="Year 2 SSL Exclusion Paid start date should not be greaterthan SSL Exclusion paid End date";      return;      }​​​​​        }

    }​​​​​
    // y2 ends
  
  

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
    this.f.clientId.enable();
    this.f.contractId.enable();
    if(open && id==null){
      this.initProductForm();
      this.isAddMode = true;    
      this.productForm.patchValue({isContractPeriod:false}); 
      this.productForm.patchValue({isMaxLiability: false });  
      this.checkMaxLiability();   
      this.checkYear2Selected();
      this.contractPeriodLabel = 'Year 1';
      
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
      this.contractPeriodLabel = '';
      this.productForm.patchValue({isContractPeriod:false}); 
      this.productForm.patchValue({isMaxLiability: false }); 
      this.checkMaxLiability();   
      this.checkYear2Selected();
      this.ngOnInit();
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
      
     // this.uContractPeriod='Year 1';
      
      this.getProductByContractPeriod(this.uContractId);
      
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

      
      getProductByContractPeriod(contractId:number){
        
        if(!this.isAddMode){
          this.productService.getProductByContractPeriod(contractId).subscribe((res)=>{
            
            console.log(res.length);
            this.fetchProduct(res[0]);            
            if(res.length == 1){
              this.uProductIdYear2=0;
              this.productForm.patchValue({isContractPeriod:false});      
              this.checkYear2Selected();
            }
            if(res.length>1){
              this.productForm.patchValue({isContractPeriod: true})
              
              this.fetchYear2SSL(res[1]);
              
              
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
      initYear2SSL(){
        this.productForm.patchValue({  
        })
      }

      checkDuplicateContract(contractId){       
        if(contractId=='' || contractId==null){
          this.duplicateContractErr.flag=true;
          this.duplicateContractErr.message="Contract ID should not be empty. Choose a contract ID";
        }
        else{
          this.productService.checkDuplicateContract(Number(contractId)).subscribe((res)=>{
            if(res==0){
              this.duplicateContractErr.flag=false;
              this.duplicateContractErr.message='';
            }
            if(res>0){
              this.duplicateContractErr.flag=true;
              this.duplicateContractErr.message="Contract ID already exists. Choose different one";
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
    sslPartcipantLimit:this.numberValue(this.f.sslPartcipantLimit.value),
    sslPharmContractLimit:this.numberValue(this.f.sslPharmContractLimit.value),    
    sslPharmParticipantLimit:this.numberValue(this.f.sslPharmParticipantLimit.value),
    sslTermCoverageExtEndDate: this.dateValue(this.f.sslTermCoverageExtEndDate.value),
    sslLasering: this.f.sslLasering.value==false?false:true,
    sslExclusionIncurredStartDate: this.dateValue(this.f.sslExclusionIncurredStartDate.value),
    sslExclusionIncurredEndDate: this.dateValue(this.f.sslExclusionIncurredEndDate.value),
    sslExclusionPaidStartDate:this.dateValue(this.f.sslExclusionPaidStartDate.value),
    sslExclusionPaidEndDate:this.dateValue(this.f.sslExclusionPaidEndDate.value),
    aslClaimBasis: this.f.aslClaimBasis.value,

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
    contractPeriod: 'Year 1'
  });

  
  this.listContractClaims=[];
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
  
 this.productForm.patchValue({
  clientId: this.f.clientId.value,
  contractId: this.sharedContractID>0?this.sharedContractID:this.f.contractId.value,  
  lstContractClaims: this.listContractClaims
 })
   
}
callYear1Obj(){
  this.listContractClaims=[];
  if(this.isAddMode){
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
  }
  if(!this.isAddMode){
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
  }
  this.year1Obj = {
    productId: 0,
    clientId: this.f.clientId.value,
    contractId: this.sharedContractID>0?this.sharedContractID:Number(this.f.contractId.value),
    status:this.f.status.value==true?1:1,

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
    sslPartcipantLimit:this.numberValue(this.f.sslPartcipantLimit.value),
    sslPharmContractLimit:this.numberValue(this.f.sslPharmContractLimit.value),    
    sslPharmParticipantLimit:this.numberValue(this.f.sslPharmParticipantLimit.value),
    sslTermCoverageExtEndDate: this.dateValue(this.f.sslTermCoverageExtEndDate.value),
    sslLasering: this.f.sslLasering.value==false?false:true,
    sslExclusionIncurredStartDate: this.dateValue(this.f.sslExclusionIncurredStartDate.value),
    sslExclusionIncurredEndDate: this.dateValue(this.f.sslExclusionIncurredEndDate.value),
    sslExclusionPaidStartDate:this.dateValue(this.f.sslExclusionPaidStartDate.value),
    sslExclusionPaidEndDate:this.dateValue(this.f.sslExclusionPaidEndDate.value),
    sslIsImmediateReimbursement:this.f.sslIsImmediateReimbursement.value,    

    aslClaimBasis: this.f.aslClaimBasis.value,
    //aslDeductible: this.numberValue(this.f.aslDeductible.value),
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
    aslIsMonthlyAccomidation: this.f.aslIsMonthlyAccomidation.value,
    aslTermCoverageExtEndDate: this.dateValue(this.f.aslTermCoverageExtEndDate.value),
    aslCorridor:this.numberValue(this.f.aslCorridor.value),
    isMaxLiability: this.f.isMaxLiability.value,
    ibnrPercentage:this.numberValue(this.f.ibnrPercentage.value),
    defferedFeePercentage: this.numberValue(this.f.defferedFeePercentage.value),
    sslContractStartDate:this.dateValue(this.f.sslContractStartDate.value),
    sslContractEndDate: this.dateValue(this.f.sslContractEndDate.value),
    userId: this.loginService.currentUserValue.name, 
    lstContractClaims: this.listContractClaims,    
    contractPeriod: 'Year 1'
  }
  if(!this.isAddMode){
    this.year1Obj.productId = this.uProductId;
  }
  console.log(this.year1Obj);
  
}
//  ---------- call year 2 obj function starts ----------------------- 

callYear2Obj(){

  this.listContractClaimsYear2=[];
  if(this.isAddMode){
    for(let i=0; i<this.f.y2sslCoveredClaims.value.length; i++){
      this.listContractClaimsYear2.push({
        productid: 0,
        claimtypecode: this.f.y2sslCoveredClaims.value[i],
        sltype: 'S'
      })
    }
  }
  if(!this.isAddMode){
    for(let i=0; i<this.f.y2sslCoveredClaims.value.length; i++){
      this.listContractClaimsYear2.push({
        productid: this.uProductIdYear2,
        claimtypecode: this.f.y2sslCoveredClaims.value[i],
        sltype: 'S'
      })
    }    
  }
  
  this.year2Obj = {
    productId: 0,
    clientId: this.year1Obj.clientId,
    contractId: this.year1Obj.contractId,
    status: this.year1Obj.status,
    
    sslClaimBasis: this.f.y2sslClaimBasis.value,
    sslIncurredStartDate:this.dateValue(this.f.y2sslIncurredStartDate.value),
    sslIncurredEndDate: this.dateValue(this.f.y2sslIncurredEndDate.value),
    sslPaidStartDate: this.dateValue(this.f.y2sslPaidStartDate.value),
    sslPaidEndDate: this.dateValue(this.f.y2sslPaidEndDate.value),
    sslRunInLimit: this.numberValue(this.f.y2sslRunInLimit.value),
    sslDeductible: this.numberValue(this.f.y2sslDeductible.value),
    sslAggDeductible: this.numberValue(this.f.y2sslAggDeductible.value),
    sslAnnualLimit: this.numberValue(this.f.y2sslAnnualLimit.value),
    sslLifetimeLimit: this.numberValue(this.f.y2sslLifetimeLimit.value),
    sslPartcipantLimit:this.numberValue(this.f.y2sslPartcipantLimit.value),
    sslPharmContractLimit:this.numberValue(this.f.y2sslPharmContractLimit.value),    
    sslPharmParticipantLimit:this.numberValue(this.f.y2sslPharmParticipantLimit.value),
    sslTermCoverageExtEndDate: this.dateValue(this.f.y2sslTermCoverageExtEndDate.value),
    sslLasering: this.f.y2sslLasering.value==false?false:true,
    sslExclusionIncurredStartDate: this.dateValue(this.f.y2sslExclusionIncurredStartDate.value),
    sslExclusionIncurredEndDate: this.dateValue(this.f.y2sslExclusionIncurredEndDate.value),
    sslExclusionPaidStartDate:this.dateValue(this.f.y2sslExclusionPaidStartDate.value),
    sslExclusionPaidEndDate:this.dateValue(this.f.y2sslExclusionPaidEndDate.value),
    sslIsImmediateReimbursement:this.f.y2sslIsImmediateReimbursement.value,  
    sslContractStartDate:this.dateValue(this.f.y2sslContractStartDate.value),
    sslContractEndDate: this.dateValue(this.f.y2sslContractEndDate.value),  

    aslClaimBasis: this.year1Obj.aslClaimBasis,
    //aslDeductible: this.year1Obj.aslDeductible,
    aslMinDeductible: this.year1Obj.aslMinDeductible,
    aslExpectedClaimLiability:this.year1Obj.aslExpectedClaimLiability,
    aslIncurrredStartDate: this.year1Obj.aslIncurrredStartDate,
    aslIncurredEndDate: this.year1Obj.aslIncurredEndDate,
    aslContractStartDate:this.year1Obj.aslContractStartDate,
    aslContractEndDate: this.year1Obj.aslContractEndDate,
    aslPaidStartDate: this.year1Obj.aslPaidStartDate,
    aslPaidEndDate: this.year1Obj.aslPaidEndDate,
    aslRunInLimit: this.year1Obj.aslRunInLimit,
    aslAnnualLimit: this.year1Obj.aslAnnualLimit,
    aslLifeTimeLimit: this.year1Obj.aslLifeTimeLimit,
    aslPharmClaimsLimit: this.year1Obj.aslPharmClaimsLimit,
    aslIsMonthlyAccomidation: this.year1Obj.aslIsMonthlyAccomidation,
    aslTermCoverageExtEndDate: this.year1Obj.aslTermCoverageExtEndDate,
    aslCorridor:this.year1Obj.aslCorridor,
    isMaxLiability: this.year1Obj.isMaxLiability,
    ibnrPercentage:this.year1Obj.ibnrPercentage,
    defferedFeePercentage: this.year1Obj.defferedFeePercentage,
    userId: this.year1Obj.userId,
    contractPeriod: 'Year 2',
    lstContractClaims: this.listContractClaimsYear2
  }
  if(!this.isAddMode){
    this.year2Obj.productId=this.uProductIdYear2;
  }
  
}

fetchProduct(x){
  this.contractPeriodLabel = x.contractPeriod;
  if(x.contractPeriod == "Year 1" || x.contractPeriod=="Year 2"){
    
    console.log(x.productId);
    console.log(x.contractId);
    console.log(this.contractsByClientId.length);
    console.log(x.clientName);
    this.uProductId=x.productId;
    this.uContractId = x.contractId;
    

    this.getContractIDs(x.clientId);

    console.log(x.listContractClaims);
    
    //this.listContractClaims=[];

    let aslCc=[];
    let sslCc=[];
    for(let i=0; i<x.lstContractClaims.length; i++){
      if(x.lstContractClaims[i].sltype=='A'){
        aslCc.push(x.lstContractClaims[i].claimtypecode);
      }
      if(x.lstContractClaims[i].sltype=='S'){
        sslCc.push(x.lstContractClaims[i].claimtypecode);
      }
    }  
    // for(let i=0; i<x.aslCoveredClaims.length; i++){
    //   this.listContractClaims.push({
    //     productid: this.uProductId,
    //     claimtypecode: x.aslCoveredClaims.value[i],
    //     sltype: 'A'
    //   })
    // }  
    this.productForm.patchValue({
    productId:x.productId,
    contractId:x.contractId,
    clientId:x.clientId,
      
    sslIncurredStartDate: this.dateValueString(x.sslIncurredStartDate),
    sslIncurredEndDate: this.dateValueString(x.sslIncurredEndDate),
    sslContractStartDate:this.dateValueString(x.sslContractStartDate),
    sslContractEndDate: this.dateValueString(x.sslContractEndDate),
    sslPaidStartDate:this.dateValueString(x.sslPaidStartDate),
    sslPaidEndDate:this.dateValueString(x.sslPaidEndDate),
    sslRunInLimit:this.numberValueString(x.sslRunInLimit),
  
    sslClaimBasis:x.sslClaimBasis,
  
    sslDeductible:this.numberValueString(x.sslDeductible),
    sslAggDeductible:this.numberValueString(x.sslAggDeductible),
    sslAnnualLimit: this.numberValueString(x.sslAnnualLimit),
    sslLifetimeLimit: this.numberValueString(x.sslLifetimeLimit),
    sslPartcipantLimit: this.numberValueString(x.sslPartcipantLimit),
    sslPharmContractLimit: this.numberValueString(x.sslPharmContractLimit),                
    sslPharmParticipantLimit:this.numberValueString(x.sslPharmParticipantLimit),
    sslIsImmediateReimbursement:x.sslIsImmediateReimbursement,
    sslTermCoverageExtEndDate:this.dateValueString(x.sslTermCoverageExtEndDate),
    sslLasering: x.sslLasering,
    sslExclusionIncurredStartDate: this.dateValueString(x.sslExclusionIncurredStartDate),
    sslExclusionIncurredEndDate:this.dateValueString(x.sslExclusionIncurredEndDate),
    sslExclusionPaidStartDate:this.dateValueString(x.sslExclusionPaidStartDate),
    sslExclusionPaidEndDate:this.dateValueString(x.sslExclusionPaidEndDate),
    sslCoveredClaims: sslCc,
    aslCoveredClaims: aslCc,
    
    aslMinDeductible:this.numberValueString(x.aslMinDeductible),
    aslExpectedClaimLiability:this.numberValueString(x.aslExpectedClaimLiability),
    aslIncurrredStartDate:this.dateValueString(x.aslIncurrredStartDate),
    aslIncurredEndDate: this.dateValueString(x.aslIncurredEndDate),
    aslContractStartDate:this.dateValueString(x.aslContractStartDate),
    aslContractEndDate:this.dateValueString(x.aslContractEndDate),
    aslCorridor: this.numberValueString(x.aslCorridor),
    aslPaidStartDate:this.dateValueString(x.aslPaidStartDate),
    aslPaidEndDate:this.dateValueString(x.aslPaidEndDate),
    aslRunInLimit:this.numberValueString(x.aslRunInLimit),
    aslClaimBasis:x.aslClaimBasis,
    aslAnnualLimit:this.numberValueString(x.aslAnnualLimit),
    aslLifeTimeLimit:this.numberValueString(x.aslLifeTimeLimit),
    aslPharmClaimsLimit:this.numberValueString(x.aslPharmClaimsLimit),
    aslIsMonthlyAccomidation:x.aslIsMonthlyAccomidation,
    aslTermCoverageExtEndDate:this.dateValueString(x.aslTermCoverageExtEndDate),
    isMaxLiability:x.isMaxLiability,
    ibnrPercentage:this.numberValueString(x.ibnrPercentage),
    defferedFeePercentage:this.numberValueString(x.defferedFeePercentage),
    status:x.status, 
    userId: this.loginService.currentUserValue.name,
    contractPeriod: x.contractPeriod,  
    lstContractClaims: x.listContractClaims
  });
  console.log(this.productForm.value);
  

  }
}
fetchYear2SSL(x){  
 // this.contractPeriodLabel = x.contractPeriod;
  if(x.contractPeriod == "Year 2"){
    
    this.uProductIdYear2=x.productId;
    this.uContractIdYear2 = x.contractId;
    this.uClientIdYear2 = x.clientId;
    
    this.listContractClaimsYear2=[];
    // for(let i=0; i<x.y2sslCoveredClaims.length; i++){
    //   this.listContractClaimsYear2.push({
    //     productid: this.uProductIdYear2,
    //     claimtypecode: x.sslCoveredClaims.value[i],
    //     sltype: 'S'
    //   })
    // }  
    
    //let aslCc=[];
    let sslCc=[];
    for(let i=0; i<x.lstContractClaims.length; i++){
      if(x.lstContractClaims[i].sltype=='S'){
        sslCc.push(x.lstContractClaims[i].claimtypecode);
      }
    }  
    console.log(this.productForm.value);
    
    this.productForm.patchValue({  
      productId:x.productId,
      contractId:x.contractId,
      clientId:x.clientId,        
        y2sslIncurredStartDate: this.dateValueString(x.sslIncurredStartDate),
        y2sslIncurredEndDate: this.dateValueString(x.sslIncurredEndDate),
        y2sslContractStartDate:this.dateValueString(x.sslContractStartDate),
        y2sslContractEndDate: this.dateValueString(x.sslContractEndDate),
        y2sslPaidStartDate:this.dateValueString(x.sslPaidStartDate),
        y2sslPaidEndDate:this.dateValueString(x.sslPaidEndDate),
        y2sslRunInLimit:this.numberValueString(x.sslRunInLimit),
  
        y2sslClaimBasis:x.sslClaimBasis,
  
        y2sslDeductible:this.numberValueString(x.sslDeductible),
        y2sslAggDeductible:this.numberValueString(x.sslAggDeductible),
        y2sslAnnualLimit: this.numberValueString(x.sslAnnualLimit),
        y2sslLifetimeLimit: this.numberValueString(x.sslLifetimeLimit),
        y2sslPartcipantLimit: this.numberValueString(x.sslPartcipantLimit),
        y2sslPharmContractLimit: this.numberValueString(x.sslPharmContractLimit),                
        y2sslPharmParticipantLimit:this.numberValueString(x.sslPharmParticipantLimit),
        y2sslIsImmediateReimbursement:x.sslIsImmediateReimbursement,
        y2sslTermCoverageExtEndDate:this.dateValueString(x.sslTermCoverageExtEndDate),
        y2sslLasering: x.sslLasering,
        y2sslExclusionIncurredStartDate: this.dateValueString(x.sslExclusionIncurredStartDate),
        y2sslExclusionIncurredEndDate:this.dateValueString(x.sslExclusionIncurredEndDate),
        y2sslExclusionPaidStartDate:this.dateValueString(x.sslExclusionPaidStartDate),
        y2sslExclusionPaidEndDate:this.dateValueString(x.sslExclusionPaidEndDate),
        y2sslCoveredClaims: sslCc
    });
    console.log(this.productForm.value);  
    
    
  }
}
// patchYear2SSL(){
//   this.productForm.patchValue({
//     sslClaimBasis: this.f.y2sslClaimBasis.value,
//     sslIncurredStartDate:this.dateValue(this.f.y2sslIncurredStartDate.value),
//     sslIncurredEndDate: this.dateValue(this.f.y2sslIncurredEndDate.value),
//     sslPaidStartDate: this.dateValue(this.f.y2sslPaidStartDate.value),
//     sslPaidEndDate: this.dateValue(this.f.y2sslPaidEndDate.value),
//     sslRunInLimit: this.numberValue(this.f.y2sslRunInLimit.value),
//     sslDeductible: this.numberValue(this.f.y2sslDeductible.value),
//     sslAggDeductible: this.numberValue(this.f.y2sslAggDeductible.value),
//     sslAnnualLimit: this.numberValue(this.f.y2sslAnnualLimit.value),
//     sslLifetimeLimit: this.numberValue(this.f.y2sslLifetimeLimit.value),
//     sslPartcipantLimit:this.numberValue(this.f.y2sslPartcipantLimit.value),
//     sslPharmContractLimit:this.numberValue(this.f.y2sslPharmContractLimit.value),    
//     sslPharmParticipantLimit:this.numberValue(this.f.y2sslPharmParticipantLimit.value),
//     sslTermCoverageExtEndDate: this.dateValue(this.f.y2sslTermCoverageExtEndDate.value),
//     sslLasering: this.f.y2sslLasering.value==false?false:true,
//     sslExclusionIncurredStartDate: this.dateValue(this.f.y2sslExclusionIncurredStartDate.value),
//     sslExclusionIncurredEndDate: this.dateValue(this.f.y2sslExclusionIncurredEndDate.value),
//     sslExclusionPaidStartDate:this.dateValue(this.f.y2sslExclusionPaidStartDate.value),
//     sslExclusionPaidEndDate:this.dateValue(this.f.y2sslExclusionPaidEndDate.value),
//     sslContractStartDate:this.dateValue(this.f.y2sslContractStartDate.value),
//     sslContractEndDate: this.dateValue(this.f.y2sslContractEndDate.value),
//     sslCoveredClaims: this.f.y2sslCoveredClaims.value,
//     contractPeriod: 'Year 2'
//   });
//   for(let i=0; i<this.f.y2sslCoveredClaims.value.length; i++){
//     this.listContractClaims.push({
//       productid: 0,
//       claimtypecode: this.f.y2sslCoveredClaims.value[i],
//       sltype: 'S'
//     })
//   }
//   this.productForm.patchValue({
//    lstContractClaims: this.listContractClaims
//   })
//   console.log(this.productForm.value);  
//   
// }
private addProduct() {   
  this.addObj=[];
  
  
  console.log(this.addObj.length);
  
 this.callYear1Obj();
  if(this.f.isContractPeriod.value){
    this.callYear2Obj();
    
  }
  console.log()
  this.addObj.push(this.year1Obj);
  if(this.f.isContractPeriod.value) this.addObj.push(this.year2Obj);
  console.log(this.addObj.length);
  
  this.productService.addProduct(this.addObj).pipe(first()).subscribe({ 
          next: () => {
            
            this.getAllProducts(); 
            this.clearErrorMessages();           
              this.alertService.success('Product Year added', { keepAfterRouteChange: true });   
              this.isAdded=true;
              this.year1Added=true;    
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
    this.updateObj=[];
    
    console.log(this.updateObj.length);
    
    this.callYear1Obj();
    if(this.f.isContractPeriod.value){
      this.callYear2Obj();
      
      
    }
    console.log()
    this.updateObj.push(this.year1Obj);
    if(this.f.isContractPeriod.value) this.updateObj.push(this.year2Obj);
    console.log(this.updateObj.length);
    
    
      this.productService.updateProduct(this.updateObj)
          .pipe(first())
          .subscribe({
              next: () => {
                
                  this.getAllProducts();
                //  this.productForm.setValue(this.productForm.value);
                  
                 // this.openCustomModal(false,null);                     
                   // this.productForm.reset();                       
                  
                   // this.getProductByContractPeriod(this.uContractPeriod);
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
 

