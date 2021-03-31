import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import {IMemberSearch, IMemberSearchResponse, IMemberAdd} from '../models/member-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MemberService} from '../services/member.service';
import {Paths} from '../admin-paths';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { first } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import {DatePipe} from '@angular/common';
import { AlertService } from '../services/alert.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { from } from 'rxjs';
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
  displayedColumns: string[] = ['memberId','subscriptionID', 'fname', 'lname', 'mname', 'gender','memberStartDate','dateOfBirth','gender','status', 'updateid'];
  searchDataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("focusElem") focusTag: ElementRef;
  
  isAddMode: boolean;
  loading = false;
  submitted = false;
  isCustomModalOpen: boolean = false;

  memberSearchErr: any;
  isSearchDataThere: boolean = false;
  noSearchResultsFound: boolean = false;
  constructor(private fb: FormBuilder, private memberService:MemberService, private alertService: AlertService, private datePipe: DatePipe,private loginService: LoginService) { }

  ngOnInit(): void {
    this.memberSearchForm = this.fb.group({
      MemberId: [''],
      subscriptionID:'',
      memberStartDate: '',
      Fname:'',
      Lname: '',
      mname: '',
      DateOfBirth:new Date('2020-10-29'),
      gender: '',
      status: ''
    });
    this.memberSearchErr = {
      MemberId: '',
      subscriptionID:'',
      memberStartDate: '',
      Fname:'',
      Lname: '',
      mname: '',
      DateOfBirth: '',
      gender: '',
      status: ''
    }
    this.memberForm = this.fb.group({
      memberId: ['', Validators.required],
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      mname: '',
      subscriptionID: ['', Validators.required],
      gender: ['', Validators.required],
      status: 0,
      memberStartDate: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      createid: '',
      createdby: '',
      updateid: '',
      lastupdate: ''
    })
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100);
  }
  searchMember(formData: FormGroup){
   // console.log(formData.get());
   let memberId = this.memberSearchForm.get('MemberId').value;
   let fname=this.memberSearchForm.get("Fname").value;
   let lname=this.memberSearchForm.get("Lname").value;
   let dob=this.memberSearchForm.get("DateOfBirth").value;
   console.log();
   console.log(JSON.stringify(formData.value));
   this.memberService.memberSearch(memberId,fname,lname,dob).subscribe(
     (data:IMemberSearchResponse[])=>{
       console.log(data);
       setTimeout(()=>{
          this.searchDataSource = new MatTableDataSource(data);
          this.searchDataSource.paginator = this.paginator;
          this.searchDataSource.sort = this.sort;
          this.isSearchDataThere = true;
          this.noSearchResultsFound = false;
       }, 400);
       //
     }, (error) => {
       this.isSearchDataThere = false;
       this.noSearchResultsFound = true;
       this.searchErrorMessage = error.message;
     }
   )
  }

  openCustomModal(open: boolean, id:any) {
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
      this.memberForm.reset();
      this.isAddMode = false;
    }
    console.log("id inside modal: "+id);

    if(id!=null && open){
      this.isAddMode = false;      
      if(id!=null){

       
        
       }

        
  }
}
get f(){return this.memberForm.controls}
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
private addMember() {
    
//   console.log(this.clientForm.get('status').value);
  this.memberService.addMember(this.memberForm.value)
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
    
      this.memberService.updateMember(this.memberForm.value)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.openCustomModal(false,null); 
                  this.memberForm.reset();
                  this.alertService.success('Member updated', { 
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
