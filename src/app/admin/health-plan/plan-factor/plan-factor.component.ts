import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'plan-factor',
  templateUrl: './plan-factor.component.html',
  styleUrls: ['./plan-factor.component.css']
})
export class PlanFactorComponent implements OnInit {

  userTable: FormGroup;
  control: FormArray;
  mode: boolean;
  touchedRows: any;
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.touchedRows = [];
    this.userTable = this.fb.group({
      tableRows: this.fb.array([])
    });
    this.addRow();
  }

  ngAfterOnInit() {
    this.control = this.userTable.get('tableRows') as FormArray;
  }

  initiateForm(): FormGroup {
    return this.fb.group({
      stopLossTier: ['', Validators.required],
      stopLossTierFactor: ['', Validators.required],
      expectedClaimRate: ['', [Validators.required]],
      terminationExtCoverage: [''],
      isEditable: [true]
    });
  }

  addRow() {
    const control =  this.userTable.get('tableRows') as FormArray;
    control.push(this.initiateForm());
  }

  deleteRow(index: number) {
    const control =  this.userTable.get('tableRows') as FormArray;
    control.removeAt(index);
  }

  editRow(group: FormGroup) {
    group.get('isEditable').setValue(true);
  }

  doneRow(group: FormGroup) {
    group.get('isEditable').setValue(false);
  }

  saveUserDetails() {
    console.log(this.userTable.value);
  }

  get getFormControls() {
    const control = this.userTable.get('tableRows') as FormArray;
    return control;
  }

  submitForm() {
    const control = this.userTable.get('tableRows') as FormArray;
    this.touchedRows = control.controls.filter(row => row.touched).map(row => row.value);
    console.log(this.touchedRows);
  }

  toggleTheme() {
    this.mode = !this.mode;
  }
}
