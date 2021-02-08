import { Component, OnInit, AfterViewInit, ViewChild  } from '@angular/core';
import { IBatchDetails,IAllBatchIDs,IBatchStatus, IBatchHistoryDetails, IBatchPAdd, IBatchPAddSuccess, IBatchPUpdate, IBatchPUpdateSuccess} from '../models/Batch-Settings.model';
import {BatchSettingService} from '../services/batch-setting.service';
import { FormGroup, FormArray, FormBuilder,
  Validators,FormControl  } from '@angular/forms';
  import {MatPaginator} from '@angular/material/paginator';
  import {MatTableDataSource} from '@angular/material/table';
  import { MatSort } from '@angular/material/sort';
  import {DatePipe} from '@angular/common'
@Component({
  selector: 'app-batch-settings',
  templateUrl: './batch-settings.component.html',
  styleUrls: ['./batch-settings.component.css'],
  providers: [DatePipe]
})
export class BatchSettingsComponent implements OnInit {
  allBatchStatus: IBatchStatus[] = [];
  allBatchIDDetails: IBatchDetails[] = [];
  batchDetails: IBatchDetails;  
  batchHistroyDetails:IBatchHistoryDetails;
  allBatchHistroyDetails:IBatchHistoryDetails[];
  //showHistory: boolean = false;
  //showNoHistoryRecords: boolean = false;
  isHistoryPresent: boolean = false;
  isHistoryNotPresent: boolean = false;

  locBatchProcessID: boolean = false;

  isStartDemandModalOpen: boolean = false;

  isAddBatchPModalOpen: boolean = false;
  isNewBatchPAdded: boolean = false;
  isAddBatchPSubmitted: boolean = false;
  addBatchPForm: FormGroup;
  addBatchPRequest: IBatchPAdd ;
  addBatchPResponse: IBatchPAddSuccess;

  isUpdateBatchPModalOpen: boolean = false;
  isBatchPUpdated: boolean = false;
  isUpdateBatchPSubmitted: boolean = false;
  updateBatchPForm: FormGroup;
  updateBatchPRequest: IBatchPUpdate ;
  updateBatchPResponse: IBatchPUpdateSuccess;
  uBatchProcessId: number;

  batchProcessColumns: string[] = ['batchProcess', 'description', 'status', 'lastRun','lastRunStatus','nextScheduleRun','frequency','batchProcessId','updateId'];
  batchProcessGridSource: any;
  @ViewChild(MatPaginator) paginator1: MatPaginator;
  @ViewChild(MatSort) sort1: MatSort;
  @ViewChild('BatchProcessPaginator', {static: true}) batchProcessPaginator: MatPaginator;
  @ViewChild('BatchProcessGridSort', {static: true}) batchProcessGridSort: MatSort;

  
  historyGridColumns: string[] = ['started', 'completed', 'scheduled', 'failed','failedReason'];
  historyGridSource: any;
  // @ViewChild(MatPaginator) paginator2: MatPaginator;
  // @ViewChild(MatSort) sort2: MatSort;
  @ViewChild('HistoryGridPaginator', {static: true}) historyGridPaginator: MatPaginator;
  @ViewChild('HistoryGridSort', {static: true}) historyGridSort: MatSort;

  selectedRow : Number;
  //setClickedRow : Function;
  constructor(private batchSettingService: BatchSettingService,private fb: FormBuilder, public datePipe: DatePipe) { 
    
    
  }
  ngOnInit(): void {    
    this.getBatchSelectDropdown();
    this.listBatchProcessGrid();
    this.initAddBatchProcess();
    this.initUpdateBatchProcess();
    
  }
  getBatchSelectDropdown(){
    this.batchSettingService.getBatchStatusList().subscribe(
      (data: IBatchStatus[]) => {          
         this.allBatchStatus = data;      
      }
    );
  }
  showRowHistory(row, index){
    this.selectedRow = index;
    console.log("row : "+row.batchProcessId); 
    this.isHistoryPresent = false;
    this.isHistoryNotPresent = false;  
      this.batchSettingService.getBatchHistoryProcessDetails(row.batchProcessId).subscribe(
        (data:IBatchHistoryDetails[]) => { 
          console.log(data.length);
          if(data.length>0){
              this.allBatchHistroyDetails = data; 
              this.isHistoryPresent = true;    
              setTimeout(() =>{  
              this.historyGridSource = new MatTableDataSource(this.allBatchHistroyDetails);
                this.historyGridSource.paginator = this.historyGridPaginator;
                this.historyGridSource.sort = this.historyGridSort; 
              }, 500);
            }
            else{              
              this.isHistoryNotPresent=true;
              this.locBatchProcessID = row.batchProcessId;
            }
        },(error)=>{
          this.isHistoryNotPresent=true
        }
      ); 
  }
  listBatchProcessGrid(){    
    this.batchSettingService.getBatchProcessDetails('All').subscribe(
      (data: IBatchDetails[]) => {       
         this.allBatchIDDetails = data;   
         this.batchProcessGridSource = new MatTableDataSource(this.allBatchIDDetails);
         this.batchProcessGridSource.paginator = this.batchProcessPaginator;
         this.batchProcessGridSource.sort = this.batchProcessGridSort;             
      }
    ); 
  }
  refreshBatchProcess(){
    this.getBatchSelectDropdown();
    this.listBatchProcessGrid();
    this.isHistoryPresent = false;
    this.isHistoryNotPresent = false;
  }
  startDemand(elem){
    let batchid=elem.batchProcessId;
    let userid='admin@infinite.com';
    let startDate = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd, h:mm:ss');
    let lastRunTime = this.datePipe.transform(elem.lastRun, 'yyyy-MM-dd, h:mm:ss');
    let frequency = elem.frequency;
    let nextScheduleRun =this.datePipe.transform(elem.nextScheduleRun, 'yyyy-MM-dd, h:mm:ss');
    //debugger;
    this.isStartDemandModalOpen = true;
    this.batchSettingService.calculateOnStart(batchid,userid,startDate,lastRunTime,frequency,nextScheduleRun).subscribe(
      (data)=>{
        
        console.log(data);
      // debugger;
      }, (error) => {
        console.log("Start Demand Error : "+error.message);
       //debugger;
      }
    )
  }
  openStartDemandModal(open: boolean) {
    this.isStartDemandModalOpen = open;
  }
  initAddBatchProcess() {
    this.addBatchPForm = this.fb.group({
      batchProcess: "",
      description: "",
      status: "",
      lastRunStatus: "Active",
      lastRun: new Date("2020-12-11"),
      nextScheduleRun: new Date("2020-12-11"),
      frequency: ""
    });
    
    // let dp = new DatePipe(navigator.language);
    // let p = 'y-MM-dd';
    // let dtr = dp.transform(new Date(), p );
    // this.addBatchPForm.setValue({lastRun: dtr});
  }
  openAddBatchPModal(open: boolean) {
    this.isAddBatchPModalOpen = open;
    this.isNewBatchPAdded = false;
    if (!open) {
      this.isNewBatchPAdded = false;
      this.addBatchPForm.reset();
    }
  }
  getBatchDetails(status: string){      
    this.batchSettingService.getBatchProcessDetails(status).subscribe(
      (data: IBatchDetails[]) => {       
         this.allBatchIDDetails = data;    
         this.batchProcessGridSource = new MatTableDataSource(this.allBatchIDDetails);
         this.batchProcessGridSource.paginator = this.batchProcessPaginator;
         this.batchProcessGridSource.sort = this.batchProcessGridSort;            
      }
    ); 
  }

  addBatchProcess(form: FormGroup){
    this.addBatchPRequest = {
      batchProcess: this.addBatchPForm.get("batchProcess").value,
      description: this.addBatchPForm.get("description").value,
      status: this.addBatchPForm.get("status").value,
      nextScheduleRun: this.addBatchPForm.get("nextScheduleRun").value,
      frequency: this.addBatchPForm.get("frequency").value,
      createId: "",
      createDate: new Date("2020-12-11")
    };
    this.batchSettingService.addBatchProcess(this.addBatchPRequest).subscribe(
      (data: IBatchPAddSuccess) => {
        
        console.log("Add Batch Process data : " + data);        
        console.log("Add Batch Process Response : " + data.message);
        
        this.listBatchProcessGrid();
         this.openAddBatchPModal(false);
         this.isNewBatchPAdded = true;
      }
    )
  }
  initUpdateBatchProcess() {
    this.updateBatchPForm = this.fb.group({
      batchProcess: "",
      description: "",
      status: "",
      lastRunStatus: "Active",
      lastRun: new Date("2020-12-11"),
      nextScheduleRun: new Date("2020-12-11"),
      frequency: ""
    });
  }
  openUpdateBatchPModal(elem, open: boolean) {
    this.isUpdateBatchPModalOpen = open;    
    this.isBatchPUpdated = false;
    if(open){
      this.uBatchProcessId = elem.batchProcessId;
      //capture the current row value on form using ben object
      if (elem != null) {
        this.updateBatchPForm = this.fb.group({
          batchProcess: [elem.batchProcess],
          description: [elem.description, Validators.required],
          status: elem.status,
          lastRunStatus: elem.lastRunStatus,
          lastRun: elem.lastRun,
          nextScheduleRun: elem.nextScheduleRun,
          frequency: elem.frequency,
          createid: [elem.createid],
          createdby: [elem.createdby],
          updateid: [elem.updateid],
          lastupdate: [elem.lastupdate]
        });
      }      
    }
    else{
      this.isBatchPUpdated = false;
      this.isUpdateBatchPModalOpen = false;
      this.updateBatchPForm.reset();
    }
  }
  updateBatchProcess(form: FormGroup){
    this.updateBatchPRequest = {
      batchProcessId: this.uBatchProcessId, 
      batchProcess: this.updateBatchPForm.get("batchProcess").value,
      description: this.updateBatchPForm.get("description").value,
      status: this.updateBatchPForm.get("status").value,
      nextScheduleRun: this.updateBatchPForm.get("nextScheduleRun").value,
      frequency: this.updateBatchPForm.get("frequency").value,
      createId: "",
      createDate: new Date("2020-12-11"),
      updateId: "",
      lastUpdateDate: new Date("2020-12-11")
    };
    this.batchSettingService.updateBatchProcess(this.updateBatchPRequest).subscribe(
      (data: IBatchPUpdateSuccess) => {
        
        console.log("Update Batch Process Response  " + data);        
        
        this.listBatchProcessGrid();
         this.openUpdateBatchPModal(null, false);
        this.isBatchPUpdated = true;
      }
    )
  }
}
