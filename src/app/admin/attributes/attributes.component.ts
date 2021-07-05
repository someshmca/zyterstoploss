import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import {AttributeService} from '../services/attributes.service';
import {
  IAttribute, IAttributeIDRequest,
  IAttributeAdd, IAddAttributeSuccess,
  IAttributeUpdate, IUpdateAttributeSuccess, IAttributeGroup
} from '../models/attributes-model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { first } from 'rxjs/operators';
import { formatDate, DatePipe } from '@angular/common';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.css'],
  providers: [DatePipe]
})
export class AttributesComponent implements OnInit {

  attributes:IAttribute[] = [];
  attributeIDs:IAttribute[] = [];
  attribute: IAttribute[];
  isAttributeDetailCalled: boolean = false;
  attributeForm: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  isCustomModalOpen: boolean = false;
  @ViewChild("focusElem") focusTag: ElementRef;
  attributeGroups: IAttributeGroup[];
  updateAttributeRequest: IAttributeUpdate;
  displayedColumns: string[] = ['attributeID', 'description', 'attributeGroup', 'value', 'updateid'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private attributeService: AttributeService, private fb: FormBuilder,
    private alertService: AlertService,
    private datePipe: DatePipe) { }
  
  ngOnInit() {
    this.getAllAttributes();
    this.initAttributeForm();
  }
  initAttributeForm() {
    this.attributeForm = this.fb.group({
      attributeID: "",
      attributeGroupID: [0, Validators.required],
      description: ['', Validators.required],
      value: ['', Validators.required],
      createdid: "ash",
      createdOn: "2021-01-10",
      updateid: "sftr",
      lastupdate: "2021-02-10"
    });
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
  getAttributeGroup(){
    this.attributeService.getAttributeGroups().subscribe((data:IAttributeGroup[])=>{
        this.attributeGroups = data;
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
  get f() { return this.attributeForm.controls; }
  openCustomModal(open: boolean, id:string) {
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100);    
    this.getAttributeGroup();
    this.submitted = false;
    this.loading = false;
    if(open && id==null){
      this.isAddMode = true;
    }
    this.isCustomModalOpen = open;
    if (!open && id==null) {
      this.getAllAttributes();
      this.attributeForm.reset();
      this.isAddMode = false;
    }
    console.log("id inside modal: "+id);
    
    if(id!=null && open){
      this.isAddMode = false;
        this.attributeService.getAttribute(id)
        .pipe(first())
        .subscribe(x => {
          this.attribute = x;
          console.log(x[0].description);
          console.log(x[0].attributeGroupID);
          
          this.attributeForm.patchValue({ 
            attributeID: x[0].attributeID,
            attributeGroupID: Number(x[0].attributeGroupID),
            description: x[0].description,
            value: x[0].value
          });         
        }
      )
    }
  }

onSubmit() {
  this.submitted = true;

  // reset alerts on submit
  this.alertService.clear();

  // stop here if form is invalid
  if (this.attributeForm.invalid) {
      return;
  }

  this.loading = true;
  if (this.isAddMode) {
      this.addAttribute();
  } else {
      this.updateAttribute();
      
  }
}

private addAttribute() {
this.attributeForm.patchValue({    
  attributeGroupID: Number(this.attributeForm.get("attributeGroupID").value),
  createdid: "ash",
  createdOn: "2021-01-10",
  updateid: "sftr",
  lastupdate: "2021-02-10"
});
 
this.attributeService.addAttribute(this.attributeForm.value)
    .pipe(first())
    .subscribe({
        next: () => {
                     
          this.openCustomModal(false, null); 
            this.alertService.success('New Attribute added', { keepAfterRouteChange: true });
            //this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: error => {
            this.alertService.error(error);
            this.loading = false;
        }
    });
    
}

private updateAttribute() {
   
  this.updateAttributeRequest = {
    attributeId: this.attribute[0].attributeID,
    attributeGroupID: Number(this.f.attributeGroupID.value),
    description: this.f.description.value,
    value: this.f.value.value,
    createdid: this.attribute[0].createdid,
    createdOn: this.datePipe.transform(this.attribute[0].createdOn,"yyyy-MM-dd"),
    updateid: "sftr",
    lastupdate: this.datePipe.transform(this.attribute[0].lastupdate,"yyyy-MM-dd")
  }

    this.attributeService.updateAttribute(this.updateAttributeRequest)
        .pipe(first())
        .subscribe({
            next: () => {
                
                this.openCustomModal(false,null);                  
                this.alertService.success('Attribute updated', { 
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
