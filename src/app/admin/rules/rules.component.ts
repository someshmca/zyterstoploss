import { Component, ElementRef, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import {RulesService} from '../services/rules.service';
import {IRule, IRuleIDRequest, IRuleAddRequest, IAddRuleSuccess, IUpdateRuleSuccess} from '../models/rules-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { first } from 'rxjs/operators';
import { formatDate, DatePipe } from '@angular/common';
import { AlertService } from '../services/alert.service';

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
 

  displayedColumns: string[] = ['ruleID','ruleGroup', 'description', 'value', 'updateid'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private rulesService: RulesService, private fb: FormBuilder,
    private alertService: AlertService,
    private datePipe: DatePipe ) { }

  ngOnInit() {
   this.getAllRules();
   this.ruleForm = this.fb.group({   
    ruleID: '',
    ruleGroup:  ['', Validators.required],
    description:  ['', Validators.required],
    ruleGroupId: 0,
    value: ['', Validators.required],
    createdid: "som",
    createdOn: "2011-10-10",
    updateid: "ash",
    lastupdate: "2011-03-10"
   });  
    
    this.rulesService.getRuleGroups().subscribe(
      (data) => {
        this.ruleGroups = data;
        console.log("Rule group list "+this.ruleGroups);
      }
    )
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

  openCustomModal(open: boolean, id:string) {
    this.submitted = false;
    this.loading = false;
    if(open && id==null){
      this.isAddMode = true;
    }
    this.isCustomModalOpen = open;
    if (!open && id==null) {
      this.ruleForm.reset();
      this.isAddMode = false;
    }
    console.log("id inside modal: "+id);
    
    if(id!=null && open){
      this.isAddMode = false;
         this.rulesService.getRule(id)
         .pipe(first())
         .subscribe(x => {
           console.log(x[0].ruleID);
           this.ruleForm.patchValue({ 
            ruleID: x[0].ruleID,
            description: x[0].description,
            value: x[0].value,
            isActive: true,
            ruleGroup: {
              ruleGroupId: 0,
              name: x[0].ruleGroup,
              tblRules: [
                null
              ]
            }
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
  this.rulesService.addRule(this.ruleForm.value)
      .pipe(first())
      .subscribe({
          next: () => {
            this.openCustomModal(false, null);
            this.getAllRules();
            this.ruleForm.reset();                
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
    debugger;
      this.rulesService.updateRule(this.ruleForm.value)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.getAllRules();
                  debugger;
                  this.openCustomModal(false,null); 
                  this.ruleForm.reset();
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
