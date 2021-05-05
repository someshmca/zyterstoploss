import { Component, ElementRef, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import {RulesService} from '../services/rules.service';
import {IRule, IRuleIDRequest, IRuleAddRequest, IAddRuleSuccess, IUpdateRuleSuccess, IRuleUpdateRequest} from '../models/rules-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { first } from 'rxjs/operators';
import { formatDate, DatePipe } from '@angular/common';
import { AlertService } from '../services/alert.service';
import { LoginService } from 'src/app/shared/services/login.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css'],
  providers: [DatePipe]
})
export class RulesComponent implements OnInit {

 rules: IRule[];
 ruleIDs: IRule[];
 rule: IRuleIDRequest;
  ruleForm: FormGroup;
  ruleGroups = [];
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  isCustomModalOpen: boolean = false;
uRuleID: string;
  @ViewChild("focusElem") focusTag: ElementRef;

  displayedColumns: string[] = ['ruleID', 'ruleGroup', 'description', 'value', 'updateid'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private rulesService: RulesService, private fb: FormBuilder,
    private alertService: AlertService,
    private datePipe: DatePipe, private loginService: LoginService) { }

  ngOnInit() {
   this.getAllRules();
   this.ruleForm = this.fb.group({ 
    ruleId: [''],
    description:  ['', Validators.required],
    ruleGroup: ['', Validators.required],
    value: ['', Validators.required]
   });  
    this.ruleGroups = [
      {id: 1, name: 'Benefit'},
      {id: 2, name: 'Program'},
      {id: 3, name: 'Contracts'},
      {id: 4, name: 'Suppliers'}
    ];
    // this.rulesService.getRuleGroups().subscribe(
    //   (data) => {
    //     this.ruleGroups = data;
    //     
    //     console.log("Rule group list "+this.ruleGroups);
    //   }
    // )
  }
  getAllRules(){
    this.rulesService.getAllRules().subscribe(
      (data: IRule[]) => {
        this.ruleIDs = data;
         this.rules = data;
         this.dataSource = new MatTableDataSource(this.rules);
         this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.sort;
      }
    ); 
  }
  getRule(ruleID: string){    
    this.rulesService.getRule(ruleID).subscribe(
      (data: IRule[]) => {
        this.rules = data;
      }
    );    
  }
  // onChangeRule(ruleOption: string){
  //   if(ruleOption == "Select All"){
  //     this.getAllRules();
  //   }
  //   else{
  //     this.getRule(ruleOption);
  //   }
  // }
  getRuleGroup(){
    this.rulesService.getRuleGroups().subscribe(
      (data) => {
        this.ruleGroups = data;
      }
    )
  }
  
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  get f() { return this.ruleForm.controls; }

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
      this.getAllRules();
      this.ruleForm.reset();
      this.isAddMode = false;
    }
    console.log("id inside modal: "+id);
    
    if(id!=null && open){
      this.isAddMode = false;
      this.uRuleID = id.ruleID;
      if(id.ruleGroup=='Benefit'){
        this.ruleForm.patchValue({
          ruleGroup: 1
        })
      }
      if(id.ruleGroup=='Program'){
        this.ruleForm.patchValue({
          ruleGroup: 2
        })
      }
      if(id.ruleGroup=='Contracts'){
        this.ruleForm.patchValue({
          ruleGroup: 3
        })
      }
      if(id.ruleGroup=='Suppliers'){
        this.ruleForm.patchValue({
          ruleGroup: 4
        })
      }
      this.ruleForm.patchValue({
        ruleId: this.uRuleID,
        description:  id.description,
        value: id.value  
      })
      console.log(this.ruleForm.value);
      console.log(id.ruleGroup);
      
    }
  }
  
  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.ruleForm.invalid) {
        return;
    }

    this.loading = true;
    if (this.isAddMode) {
        this.addRule();
    } else {
        this.updateRule();
        
    }
}

private addRule() {
  // this.ruleForm.patchValue({    
  //   ruleID: '',
  //   ruleGroupId: Number(this.ruleForm.get('ruleGroup').value),
  //   createdid: "kshdwra", 
  //   createdOn: "2021-01-01",
  //   updateid: "xhwadr",  
  //   lastupdate: this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd')
  // });
  
  let ruleAddRequest:IRuleAddRequest = {
    ruleID: '',    
    ruleGroup: this.ruleGroups[this.f.ruleGroup.value].name,
    ruleGroupId: Number(this.f.ruleGroup.value),
    description: this.f.description.value,
    value: this.f.value.value,      
    userId: this.loginService.currentUserValue.name
  }
  
  this.rulesService.addRule(ruleAddRequest)
      .pipe(first())
      .subscribe({
          next: () => {
            this.openCustomModal(false, null);
            this.getAllRules();            
              this.alertService.success('New Rule added', { keepAfterRouteChange: true });
              //this.router.navigate(['../'], { relativeTo: this.route });
          },
          error: error => {
              this.alertService.error(error);
              this.loading = false;
          }
      });      
  }

  private updateRule() {
    
      let ruleUpdateRequest:IRuleUpdateRequest = {
        ruleId: this.uRuleID,
        description: this.f.description.value,
        value: this.f.value.value,   
        userId: this.loginService.currentUserValue.name,
        ruleGroupId: Number(this.f.ruleGroup.value),
        isActive: true
      }
      this.rulesService.updateRule(ruleUpdateRequest)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.openCustomModal(false,null);                  
                  this.alertService.success('Rule updated', { 
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
