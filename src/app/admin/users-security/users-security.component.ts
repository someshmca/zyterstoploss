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

  selectAll: string = "Select All";
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  isCustomModalOpen: boolean = false;
  @ViewChild("focusElem") focusTag: ElementRef;

  displayedColumns: string[] = ['userId', 'userName', 'status', 'updatedId'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userSecurityService: UserSecurityService, private fb: FormBuilder,private rolesService: RolesService, private alertService: AlertService, private datePipe: DatePipe) { 
    
  
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
  },{validator: this.dateLessThan('effectiveFrom', 'effectiveTo')}); 
      
  this.getAllRoles();
   
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
  
    return (group: FormGroup): {[key: string]: any} => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value > t.value) {
        return {
          dates: "Effective Date To should be greater than Effective Date From."
        };
      }
      return {};
    }
}

public doFilter = (value: string) => {
  this.dataSource.filter = value.trim().toLocaleLowerCase();
}  
getAllRoles(){    
  this.rolesService.getAllRoles().subscribe(
    (data: IRole[]) => {
        this.roles = data;
        debugger;
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
   
     openCustomModal(open: boolean, id:string) {
      setTimeout(()=>{
        this.focusTag.nativeElement.focus()
      }, 100);
       this.submitted = false;
       this.loading = false;
       if(open && id==null){
         this.isAddMode = true;
       }
       this.isCustomModalOpen = open;
       if (!open && id==null) {
        this.getAllUsersList();
         this.securityForm.reset();
         this.isAddMode = false;
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
            }
         );
       }
     }
     
     onSubmit() {
       this.submitted = true;
   
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

