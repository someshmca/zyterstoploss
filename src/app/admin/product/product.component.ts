import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';
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
  // contractAddStatus: boolean;
  // contractUpdateStatus: boolean;
  // productAddStatus: boolean;
  // productUpdateStatus: boolean;
  // planAddStatus: boolean;
  // planUpdateStatus: boolean;
  isAdded: boolean;
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
    private navService: NavPopupService)
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
    this.claimBasis = CLAIM_BASIS_CONSTANT.values;
    this.getAllProducts();
    this.getActiveClients();   
    this.getCoveredClaims();
    //this.getAllContracts();
    //this.isClientSelected = false;
    this.checkMaxLiability(); 
    this.getProductStatus();
    // this.getContractAddStatus();
    // this.getContractUpdateStatus();

    //this.getProductUpdateStatus();    
  }
  getProductStatus(){
    this.navService.productObj.subscribe((data)=>{
      this.tempProductObj=data;
      
      if(data.isAdd){
        this.productForm.patchValue({
          clientId: data.clientId
        });
        this.getContractIDs(data.clientId);
        this.openCustomModal(true,null);
      }
      else if(data.isUpdate){          
        this.searchInputValue = data.clientName;
        
        setTimeout(()=>{
            this.filterSearchInput.nativeElement.focus();                  
         }, 1000);
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
      if(this.contractsByClientId.length>0){
        this.productForm.patchValue({
          contractId: this.contractsByClientId[0].contractId
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
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  
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
   
   if(this.productForm.valid && this.f.sslIncurredStartDate.value > this.f.sslIncurredEndDate.value){
    this.sslIncurredEndErr.isDateErr=true;
    this.sslIncurredEndErr.dateErrMsg = 'SSL Incurred start date should not be greater than SSL Incurred End date';
    
    return;
  }
  
  if(this.productForm.valid && this.f.sslPaidStartDate.value > this.f.sslPaidEndDate.value){
   this.sslPaidEndErr.isDateErr=true;
   this.sslPaidEndErr.dateErrMsg = 'SSL Paid Start date should not be greater than SSL Paid End date';
   
   return;
 }

 if(this.productForm.valid && this.f.aslIncurrredStartDate.value > this.f.aslIncurredEndDate.value){
  this.aslIncurredEndErr.isDateErr=true;
  this.aslIncurredEndErr.dateErrMsg = 'ASL Incurred start date should not be greater than ASL Incurred End date';
  
  return;
}

if(this.productForm.valid && this.f.aslPaidStartDate.value > this.f.aslPaidEndDate.value){
 this.aslPaidEndErr.isDateErr=true;
 this.aslPaidEndErr.dateErrMsg = 'ASL Paid Start date should not be greater than ASL Paid End date';
 
 return;
}
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
      if(!this.isFilterOn){
        this.navService.resetProductObj();
        this.filterSearchInput.nativeElement.value='';
        this.filterSearchInput.nativeElement.blur();
      }
    }
    console.log("id inside modal: "+id);
    
    if(id!=null && open){
      this.isAddMode = false;
      this.isEditSelected = true;

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
              sslContractStartDate:this.datePipe.transform(new Date(x[0].sslContractStartDate), 'yyyy-MM-dd'),
              sslContractEndDate:this.datePipe.transform(new Date(x[0].sslContractEndDate), 'yyyy-MM-dd'),
              sslPaidStartDate:this.datePipe.transform(new Date(x[0].sslPaidStartDate), 'yyyy-MM-dd'),
              sslPaidEndDate:this.datePipe.transform(new Date(x[0].sslPaidEndDate), 'yyyy-MM-dd'),
              sslRunInLimit:x[0].sslRunInLimit,
              sslClaimBasis:x[0].sslClaimBasis,
              sslDeductible:x[0].sslDeductible,
              sslAggDeductible:x[0].sslAggDeductible,
              sslAnnualLimit:x[0].sslAnnualLimit,
              sslLifetimeLimit:x[0].sslLifetimeLimit,
              sslIsImmediateReimbursement:x[0].sslIsImmediateReimbursement,
              sslTermCoverageExtEndDate:x[0].sslTermCoverageExtEndDate==null?"":this.datePipe.transform(new Date(x[0].sslTermCoverageExtEndDate), 'yyyy-MM-dd'),
              sslLasering: x[0].sslLasering,
              aslDeductible:0,
              aslMinDeductible:x[0].aslMinDeductible,
              aslExpectedClaimLiability:x[0].aslExpectedClaimLiability,
              aslIncurrredStartDate:this.datePipe.transform(new Date(x[0].aslIncurrredStartDate), 'yyyy-MM-dd'),
              aslIncurredEndDate:this.datePipe.transform(new Date(x[0].aslIncurredEndDate), 'yyyy-MM-dd'),
              aslContractStartDate:this.datePipe.transform(new Date(x[0].aslContractStartDate), 'yyyy-MM-dd'),
              aslContractEndDate:this.datePipe.transform(new Date(x[0].aslContractEndDate), 'yyyy-MM-dd'),
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
            })
          });
          


         }
      }
      clearSearchInput(){
        this.searchInputValue='';
        this.filterSearchInput.nativeElement.value='';
        this.filterSearchInput.nativeElement.focus();
      }
      goBackPreviousNoFilter(){
        this.router.navigate(['/contracts']);
        this.navService.resetContractObj();
      }
      goBackPreviousScreen(){  
        if(this.isAdded){
          this.openCustomModal(false,null);
          this.searchInputValue = this.tempProductObj.clientName;
          this.filterSearchInput.nativeElement.focus();
        }
        if(!this.isAdded){
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
      if(this.isAdded){
        this.clientService.getClient(this.f.clientId.value).subscribe((data)=>{
          this.navService.setPlanObj(data[0].clientId, data[0].clientName, true,false);
          
          this.router.navigate(['/health-plan']);
        });
      }
    }
    gotoPlanUpdate(){
      this.alertService.clear();
      this.clientService.getClient(this.f.clientId.value).subscribe(
        (data: IClient[]) => {                  
          this.navService.setPlanObj(data[0].clientId, data[0].clientName, false, true);
          this.isAdded = false;
          this.router.navigate(['/health-plan']);   
        });    
    }
    gotoLaseringAdd(){
      if(this.isAdded){
        this.clientService.getClient(this.f.clientId.value).subscribe((data)=>{
          this.navService.setLaseringObj(data[0].clientId, data[0].clientName, true,false);
          
          this.router.navigate(['/lasering']);
        });
      }
    }
    gotoLaseringUpdate(){
      this.clientService.getClient(this.f.clientId.value).subscribe(
        (data: IClient[]) => {                  
          this.navService.setLaseringObj(data[0].clientId, data[0].clientName, false, true);
          this.isAdded = false;
          this.router.navigate(['/lasering']);
        });
    }
      
patchProductForm(){
  this.productForm.patchValue({
    productId: 0,
    contractId: Number(this.f.contractId.value),
    status:this.f.status.value==true?1:1,
    aslIncurrredStartDate: this.f.aslIncurrredStartDate.value==""?null:this.datePipe.transform(this.f.aslIncurrredStartDate.value, 'yyyy-MM-dd'),
    aslIncurredEndDate: this.f.aslIncurredEndDate.value==""?null:this.datePipe.transform(this.f.aslIncurredEndDate.value, 'yyyy-MM-dd'),
	aslContractStartDate:this.f.aslContractStartDate.value==""?null:this.datePipe.transform(this.f.aslContractStartDate.value, 'yyyy-MM-dd'),
    aslContractEndDate: this.f.aslContractEndDate.value==""?null:this.datePipe.transform(this.f.aslContractEndDate.value, 'yyyy-MM-dd'),
    aslPaidStartDate: this.f.aslPaidStartDate.value==""?null:this.datePipe.transform(this.f.aslPaidStartDate.value, 'yyyy-MM-dd'),
    aslPaidEndDate: this.f.aslPaidEndDate.value==""?null:this.datePipe.transform(this.f.aslPaidEndDate.value, 'yyyy-MM-dd'),
    aslTermCoverageExtEndDate: this.f.aslTermCoverageExtEndDate.value==""?null:this.datePipe.transform(this.f.aslTermCoverageExtEndDate.value, 'yyyy-MM-dd'),
	aslCorridor: this.f.aslCorridor.value==''?Number(0):Number(this.f.aslCorridor.value),
    sslDeductible: this.f.sslDeductible.value==''?0:Number(this.f.sslDeductible.value),
    sslIncurredStartDate:this.f.sslIncurredStartDate.value==""?null:this.datePipe.transform(this.f.sslIncurredStartDate.value, 'yyyy-MM-dd'),
    sslIncurredEndDate: this.f.sslIncurredEndDate.value==""?null:this.datePipe.transform(this.f.sslIncurredEndDate.value, 'yyyy-MM-dd'),
		
	
    sslContractStartDate:this.f.sslContractStartDate.value==""?null:this.datePipe.transform(this.f.sslContractStartDate.value, 'yyyy-MM-dd'),
    sslContractEndDate: this.f.sslContractEndDate.value==""?null:this.datePipe.transform(this.f.sslContractEndDate.value, 'yyyy-MM-dd'),
	sslLasering: this.f.sslLasering.value==null?false:true,
	
    sslPaidStartDate: this.f.sslPaidStartDate.value==""?null:this.datePipe.transform(this.f.sslPaidStartDate.value, 'yyyy-MM-dd'),
    sslPaidEndDate: this.f.sslPaidEndDate.value==""?null:this.datePipe.transform(this.f.sslPaidEndDate.value, 'yyyy-MM-dd'),
    sslTermCoverageExtEndDate: this.f.sslTermCoverageExtEndDate.value==""?null:this.datePipe.transform(this.f.sslTermCoverageExtEndDate.value, 'yyyy-MM-dd'),
    aslDeductible:0,
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
  this.productForm.patchValue(this.productForm.value);
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
    status:this.f.status.value==true?1:0,
    aslTermCoverageExtEndDate: this.productForm.get('aslTermCoverageExtEndDate').value==""?null:this.datePipe.transform(this.f.aslTermCoverageExtEndDate.value, 'yyyy-MM-dd'),
    sslTermCoverageExtEndDate: this.productForm.get('sslTermCoverageExtEndDate').value==""?null:this.datePipe.transform(this.f.sslTermCoverageExtEndDate.value, 'yyyy-MM-dd')
  });
  this.productForm.patchValue(this.productForm.value);
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
  lstContractClaims: this.listContractClaims
 })
 
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
                 // this.router.navigate(['../../'], { relativeTo: this.route });                    
              },
              error: error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
          });
  }


  }
 

