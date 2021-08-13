import { Component, DebugElement, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {UserSecurityService} from '../services/user-security.service';
import { IAllUserIDs, IUserAdd,IUserUpdate, IUserAddResponse,IUserUpdateResponse, IUserDetails } from '../models/user-security.model';
import { FormGroup, FormArray, FormBuilder,
  Validators,FormControl  } from '@angular/forms';
import { empty } from 'rxjs';
import {RolesService} from '../services/roles.service';
import {IRole, IRoleNameRequest} from '../models/roles-modal';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { first } from 'rxjs/operators';
import { formatDate, DatePipe } from '@angular/common';
import { AlertService } from '../services/alert.service';
import { LoginService } from 'src/app/shared/services/login.service';

@Component({
  selector: 'app-users-security',
  templateUrl: './users-security.component.html',
  styleUrls: ['./users-security.component.css'],
  providers: [DatePipe]
})
export class UsersSecurityComponent implements OnInit {
  securityForm: FormGroup;

  allUserIDs: IAllUserIDs[] = [];
  allUserIDDetails: IAllUserIDs[] = [];
  userDetails: IUserDetails[];
  roles: IRole[] = [];
  // added by masool irfan
  today: string;
  // till here

  selectAll: string = "Select All";
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  isCustomModalOpen: boolean = false;
  isViewModal: boolean;
  isAdmin: boolean;
  effectiveFrom = {isValid: false, errors: ''};
  effectiveTo = {isValid: false, errors: ''}; 
  userFnameErr = {isValid: false, errMsg: ''}; // Start by Venkatesh Enigonda
  userMnameErr = {isValid: false, errMsg: ''};
  userLnameErr = {isValid: false, errMsg: ''};// End by Venkatesh Enigonda


  @ViewChild("focusElem") focusTag: ElementRef;

  displayedColumns: string[] = ['userId', 'userName', 'status', 'updatedId'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userSecurityService: UserSecurityService, private fb: FormBuilder,private rolesService: RolesService, private alertService: AlertService, private datePipe: DatePipe, private loginService: LoginService) { 
    
  
  }
  ngOnInit(): void {
    this.getAllUsersList();
     this.securityForm = this.fb.group({
        userId:'',
        firstName:['',Validators.required],
        middleName:[''],
        lastName: ['',Validators.required],
        description: [''],
        emailAddress: ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]], 
        roleId: ['',Validators.required],
        effectiveFrom:['',Validators.required],
        effectiveTo:['',Validators.required],
        status: '',
        updatedId:  '',
        terminationDate: '',
        createdId: '',
        createdOn: '',
        lastupdate: '',
        password: ''
  },{validator: this.dateLessThan('effectiveFrom', 'effectiveTo')},); 
  //added by masool irfan
    this.today=new Date().toJSON().split('T')[0];  
    // till here

    this.getAllRoles();
    this.clearErrorMessages();
    this.loginService.getLoggedInRole();
    this.isAdmin = this.loginService.isAdmin;
   
  }
  clearErrorMessages(){  
    this.effectiveFrom.isValid=false;
    this.effectiveFrom.errors='';
    this.effectiveTo.isValid=false;
    this.effectiveTo.errors='';
    this.userFnameErr.isValid=false; // STart by Venkatesh Enigonda
    this.userFnameErr.errMsg='';
    this.userMnameErr.isValid=false; 
    this.userMnameErr.errMsg='';
    this.userLnameErr.isValid=false;
    this.userLnameErr.errMsg='';  // End by Venkatesh Enigonda
  }

  getAllUsersList(){    
    this.userSecurityService.getAllUserList().subscribe(
      (data: IAllUserIDs[]) => {          
         this.allUserIDs = data;   
         this.dataSource = new MatTableDataSource(this.allUserIDs);
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;         
         this.allUserIDDetails = data;      
      }
    );
  }  
  dateLessThan(from: string, to: string) {
  
    // added by masool irfan
    return (group: FormGroup): {[key: string]: any} => {
      this.clearErrorMessages();
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        this.effectiveFrom.isValid= true;
        this.clearErrorMessages(); 
      } else if(f.value == t.value) {
        this.effectiveFrom.isValid= true;
        this.clearErrorMessages(); 
      } else if(t.value > new Date(Date.now())){
        this.effectiveFrom.isValid= true;
        this.clearErrorMessages(); 
      } else {
        this.effectiveFrom.isValid= false;
      }
      return {};
    }
    // till here
}


// starts here added by Venkatesh Enigonda
public doFilter = (value: string) => {
  this.dataSource.filter = value.trim().toLocaleLowerCase();

  this.dataSource.filterPredicate = (data1:IAllUserIDs, filter: string) => {
    const Id=data1.status;
    const stat :string=String(Id);
    const CompareData=data1.userName.toLowerCase() ||'';
    const CompareData1=stat.toLocaleLowerCase() ||'';
    const CompareData2=data1.userId.toLowerCase() ||'';
    return CompareData.indexOf(filter)!==-1  || CompareData1.indexOf(filter)!==-1 ||  CompareData2.indexOf(filter)!==-1;
  };
}
//Ends here   
getAllRoles(){    
  this.rolesService.getAllRoles().subscribe(
    (data: IRole[]) => {
        this.roles = data;
        
        //this.roles = data;
    }
  )
}
  getUserDetails(userId: string){ 
      //   this.userSecurityService.getAllUserList().subscribe(
      //    (data: IAllUserIDs[]) => {    
      //     if(UserID!="Select All")
      //     {
      //       this.allUserIDDetails = data.filter(obj => {return obj.userId==UserID;});
      //     }
      //     else
      //     {
      //       this.allUserIDDetails = data;
      //     }
      //    }
      //  ); 
      this.userSecurityService.getUserDetails(userId).subscribe((data)=>{
        this.userDetails = data;
        console.log("user details "+this.userDetails[0].emailAddress);
                
      })
     }
     get f() { return this.securityForm.controls; }
   
openViewModal(bool, id:any){
  this.isViewModal = true;
  this.openCustomModal(bool, id);
}
     openCustomModal(open: boolean, id:string) {
      setTimeout(()=>{
        this.focusTag.nativeElement.focus()
      }, 100);
       this.submitted = false;
       this.loading = false;
       if(open && id==null){
         this.isAddMode = true;
         this.isViewModal=false;
         this.securityForm.enable();
       }
       this.isCustomModalOpen = open;
       if (!open && id==null) {
        this.getAllUsersList();
         this.securityForm.reset();
         this.isAddMode = false;
         this.isViewModal=false;
       }
       console.log("id inside modal: "+id);
       
       if(id!=null && open){
         this.isAddMode = false;
            this.userSecurityService.getUserDetails(id)
            .pipe(first())
            .subscribe(x => {
              console.log(x[0].roleId);
              this.securityForm.patchValue({ 
                userId: x[0].userId,
                firstName:x[0].firstName,
                middleName:x[0].middleName,
                lastName: x[0].lastName,
                description: x[0].description,
                emailAddress:x[0].emailAddress, 
                roleId: Number(x[0].roleId),
                effectiveFrom: this.datePipe.transform(x[0].effectiveFrom, 'yyyy-MM-dd'),
                effectiveTo:this.datePipe.transform(x[0].effectiveTo, 'yyyy-MM-dd'),
                status: x[0].status,
                updatedId:  "ash",
                terminationDate: "2011-10-10",
                createdId: "ash",
                createdOn: "2020-10-01",
                lastupdate: "2021-10-10"
              });          
            });
            if(this.isViewModal){
              this.securityForm.disable();
            }
            else{
              this.securityForm.enable();
            }
       }
     }
     
     onSubmit() {

      this.clearErrorMessages();

       this.submitted = true;
       let nam1 = /^([a-zA-Z]+)$/; // Start by Venkatesh Enigonda
       console.log(nam1.test(this.f.firstName.value));;
       let a1=nam1.test(this.f.firstName.value);

       console.log(nam1.test(this.f.middleName.value));
       let a2=nam1.test(this.f.middleName.value);

       console.log(nam1.test(this.f.lastName.value));
       let a3=nam1.test(this.f.lastName.value);  // End by Venkatesh Enigonda
       
       // added by masool irfan  
       let effectiveFrom = this.datePipe.transform(this.securityForm.get('effectiveFrom').value, 'yyyy-MM-dd');
       let effectiveTo = this.datePipe.transform(this.securityForm.get('effectiveTo').value, 'yyyy-MM-dd');
       let maxDate = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd');
       if(effectiveFrom!=null && effectiveFrom!='' && effectiveTo!=null && effectiveTo!=''){
         if(effectiveFrom>effectiveTo){
         this.effectiveFrom.isValid=true;
         this.effectiveFrom.errors='Effective From Date should not be greater than Effective To Date';
         return;
         }
       }
       if((effectiveFrom!==null || effectiveFrom!=='') && (effectiveTo!=null && effectiveTo!='')){
         if(effectiveFrom==effectiveTo){
         this.effectiveFrom.isValid=true;
         this.effectiveFrom.errors='Effective From Date should not be EQUAL to Effective To Date';
         return;
         }
       }
       if((effectiveFrom!==null || effectiveFrom!=='') && (effectiveTo!=null && effectiveTo!='')){
         if(effectiveTo < maxDate ){
         this.effectiveTo.isValid=true;
         this.effectiveTo.errors='Effective To date must be greater than '+maxDate+' date';
         return;
         }
       }
 
       // till here
      if(!a1 && this.f.firstName.value!=''){  // Start by Venkatesh Enigonda
        this.userFnameErr.isValid=true;
        this.userFnameErr.errMsg='First Name is not valid. It should be a Alphabet';
        return;
      }
      if(!a2 && this.f.middleName.value!=''){    
        this.userMnameErr.isValid=true;
        this.userMnameErr.errMsg='Middle Name is not valid. It should be a Alphabet';
        return;
      }
      if(!a3 && this.f.lastName.value!=''){
        this.userLnameErr.isValid=true;
        this.userLnameErr.errMsg='Last Name is not valid. It should be a Alphabet';
        return;
      } // End by Venkatesh Enigonda

       // reset alerts on submit
       this.alertService.clear();
       // stop here if form is invalid
       if (this.securityForm.invalid) {
           return;
       }

       this.loading = true;
       if (this.isAddMode) {
           
           this.addUser();
       } else {
           this.updateUser();
           
       }
   }
   
   private addUser() {

     this.securityForm.patchValue({ 
       roleId: Number(this.securityForm.get('roleId').value),
       effectiveFrom: this.datePipe.transform(this.securityForm.get('effectiveFrom').value, 'yyyy-MM-dd'),
       effectiveTo:this.datePipe.transform(this.securityForm.get('effectiveTo').value, 'yyyy-MM-dd'),
       updatedId:  "ash",
       terminationDate: "2011-10-10",
       createdId: "ash",
       createdOn: "2020-10-01",
       lastupdate: "2021-10-10"
     });   
     this.userSecurityService.addUser(this.securityForm.value)
         .pipe(first())
         .subscribe({
             next: () => {
               this.getAllUsersList();
               this.openCustomModal(false, null);
               this.securityForm.reset();                
                this.alertService.success('New User added', { keepAfterRouteChange: true });
                //this.router.navigate(['../'], { relativeTo: this.route });
             },
             error: error => {
                 this.alertService.error(error);
                 this.loading = false;
             }
         });
     }
   
     private updateUser() {
         this.userSecurityService.updateUser(this.securityForm.value)
             .pipe(first())
             .subscribe({
                 next: () => {
                     this.openCustomModal(false,null); 
                     this.securityForm.reset();
                     this.alertService.success('User updated', { 
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

