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
  
  openCustomModal(open: boolean, id:string) {
    this.submitted = false;
    this.loading = false;
    if(open && id==null){
      this.isAddMode = true;
    }
    this.isCustomModalOpen = open;
    if (!open && id==null) {
      this.roleForm.reset();
      this.isAddMode = false;
    }
    console.log("id inside modal: "+id);
    
    if(id!=null && open){
      this.isAddMode = false;
      //dfdfdfdf
         this.rolesService.getRole(id)
         .pipe(first())
         .subscribe(x => {
           console.log(x[0].roleId);
           this.roleForm.patchValue({ 
            roleId: x[0].roleId,
            roleName: x[0].roleName,
            description: x[0].description
           });
          
         }
      );
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
    this.rolesService.addRole(this.roleForm.value)
        .pipe(first())
        .subscribe({
            next: () => {
              this.openCustomModal(false, null);
              this.getAllRoles();
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
      debugger;
        this.rolesService.updateRole(this.roleForm.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.getAllRoles();
                    debugger;
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
