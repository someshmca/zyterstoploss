import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';
import { IProductAll, IProductAdd,
  IProductUpdate,IActiveClient
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
import { asLiteral } from '@angular/compiler/src/render3/view/util';
import { ContractService } from '../services/contract.service';
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
  products:IProductAll[] = [];
  activeClients: IActiveClient[]=[];
  contractsByClientId: IContractsByClient[] = [];
  displayedColumns: string[] = ['clientName','contractId', 'claimBasis','productId'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  coveredBenefits: any[] = [];
  //isClientSelected:boolean = false;
  // sslForm: FormGroup;
  // aslForm: FormGroup;
  // maxLiabilityForm: FormGroup;
  // isOptional = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private clientService: ClientsService,
    private contractService: ContractService,
    private alertService: AlertService,
    private datePipe: DatePipe,
    private loginService: LoginService)
    {
   }
   

  ngOnInit(): void {  

    this.productForm = this.formBuilder.group({
      productId: 0,
      contractId:['', Validators.required],
      clientId:['', Validators.required],    
      sslIncurredStartDate:['', Validators.required],
      sslIncurredEndDate:['', Validators.required],
      sslPaidStartDate:['', Validators.required],
      sslPaidEndDate:['', Validators.required],
      sslRunInLimit:"",
      sslClaimBasis:['', Validators.required],
      sslDeductible:"",
      sslAggDeductible:"",
      sslAnnualLimit:"",
      sslLifetimeLimit:"",
      sslIsImmediateReimbursement:"",
      sslTermCoverageExtEndDate:"",
      //sslCoveredBenefit: ['', Validators.required],
      aslDeductible:"",
      aslMinDeductible:['', Validators.required],
      aslExpectedClaimLiability:"",
      aslIncurrredStartDate:['', Validators.required],
      aslIncurredEndDate:['', Validators.required],
      aslPaidStartDate:['', Validators.required],
      aslPaidEndDate:['', Validators.required],
      aslRunInLimit:"",
      aslClaimBasis:['', Validators.required],
      aslAnnualLimit:"",
      aslLifeTimeLimit:"",
      aslIsMonthlyAccomidation:"",
      aslTermCoverageExtEndDate:"",
      //aslCoveredBenefit: ['', Validators.required],
      isMaxLiability:false,
      ibnrPercentage:"",
      defferedFeePercentage:"",
      status:"",
      userId: ''
    });
    this.getAllProducts();
    this.getActiveClients();   
    this.getCoveredClaims();
    //this.isClientSelected = false;
  }

  get f() { return this.productForm.controls; }

  getActiveClients(){
    
    this.productService.getAllClients().subscribe(
      (data)=>{
        
        this.activeClients = data;
      }
    )
  }
  getCoveredClaims(){
    this.productService.getCoveredClaims().subscribe((data)=>{
        this.coveredBenefits = data;
    })
  }
  getContractIDs(clientId){
    clientId = Number(clientId);
    this.contractService.getContractsByClientID(clientId).subscribe((data)=>{
      this.contractsByClientId = data;
      //this.isClientSelected = true;
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
  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
   if (this.productForm.invalid) {
     return;
   }
   this.loading = true;
      if (this.isAddMode) {
          this.addProduct();
      } else {
          this.updateProduct();          
      }
    
}
  isMaxLiabilityChecked: boolean = false;

  openCustomModal(open: boolean, id:any) {    
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100);
    this.submitted = false;
    this.loading = false;
    if(open && id==null){
      this.isAddMode = true; 
      
      this.productForm.get('isMaxLiability').valueChanges.subscribe(v => {
        if (v) {
            console.log(this.isMaxLiabilityChecked);
            this.isMaxLiabilityChecked = true;
        } else {
          console.log(this.isMaxLiabilityChecked);
          this.isMaxLiabilityChecked = false;
        }
      })
    }
    
   
    this.isCustomModalOpen = open;
    if (!open && id==null) {
      this.getAllProducts();
      this.productForm.reset();
      this.isAddMode = false;
      this.isMaxLiabilityChecked = false;
    }
    console.log("id inside modal: "+id);
    
    if(id!=null && open){
      this.isAddMode = false;
      this.isMaxLiabilityChecked = this.productForm.get('isMaxLiability').value;
      this.productService.getProduct(id.productId).subscribe(x => {        
        console.log(x[0].productId);
            this.productForm.patchValue({
              productId:x[0].productId,
              contractId:x[0].contractId,
              clientId:x[0].clientId,
              sslIncurredStartDate:this.datePipe.transform(new Date(x[0].sslIncurredStartDate), 'yyyy-MM-dd'),
              sslIncurredEndDate:this.datePipe.transform(new Date(x[0].sslIncurredEndDate), 'yyyy-MM-dd'),
              sslPaidStartDate:this.datePipe.transform(new Date(x[0].sslPaidStartDate), 'yyyy-MM-dd'),
              sslPaidEndDate:this.datePipe.transform(new Date(x[0].sslPaidEndDate), 'yyyy-MM-dd'),
              sslRunInLimit:x[0].sslRunInLimit,
              sslClaimBasis:x[0].aslClaimBasis,
              sslDeductible:x[0].aslDeductible,
              sslAggDeductible:x[0].sslAggDeductible,
              sslAnnualLimit:x[0].sslAnnualLimit,
              sslLifetimeLimit:x[0].sslLifetimeLimit,
              sslIsImmediateReimbursement:x[0].sslIsImmediateReimbursement,
              sslTermCoverageExtEndDate:this.datePipe.transform(new Date(x[0].sslTermCoverageExtEndDate), 'yyyy-MM-dd'),
              aslDeductible:x[0].aslDeductible,
              aslMinDeductible:x[0].aslMinDeductible,
              aslExpectedClaimLiability:x[0].aslExpectedClaimLiability,
              aslIncurredStartDate:this.datePipe.transform(new Date(x[0].aslIncurrredStartDate), 'yyyy-MM-dd'),
              aslIncurredEndDate:this.datePipe.transform(new Date(x[0].aslIncurredEndDate), 'yyyy-MM-dd'),
              aslPaidStartDate:this.datePipe.transform(new Date(x[0].aslPaidStartDate), 'yyyy-MM-dd'),
              aslPaidEndDate:this.datePipe.transform(new Date(x[0].aslPaidEndDate), 'yyyy-MM-dd'),
              aslRunInLimit:x[0].aslRunInLimit,
              aslClaimBasis:x[0].aslClaimBasis,
              aslAnnualLimit:x[0].aslAnnualLimit,
              aslLifeTimeLimit:x[0].aslLifeTimeLimit,
              aslIsMonthlyAccomidation:x[0].aslIsMonthlyAccomidation,
              aslTermCoverageExtEndDate:this.datePipe.transform(new Date(x[0].aslTermCoverageExtEndDate), 'yyyy-MM-dd'),
              isMaxLiability:x[0].isMaxLiability,
              ibnrPercentage:x[0].ibnrPercentage,
              defferedFeePercentage:x[0].defferedFeePercentage,
              status:x[0].status, 
              userId: this.loginService.currentUserValue.name     
            });
          });
         }
      }

      

private addProduct() {    
  this.productForm.patchValue({
    status: this.productForm.get('status').value?1:0,
    userId: this.loginService.currentUserValue.name
  });
  console.log(this.productForm.value);
  
  this.productService.addProduct(this.productForm.value)
      .pipe(first())
      .subscribe({
          next: () => {
            
            this.openCustomModal(false, null);
            this.getAllProducts();
            
            this.productForm.reset();                
              this.alertService.success('New Product added', { keepAfterRouteChange: true });
              //this.router.navigate(['../'], { relativeTo: this.route });
          },
          error: error => {
              this.alertService.error(error);
              this.loading = false;
          }
      });
      
  }

  private updateProduct() {   
      this.productService.updateProduct(this.productForm.value)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.getAllProducts();
                  
                  this.openCustomModal(false,null); 
                  this.productForm.reset();
                  this.alertService.success('Product updated', { 
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
 

