import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { IProgram, IProgramIDRequest,
  IProgramAdd, IAddProgramSuccess,
  IProgramUpdate, IUpdateProgramSuccess} from '../models/programs-model';
  
import { AlertService } from '../services/alert.service';
import { DatePipe } from '@angular/common';

import {ProgramService} from '../services/program.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css'],
  providers: [DatePipe]
})
export class ProgramsComponent implements OnInit {
  isAddMode: boolean;
  loading = false;
  id: string;
  submitted = false;
  programs:IProgram[] = [];
  programForm: FormGroup;
  programIDs:IProgram[] = [];
  program: IProgramIDRequest;
  isProgramDetailCalled: boolean = false;
  isCustomModalOpen: boolean = false;


  displayedColumns: string[] = ['programId', 'description', 'updateid'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(private programService: ProgramService, private fb: FormBuilder, private alertService: AlertService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.getAllPrograms();
    this.programForm = this.fb.group({
      programId: "",
      description: ['', Validators.required],
      createid: "ash",
      createdOn: "2011-01-01",
      updateid: "som",
      lastupdate: new Date("2020-12-11")
    });
  }
  getAllPrograms(){    
    this.programService.getAllPrograms().subscribe(
      (data: IProgram[]) => {
          this.programIDs = data;
          this.programs = data;
          this.dataSource = new MatTableDataSource(this.programs);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      }
    )
  } 
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  get f() { return this.programForm.controls; }
  openCustomModal(open: boolean, id:string) {
    this.submitted = false;
    if(open && id==null){
      this.isAddMode = true;
    }
    this.isCustomModalOpen = open;
    if (!open) {
      this.programForm.reset();
      this.isAddMode = false;
    }
    console.log("id inside modal: "+id);
    
    if(id!=null){
      this.isAddMode = false;
      this.programService.getProgram(id).subscribe(x => {
        console.log(x[0].programId);
            this.programForm.patchValue({
              programId: x[0].programId,
              description: x[0].description
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
      if (this.programForm.invalid) {
          return;
      }

      this.loading = true;
      if (this.isAddMode) {
          this.addProgram();
      } else {
          this.updateProgram();
      }
  }

  private addProgram() {
      this.programService.addProgram(this.programForm.value)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.getAllPrograms();
                  this.openCustomModal(false, null);
                  this.programForm.reset();
                  this.alertService.success('New Program added', { keepAfterRouteChange: true });
              },
              error: error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
          });
  }

  private updateProgram() {
      this.programService.updateProgram(this.programForm.value)
          .pipe(first())
          .subscribe({
              next: () => {
                  this.alertService.success('Program updated', { 
                    keepAfterRouteChange: true });
                    this.getAllPrograms();
                    this.openCustomModal(false,null); 
                    this.programForm.reset();
              },
              error: error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
          });
  }
}
