import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {RolesService} from '../services/roles.service';
import {
  IRole, 
  IRoleNameRequest, 
  IAddRole, 
  IAddRoleSuccess,
  IUpdateRole,
  IUpdateRoleSuccess
} from '../models/roles-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { first } from 'rxjs/operators';
import { formatDate, DatePipe } from '@angular/common';
import { AlertService } from '../services/alert.service';



@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css'],
  providers: [DatePipe]
})
export class RoleComponent implements OnInit {
  roles: IRole[] = [];
  roleNames: IRole[] = [];
  roleName: string;
  roleForm: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  isCustomModalOpen: boolean = false;
  @ViewChild("focusElem") focusTag: ElementRef;

  displayedColumns: string[] = ['roleName', 'description', 'menueAccess', 'roleId'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private rolesService: RolesService, 
    private fb: FormBuilder,
    private alertService: AlertService,
    private datePipe: DatePipe) { }

  ngOnInit(){
    this.getAllRoles();
    this.roleForm = this.fb.group({   
      roleId: 0,
      roleName: ['', Validators.required],
      description:  ['', Validators.required],
      createid: "",
      createdOn: "2011-10-10",
      updateid: "",
      lastupdate: new Date()
    });   
  }
  
  getAllRoles(){    
    this.rolesService.getAllRoles().subscribe(
      (data: IRole[]) => {
          this.roleNames = data;
          this.roles = data;
          this.dataSource = new MatTableDataSource(this.roles);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      }
    )
  }  
  getRole(roleName){
    this.rolesService.getRole(roleName).subscribe(
      (data: IRole[]) => {
        this.roles = data;
      }
    );
  }
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  
  openCustomModal(open: boolean, elem:any) {
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100);
    this.submitted = false;
    this.loading = false;
    if(open && elem==null){
      this.isAddMode = true;
    }
    this.isCustomModalOpen = open;
    if (!open && elem==null) {
      this.getAllRoles();
      this.roleForm.reset();
      this.isAddMode = false;
    }
    console.log("elem inside modal: "+elem);
    if(elem!=null && open){
      this.isAddMode = false;
      //dfdfdfdf
        //  this.rolesService.getRole(id)
        //  .pipe(first())
        //  .subscribe(x => {
           console.log(elem.roleId);
           this.roleForm.patchValue({ 
            roleId: elem.roleId,
            roleName:elem.roleName,
            description: elem.description,            
            createid: "johnwatson",
            createdOn: "2020-01-01",
            updateid: "williamsmith",  
            lastupdate: this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd')
           });
          
      //    }
      // );
      //dfdfddfdfdfdf
    }
  }
  get f() { return this.roleForm.controls; }

  onSubmit() {
      this.submitted = true;

      // reset alerts on submit
      this.alertService.clear();

      // stop here if form is invalid
      if (this.roleForm.invalid) {
          return;
      }

      this.loading = true;
      if (this.isAddMode) {
          this.addRole();
      } else {
          this.updateRole();
          
      }
  }
  
  private addRole() {    
    this.roleForm.patchValue({  
      roleId: 0,
      createid: "johnwatson",
      createdOn: "2021-01-01",
      updateid: "williamsmith",  
      lastupdate: this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd')
     });
    this.rolesService.addRole(this.roleForm.value)
        .pipe(first())
        .subscribe({
            next: () => {
              this.getAllRoles();
              this.openCustomModal(false, null);
              this.roleForm.reset();              
                this.alertService.success('New Role added', { keepAfterRouteChange: true });
                //this.router.navigate(['../'], { relativeTo: this.route });
            },
            error: error => {
                this.alertService.error(error);
                this.loading = false;
            }
        });
        
    }

    private updateRole() {
        this.rolesService.updateRole(this.roleForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.openCustomModal(false,null); 
                    this.roleForm.reset();
                    this.alertService.success('Role updated', { 
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
