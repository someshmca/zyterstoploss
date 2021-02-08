import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import {AttributeService} from '../services/attributes.service';
import {
  IAttribute, IAttributeIDRequest,
  IAttributeAdd, IAddAttributeSuccess,
  IAttributeUpdate, IUpdateAttributeSuccess
} from '../models/attributes-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.css']
})
export class AttributesComponent implements OnInit {

  attributes:IAttribute[] = [];
  attributeIDs:IAttribute[] = [];
  attribute: IAttributeIDRequest;
  isAttributeDetailCalled: boolean = false;

  isAddAttributeModalOpen: boolean = false;
  isAddDescValid: boolean = false;
  isNewAttributeAdded: boolean = false;
  isAddAttributeSubmitted: boolean = false;
  addAttributeForm: FormGroup;
  addAttributeRequest: IAttributeAdd;
  addAttributeResponse: IAddAttributeSuccess;
  
  displayedColumns: string[] = ['attributeId', 'description', 'updateid'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private attributeService: AttributeService, private fb: FormBuilder) { }
  
  ngOnInit() {
    this.getAllAttributes();
    this.initAddAttributeForm();
  }

  getAllAttributes(){    
    this.attributeService.getAllAttributes().subscribe(
      (data: IAttribute[]) => {
          this.attributeIDs = data;
          this.attributes = data;
          this.dataSource = new MatTableDataSource(this.attributes);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      }
    )
  }  
  getAttribute(attributeId){
    this.attributeService.getAttribute(attributeId).subscribe(
      (data: IAttribute[]) => {
        this.attributes = data;
      }
    );
  }
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }
  onChangeAttribute(attributeOption: string){
    if(attributeOption == "Select All"){
      this.getAllAttributes();
    }
    else{
      this.getAttribute(attributeOption);
    }
  }

  initAddAttributeForm() {
    this.addAttributeForm = this.fb.group({
      attributeID: "",
      attributeGroup: "",
      description: "",
      value: "",
      createid: "",
      createdby: "",
      updateid: "",
      lastupdate: new Date("2020-12-11")
    });
  }

  openAddAttributeModal(open: boolean) {
    this.isAddAttributeModalOpen = open;
    this.isNewAttributeAdded = false;
    if (!open) {
      this.isNewAttributeAdded = false;
      this.addAttributeForm.reset();
    }
  }

  get f() { return this.addAttributeForm.controls; }

  addAttribute(form: FormGroup) {
    if(this.isAddDescValid){
      this.addAttributeRequest = {
        attributeID: "",
        attributeGroup: "",
        description: this.addAttributeForm.get('description').value,
        value: "",      
        createdid: "",
        createdby: "",
        updateid: "",
        lastupdate: new Date("2020-12-11")
      };
      console.log("add Attribute request  : " + this.addAttributeRequest);
      this.attributeService.addAttribute(this.addAttributeRequest).subscribe(
        (data: IAddAttributeSuccess) => {
          console.log("Add Attribute data : " + data);
          this.addAttributeResponse = data;
          console.log("add Rule Response : " + this.addAttributeResponse);
          //debugger;
          this.getAllAttributes();
          this.openAddAttributeModal(false);
          this.isNewAttributeAdded = true;
        }
      )
    }
    else{
      this.isNewAttributeAdded = false;
      return this.isAddDescValid;
    }
  }

}
