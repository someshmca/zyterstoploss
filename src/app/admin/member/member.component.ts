import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { IMemberSearch, IMemberSearchResponse, IMemberAdd } from '../models/member-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IActiveClient } from '../models/clients-model';
import { IContract } from '../models/contracts-model';
import { IPlanAll, ITire } from '../models/health-plan.model';
import { MemberService } from '../services/member.service';
import { Paths } from '../admin-paths';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { first, max, retryWhen } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { DatePipe } from '@angular/common';
import { AlertService } from '../services/alert.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { from } from 'rxjs';
import { ClientsService } from '../services/clients.service';
import { ContractService } from '../services/contract.service';
import { HealthPlanService } from '../services/health-plan.service';
import { NavPopupService } from '../services/nav-popup.service';
import { LoaderService } from '../services/loader.service';//added by Venkatesh Enigonda
import { ExcelUploadService } from '../services/excel-upload.service';
import { ExcelService } from '../services/excel.service';
import { DecimalPipe } from '@angular/common'; //PV 08-05-2021
import { exit } from 'process';
import { LiteralPrimitive } from '@angular/compiler';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css'],
  providers: [DatePipe]
})
export class MemberComponent implements OnInit {
  memberSearchForm: FormGroup;
  searchResult: any;
  memberForm: FormGroup;
  searchErrorMessage: string;
  displayedColumns: string[] = ['memberHrid', 'clientName', 'contractId', 'planId', 'tierId', 'fname', 'lname', 'mname', 'gender', 'memberStartDate', 'memberEndDate', 'dateOfBirth', 'subscriberId', 'alternateId', 'laserValue', 'isUnlimited', 'tier', 'benefitPlanId', 'userId'];
  searchDataSource: any;


  uClientId: any;
  uContractId: any;
  uPlanId: any;
  uTierId: any;
  today: string;
   names = [];
   countMaxMin = 0;
   pageCount;
  isMemSearchFormInvalid: boolean = false;

  excel1;
  format = '2.2-2';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("focusElem") focusTag: ElementRef;
  @ViewChild("focusMemSearch") focusMSTag: ElementRef;

  isAddMode: boolean = false;
  loading = false;
  memSearchSubmitted = false;
  submitted = false;
  isCustomModalOpen: boolean = false;
  memSearchError: boolean = false;
  noSearchFieldEntered: boolean = false;

  activeClients: IActiveClient[] = [];
  activeContracts: IContract[] = [];
  plans: IPlanAll[] = [];
  tires: ITire[] = [];
  show: boolean = true;
  memberSearchErr: any;
  memIdErr = { isValid: false, errMsg: '' };
  memSubIdErr = { isValid: false, errMsg: '' }; 
  memFnameErr = { isValid: false, errMsg: '' };
  memMnameErr = { isValid: false, errMsg: '' };
  memLnameErr = { isValid: false, errMsg: '' }; 
  memStartDateErr = { isValid: false, errMsg: '' };
  memEndDateErr = { isValid: false, errMsg: '' };
   memMaxMinErr = { isValid: false, errMsg: '' };

  //(VE 13-08-2021 starts)
  coverageTierErr = { isValid: false, errMsg: '' };
  altIdErr = { isValid: false, errMsg: '' };
  accountIdErr = { isValid: false, errMsg: '' };
  //(VE 13-08-2021 ends)

  isSearchDataThere: boolean = false;
  noSearchResultsFound: boolean = false;
  uMemberId: any;
  isDisabled: boolean = false;
  isViewModal: boolean = false;
  isAdmin: boolean;
  isMemCount: boolean;

  constructor(public loaderService: LoaderService, private excelService: ExcelService, private mb: FormBuilder, private fb: FormBuilder, private memberService: MemberService, private alertService: AlertService, private datePipe: DatePipe, private loginService: LoginService, private clientService: ClientsService, private contractService: ContractService, private planService: HealthPlanService, private navService: NavPopupService, private decimalPipe: DecimalPipe) { }

  ngOnInit() {
    this.show = true;

    this.initMemberSearchForm();
    this.memberForm = this.fb.group({
      memberId: [''],
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      mname: '',
      gender: ['', Validators.required],
      status: true, // status is number field 0 is false and 1 is true
      memberHrid: ['', Validators.required],
      laserValue: '',
      isUnlimited: false,
      userId: '',
      memberStartDate: ['', Validators.required],
      memberEndDate: ['', Validators.required],
      subscriberId: [''],
      subscriberFname: '',
      subscriberLname: '',
      alternateId: '',
      clientId: ['', Validators.required],
      contractId: ['', Validators.required],
      planId: ['', Validators.required],
      tierId: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      tier: [''],
      benefitPlanId: ['']
    });
    //this.today=this.datePipe.transform(new Date(Date.now()), "MM/dd/yyyy");    
    this.today = new Date().toJSON().split('T')[0];
    setTimeout(() => {
      this.focusMSTag.nativeElement.focus();
      //this.focusTag.nativeElement.focus();
    }, 200);
    this.getActiveClients();
    this.clearErrorMessages();
    this.loginService.getLoggedInRole();
    this.isAdmin = this.loginService.isAdmin;
    if (!this.isAdmin) {
      this.isViewModal = true;
    }
  }  // end of ngOnInit 

  clearErrorMessages() {
    this.memIdErr.isValid = false;
    this.memIdErr.errMsg = '';
    this.memSubIdErr.isValid = false; // From Line 116 to 123 Modified by Venkatesh Enigonda
    this.memSubIdErr.errMsg = '';
    this.memFnameErr.isValid = false;
    this.memFnameErr.errMsg = '';
    this.memMnameErr.isValid = false;
    this.memMnameErr.errMsg = '';
    this.memLnameErr.isValid = false;
    this.memLnameErr.errMsg = '';
    this.memStartDateErr.isValid = false;
    this.memStartDateErr.errMsg = '';
    this.memEndDateErr.isValid = false;
    this.memEndDateErr.errMsg = '';
    this.noSearchFieldEntered = false;
     this.memMaxMinErr.isValid = false;
     this.memMaxMinErr.errMsg = ''
    //(VE 13-08-2021 starts)
    this.isMemSearchFormInvalid = false;
    this.coverageTierErr.isValid = false;
    this.coverageTierErr.errMsg = '';
    this.altIdErr.isValid = false;
    this.altIdErr.errMsg = '';
    this.accountIdErr.isValid = false;
    this.accountIdErr.errMsg = '';
     //(VE 13-08-2021 ends)
  }
  initMemberSearchForm() {
    this.memberSearchForm = this.mb.group({
      MemberId: [''],
      SubscriberId: [''],
      MemberStartDate: [''],
      MemberEndDate: [''],
      Fname: [''],
      Lname: [''],
      Mname: '',
      DateOfBirth: [''],
      Gender: [''],
      clientId: [''],
      benefitPlanId: [''],
      tier: [''],
      alternateId: [''],
      // minPage: null,
       maxPage: null
    });
  }

  getActiveClients() {
    this.clientService.getActiveClients().subscribe(
      (data) => {
        this.activeClients = data;

      }
    )
  }

  getContractsByClientId(clientId) {
    this.contractService.getContractsByClientID(clientId).subscribe(
      (data) => {
        this.activeContracts = data;
      }
    )
  }
  getPlans() {
    this.planService.getAllPlans().subscribe(
      (data) => {
        this.plans = data;
      }
    )
  }
  getTires() {
    this.planService.getTires().subscribe(
      (data) => {
        this.tires = data;

      }
    )
  }
  resetMemberSearch() {
    // this.pageCount = 0;
     this.countMaxMin = 0;
    this.initMemberSearchForm();
    this.isSearchDataThere = false;
    this.memSearchError = false;
    this.noSearchFieldEntered = false;
    this.isMemCount = false;
    this.clearErrorMessages();
  }
  //(VE 13-08-2021 starts)
  validateInputIDs(text, name) {
    this.clearErrorMessages();
    let num1 = /^([0-9]+)$/;
    let alphaNum = /^([a-zA-Z0-9]+)$/;
    let a2 = alphaNum.test(text);
    let a1 = num1.test(text);
    if (!a1 && text != '' && name == 'MemberID') {
      this.memIdErr.isValid = true;
      this.memIdErr.errMsg = 'Member Id is not valid. It should be a number';
      this.isMemSearchFormInvalid = true;
 
    }
    if (!a1 && text != '' && name == 'SubscriberId') {
      this.memSubIdErr.isValid = true;
      this.memSubIdErr.errMsg = 'Subscriber Id is not valid. It should be a number';
      this.isMemSearchFormInvalid = true;

    }
    if (!a1 && text != '' && name == 'alternateId') {
      this.altIdErr.isValid = true;
      this.altIdErr.errMsg = 'ALternate Id is not valid. It should be a number';
      this.isMemSearchFormInvalid = true;

    }
    if (!a2 && text != '' && name == 'clientId') {
      this.accountIdErr.isValid = true;
      this.accountIdErr.errMsg = 'Account Id is not valid.Special Characters not allowed';
      this.isMemSearchFormInvalid = true;
     
    }

  }
  validateInputNames(text, name) {
    this.clearErrorMessages();
    let nam1 = /^([a-zA-Z]+)$/
    let a1 = nam1.test(text);
    if (!a1 && text != '' && name == 'Fname') {
      this.memFnameErr.isValid = true;
      this.memFnameErr.errMsg = 'Member First Name is not valid. It should be a Alphabet';
      this.isMemSearchFormInvalid = true;
     
    }
    if (!a1 && text != '' && name == 'Mname' ) {
      this.memMnameErr.isValid = true;
      this.memMnameErr.errMsg = 'Member Middle Name is not valid. It should be a Alphabet';
      this.isMemSearchFormInvalid = true;
   
    }
    if (!a1 && text != '' && name == 'Lname')  {
      this.memLnameErr.isValid = true;
      this.memLnameErr.errMsg = 'Member Last Name is not valid. It should be a Alphabet';
      this.isMemSearchFormInvalid = true;
   
    }
    if (!a1 && text != '' && name == 'tier') {
      this.coverageTierErr.isValid = true;
      this.coverageTierErr.errMsg = 'Coverage Tier is not valid. It should be a Alphabet';
      this.isMemSearchFormInvalid = true;
     
    }
  }
  //(VE 13-08-2021 starts)
  limit(page)
  {
    this.names.length=0;
    this.pageCount=page;
    this.clearErrorMessages();
    console.log(this.pageCount);
   if (page <= this.countMaxMin) {
     console.log("yes");
     for (let i = 0; i <= page - 1; i++) {
      this.names.push(this.excel1[i]);
      console.log("1");
      //this.pageCount = this.names.length;
     }
   }
   
    if(this.pageCount==''){
    this.searchDataSource = new MatTableDataSource(this.excel1);
    this.searchDataSource.paginator = this.paginator;
    this.searchDataSource.sort = this.sort;
   }
   else if( this.pageCount >= 0) {
     
    console.log("display");
      this.searchDataSource = new MatTableDataSource(this.names);
       this.searchDataSource.paginator = this.paginator;
      this.searchDataSource.sort = this.sort;
    }
    console.log(this.pageCount);
    console.log(this.countMaxMin);
     if(this.pageCount > this.countMaxMin && this.countMaxMin!=0)
    {
     this.memMaxMinErr.isValid = true;
       this.memMaxMinErr.errMsg = "Limit  should not be greater than " +this.countMaxMin + ".";
      return;
 
    }
    
    
  }

  searchMember(formData: FormGroup) {
     this.names.length = 0;
    this.memSearchSubmitted = true;
    this.memSearchError = false;
    this.isMemCount = true;

    // console.log(formData.get());

    let memberId = this.memberSearchForm.get('MemberId').value.trim();
    let fname = this.memberSearchForm.get("Fname").value.trim();
    let mname = this.memberSearchForm.get("Mname").value.trim();
    let lname = this.memberSearchForm.get("Lname").value.trim();
    let subscriberId = this.memberSearchForm.get("SubscriberId").value.trim();
    let Gender = this.memberSearchForm.get("Gender").value;
    let dob = this.memberSearchForm.get("DateOfBirth").value;
    let memberStartDate = this.memberSearchForm.get("MemberStartDate").value;
    let memberEndDate = this.memberSearchForm.get("MemberEndDate").value;
    // let minPage = this.memberSearchForm.get("minPage").value;
     let maxPage = this.memberSearchForm.get("maxPage").value;
    let benefitPlanId = this.memberSearchForm.get("benefitPlanId").value;
    let clientId = this.memberSearchForm.get("clientId").value;
    let tier = this.memberSearchForm.get("tier").value;
    let alternateId = this.memberSearchForm.get("alternateId").value;
    console.log(this.memberSearchForm.value);
    //(VE 13-08-2021 starts)
    //let alphaNum = /^([a-zA-Z0-9 ]+)$/; 
    // let alphaNum = /^([a-zA-Z0-9]+)$/; 
    // let num1 = /^([0-9]+)$/;
    // let nam1 = /^([a-zA-Z]+)$/; 
    // console.log(num1.test(memberId));
    // let a1 = num1.test(memberId);
    // console.log(nam1.test(fname)); 
    // let a2 = nam1.test(fname);
    // console.log(nam1.test(mname));
    // let a3 = nam1.test(mname);
    // console.log(nam1.test(lname));
    // let a4 = nam1.test(lname);
    // console.log(alphaNum.test(subscriberId));
    // let a5 = alphaNum.test(subscriberId);
        //(VE 13-08-2021 ends)

    // if(memberStartDate!=null && memberStartDate!='' && memberEndDate!=null && memberEndDate!=''){
    //   if(memberStartDate>memberEndDate){
    //   this.memStartDateErr.isValid=true;
    //   this.memSearchError=false;
    //   this.memStartDateErr.errMsg='Member Start Date should not be greater than Member End Date';
    //   return;
    //   }
    //   if(memberStartDate==memberEndDate){
    //   this.memStartDateErr.isValid=true;
    //   this.memSearchError=false;
    //   this.memStartDateErr.errMsg='Member Start Date should not be EQUAL to Member End Date';
    //   return;
    //   }
    // }
    // till here
    // if((memberStartDate==null || memberStartDate=='') && (memberEndDate!=null && memberEndDate!='')){
    //   this.memStartDateErr.isValid=true;
    //   this.memSearchError=false;
    //   this.memStartDateErr.errMsg='Member Start Date should not be empty or Invalid';
    //   return;
    // }
    // if((memberEndDate==null || memberEndDate=='') && (memberStartDate!=null && memberStartDate!='')){
    //   this.memEndDateErr.isValid=true;
    //   this.memSearchError=false;
    //   this.memEndDateErr.errMsg='Member End Date should not be empty or Invalid';
    //   return;
    // }

//(VE 13-08-2021 starts)
    // if(!a2 && fname!=''){    // Start by Venkatesh Enigonda
    //   this.memFnameErr.isValid=true;
    //   this.memFnameErr.errMsg='First Name is not valid. It should be a Alphabet';
    //   return;
    // }
    // if(!a3 && mname!=''){
    //   this.memMnameErr.isValid=true;
    //   this.memMnameErr.errMsg='Middle Name is not valid. It should be a Alphabet';
    //   return;
    // }
    // if(!a4 && lname!=''){
    //   this.memLnameErr.isValid=true;
    //   this.memLnameErr.errMsg='Last Name is not valid. It should be a Alphabet';
    //   return;
    // }
    // if(!a5 && subscriberId!=''){
    //   this.memSubIdErr.isValid=true;
    //   this.memSubIdErr.errMsg='Invalid Subscriber Id. Special Chracters not allowed';
    //   return;
    // }  
    //(VE 13-08-2021 starts)

    // stop here if form is invalid
    if (this.isMemSearchFormInvalid) {
      return;
    }
    if (this.memberSearchForm.invalid || this.memberSearchForm.value == '') {
      this.memSearchError = true;
      return;
    }
    if (memberId == '' && fname == '' && mname == '' && lname == '' && subscriberId == '' && dob == '' && Gender == '' && memberStartDate == '' && memberEndDate == '' && clientId == '' && tier == '' && alternateId == '' && benefitPlanId == '') {
      this.noSearchFieldEntered = true;
      return;
    }
    console.log(JSON.stringify(formData.value));
    if (!this.isMemSearchFormInvalid) {
      this.memberService.memberSearch(memberId, fname, mname, lname, subscriberId, dob, Gender, memberStartDate, memberEndDate, benefitPlanId, clientId, tier, alternateId).subscribe(
        (data: IMemberSearchResponse[]) => {
          this.excel1 = data;
          
          //(VE 13-08-2021)
          // let max = num1.test(minPage);
          // console.log(num1.test(minPage));

          // let min = num1.test(maxPage);
           //console.log(num1.test(maxPage));
           this.countMaxMin = data.length;
           console.log(data[maxPage]);
          // console.log(maxPage)
          // console.log(minPage);

          // if ((data[minPage] == undefined) && (data[maxPage] == undefined)) {
          //   this.pageCount = 0;
          // }
          // console.log(minPage != null)
          // console.log(maxPage != null)

          //   if((minPage!='' &&  minPage!=null)  && (maxPage!=''&& minPage!=null))
          //   {     
          // if((!min && minPage!=''))
          //    {
          //      this.memMaxMinErr.isValid=true;
          //      this.memMaxMinErr.errMsg="special characters and blank values not allowed";
          //      console.log("yes");
          //      return; 
          //    }   
          //   if((!max && maxPage!='' ))
          //    {
          //      this.memMaxMinErr.isValid=true;
          //      this.memMaxMinErr.errMsg="special characters and blank values not allowed";
          //      console.log("yes");
          //      return; 
          //    } 
          //   }  

          
          // if (minPage === null && maxPage !== null) {
          //   this.memMaxMinErr.isValid = true;
          //   this.memMaxMinErr.errMsg = "*Range Start Value required "
          //   return;
          // }
          // if (maxPage === null && minPage !== null) {
          //   this.memMaxMinErr.isValid = true;
          //   this.memMaxMinErr.errMsg = "*Range End Value required"
          //   return;
          // }
          for (let i = 0; i <= maxPage - 1; i++) {
            this.names.push(data[i]);
         
            //this.pageCount = this.names.length;
           }
           if(maxPage  >this.countMaxMin)
           {
            this.memMaxMinErr.isValid = true;
              this.memMaxMinErr.errMsg = "Limit should not be greater than " + this.countMaxMin + ".";
              return;
           }
           

         
          

         
          // else if ((minPage > this.countMaxMin && maxPage > this.countMaxMin) || (minPage > this.countMaxMin || maxPage > this.countMaxMin)) {
          //   this.memMaxMinErr.isValid = true;
          //   this.memMaxMinErr.errMsg = "Range should not be greater than " + this.countMaxMin + ".";
          //   return;
          // }
          // if ((minPage != '' && minPage) > (maxPage != '' && maxPage)) {
          //   this.memMaxMinErr.isValid = true;
          //   this.memMaxMinErr.errMsg = "Range from should not be greater than " + maxPage + ".";
          //   return;
          // }
          // console.log(this.names);
          //(VE 13-08-2021)
          console.log(data);
          this.clearErrorMessages();
          console.log(data[0].memberId)
          if (data == null || data.length == 0) {
            console.log("Records are Empty");

          }
          else {
            console.log("another issue");

          }
          setTimeout(() => {
           // this.searchDataSource = new MatTableDataSource(data)//(VE 13-08-2021)
            
            
            if (data[maxPage] == undefined) {
              this.searchDataSource = new MatTableDataSource(data)
            }
            else if(maxPage>=0)
            {
              this.searchDataSource = new MatTableDataSource(this.names);

            }
          
            this.isSearchDataThere = true;
            this.noSearchFieldEntered = false;
            this.memSearchError = false;
          }, 400);
          setTimeout(() => {
            this.searchDataSource.paginator = this.paginator;
            this.searchDataSource.sort = this.sort;
          }, 700)
        }, (error) => {
          console.log("no record found");
          this.isSearchDataThere = false;
          this.memSearchError = true;
          this.noSearchFieldEntered = false;
          this.searchErrorMessage = error.message;
          this.clearErrorMessages();
        }
      )
    }
  }
  // keyPressNumbers(event,text)
  // {
  //  var inp=String.fromCharCode(event.keyCode)
  //   if(/[a-zA-Z]/.test(inp))
  //   {
  //     return true;
  //   }
  //   else if(text =='memberf'){ 
  //     this.memFnameErr.isValid=true;
  //     this.memFnameErr.errMsg="Enter only alphabets in Member First Name";
  //     setTimeout(()=>{this.clearErrorMessages(); },1300);
  //     return false; 
  //   }
  //   else if(text =='memberL'){ 
  //     this.memLnameErr.isValid=true;
  //     this.memLnameErr.errMsg="Enter only alphabets in Member Last Name";
  //     setTimeout(()=>{ this.clearErrorMessages(); },1300);
  //     return false; 
  //   }
  //   else if(text =='memberM'){ 
  //     this.memMnameErr.isValid=true;
  //     this.memMnameErr.errMsg="Enter only alphabets in Member Middle Name";
  //     setTimeout(()=>{this.clearErrorMessages(); },1300);
  //     return false; 
  //   }
  //   else if(text =='coverageTier'){ 
  //     this.coverageTierErr.isValid=true;
  //     this.coverageTierErr.errMsg="Enter only alphabets in Coverage Tier";
  //     setTimeout(()=>{ this.clearErrorMessages(); },1300);
  //     return false; 
  //   }
  // }


  exportAsXLSX(): void {
    this.excelService.exportAsExcelFile(this.excel1, "MemberList")

    console.log("working");
  }

  // onpageChanges(event) {
  //   console.log(event.pageSize);

  //   this.pageCount = event.pageSize;

  // }
  openViewModal(bool, id: any) {
    this.isViewModal = true;
    this.openCustomModal(bool, id);
  }
  openCustomModal(open: boolean, id: any) {
    this.isDisabled = false;
    setTimeout(() => {
      this.focusTag.nativeElement.focus()
    }, 100);
    this.isCustomModalOpen = open;
    this.submitted = false;
    if (open && id == null) {
      this.isAddMode = true;
      document.body.classList.add("cdk-global-scrollblock");
    }
    if (!open && id == null) {
      this.memberForm.reset();
      this.isAddMode = false;
      this.isViewModal = false;
      document.body.classList.remove("cdk-global-scrollblock");
    }
    console.log("id inside modal: " + id);

    if (id != null && open) {
      document.body.classList.add("cdk-global-scrollblock");
      this.isAddMode = false;
      if (id != null) {
        console.log(id);

        this.uMemberId = id.memberHrid;
        setTimeout(() => {
          this.uClientId = id.clientId;
          this.uContractId = id.contractId;
          this.uPlanId = id.planId;
          this.uTierId = id.tierId;

          this.memberForm.patchValue({
            memberId: id.memberHrid,
            clientId: id.clientId,
            contractId: id.contractId,
            planId: id.planId,
            tier: id.tier,
            benefitPlanId: id.benefitPlanId,
            tierId: id.tierId,
            alternateId: id.alternateId,
            fname: id.fname,
            lname: id.lname,
            mname: id.mname,
            subscriberId: id.subscriberId,
            subscriberFname: id.subscriberFname,
            subscriberLname: id.subscriberLname,
            gender: id.gender,
            status: id.status,

            laserValue: this.decimalValue(id.laserValue) == 0 ? '' : this.decimalValue(id.laserValue),

            isUnlimited: (id.isUnlimited == null || id.isUnlimited == 'N') ? false : true,
            memberStartDate: this.datePipe.transform(id.memberStartDate, 'yyyy-MM-dd'),
            memberEndDate: this.datePipe.transform(id.memberEndDate, 'yyyy-MM-dd'),
            dateOfBirth: this.datePipe.transform(id.dateOfBirth, 'yyyy-MM-dd')
          });

        }, 900);
        console.log(id.isUnlimited);




        console.log(this.memberForm.value);
        this.memberForm.disable();
        this.f.laserValue.enable();
        // this.f.isUnlimited.enable(); 
        //this.isUnlimitedChecked();

        if (this.isViewModal == true) {
          this.memberForm.disable();
          //this.f.isUnlimited.disable(); 
        }
        if (this.isViewModal == false) {
          this.memberForm.disable();
          this.f.laserValue.enable();
          // this.f.isUnlimited.enable(); 
          // if(this.f.isUnlimited.value==true || id.isUnlimited=='Y'){
          //   this.memberForm.patchValue({
          //     laserValue: 0
          //   });
          //   this.f.laserValue.disable();
          // }
        }

      }
    }
  }
  // isUnlimitedChecked(){  
  //   if(this.f.isUnlimited.value){
  //     this.memberForm.patchValue({
  //       laserValue: 0
  //     });

  //     this.f.laserValue.disable();
  //   }
  //   else{
  //     this.f.laserValue.enable();            
  //   }
  // }
  get m() { return this.memberSearchForm.controls }
  get f() { return this.memberForm.controls }
  onSubmit() {

    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.memberForm.invalid) {
      return;
    }

    this.loading = true;

    if (this.isAddMode) {

      this.addMember();
    } else {
      this.updateMember();

    }
  }

  //PV 08-05-2021 Starts
  decimalValueString(inputValue) {
    let a;
    if (inputValue == 0 || inputValue == '') {
      a = 0;
    }
    else {
      a = this.decimalPipe.transform(inputValue, this.format);
    }
    console.log(a);

    return a;
  }
  decimalValue(inputValue: number) {
    if (inputValue == 0 || inputValue == null) {
      inputValue = 0;
    }
    else {
      inputValue = Number(this.decimalPipe.transform(inputValue, this.format).replace(/,/g, ""));
    }
    console.log(inputValue);
    return inputValue;
  }

  private addMember() {
    this.isDisabled = true;
    let addMembObj = {
      memberId: this.f.memberHrid.value,
      memberHrid: this.f.memberHrid.value,
      fname: this.f.fname.value,
      lname: this.f.lname.value,
      mname: this.f.mname.value == '' ? 'E' : this.f.mname.value,
      gender: this.f.gender.value,
      status: 1,
      laserValue: this.decimalValue(this.f.laserValue.value),
      isUnlimited: this.f.isUnlimited.value == true ? 'Y' : 'N',
      subscriptionID: this.f.subscriberId.value,
      userId: this.loginService.currentUserValue.name,
      memberStartDate: this.datePipe.transform(this.f.memberStartDate.value, 'yyyy-MM-dd'),
      memberEndDate: this.datePipe.transform(this.f.memberEndDate.value, 'yyyy-MM-dd'),
      dateOfBirth: this.datePipe.transform(this.f.dateOfBirth.value, 'yyyy-MM-dd')
    }
    console.log(addMembObj);

    this.memberService.addMember(addMembObj)
      .pipe(first())
      .subscribe({
        next: () => {

          this.openCustomModal(false, null);
          this.memberForm.reset();

          this.alertService.success('New Member added', { keepAfterRouteChange: true });
          //this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });

  }

  private updateMember() {
    this.isDisabled = true;
    let updateMemberObj = {
      laserType: "Member",
      laserTypeId: String(this.uMemberId),
      laserValue: this.decimalValue((this.f.laserValue.value)), //PV 08-05-2021
      isUnlimited: this.f.isUnlimited.value == true ? 'Y' : 'N',
      status: 1,
      createdBy: this.loginService.currentUserValue.name,
      updatedBy: this.loginService.currentUserValue.name,
      createdOn: null,
      updatedOn: null
    }

    this.memberService.updateMember(updateMemberObj)
      .pipe(first())
      .subscribe({
        next: () => {
          this.openCustomModal(false, null);
          this.searchMember(this.memberSearchForm);
          this.memberForm.reset();

          this.memberForm.patchValue(updateMemberObj);
          this.alertService.success('Member updated', {
            keepAfterRouteChange: true
          });
          // this.router.navigate(['../../'], { relativeTo: this.route });                    
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
  }

}
