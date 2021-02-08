import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {IMemberSearch, IMemberSearchResponse, IMemberAdd} from '../models/member-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MemberService} from '../services/member.service';
import {Paths} from '../admin-paths';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { from } from 'rxjs';
@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
  memberSearchForm: FormGroup;
  searchResult: any;
  searchErrorMessage: string;
  displayedColumns: string[] = ['memberId','subscriptionID', 'fname', 'lname', 'mname', 'gender','memberStartDate','dateOfBirth','gender','status', 'updateid'];
  searchDataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  memberSearchErr: any;
  isSearchDataThere: boolean = false;
  noSearchResultsFound: boolean = false;
  constructor(private fb: FormBuilder, private memberService:MemberService) { }

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
       //debugger;
     }, (error) => {
       this.isSearchDataThere = false;
       this.noSearchResultsFound = true;
       this.searchErrorMessage = error.message;
     }
   )
  }
}
