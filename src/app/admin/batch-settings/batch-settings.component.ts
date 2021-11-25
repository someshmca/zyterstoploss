import { Component, OnInit, AfterViewInit, ViewChild, ElementRef  } from '@angular/core';
import { IBatchDetails,IAllBatchIDs,IBatchStatus, IBatchHistoryDetails, IBatchPAdd, IBatchPAddSuccess, IBatchPUpdate, IBatchPUpdateSuccess} from '../models/Batch-Settings.model';
import {BatchSettingService} from '../services/batch-setting.service';
import { FormGroup, FormArray, FormBuilder,
  Validators,FormControl  } from '@angular/forms';
  import {MatPaginator} from '@angular/material/paginator';
  import {MatTableDataSource} from '@angular/material/table';
  import { MatSort } from '@angular/material/sort';
  import { first } from 'rxjs/operators';
  import { formatDate, DatePipe } from '@angular/common';
  import { AlertService } from '../services/alert.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { LoaderService } from '../services/loader.service';//added by Venkatesh Enigonda
@Component({
  selector: 'app-batch-settings',
  templateUrl: './batch-settings.component.html',
  styleUrls: ['./batch-settings.component.css'],
  providers: [DatePipe]
})
export class BatchSettingsComponent implements OnInit {
  batchStatusList: IBatchStatus[] = [];
  allBatchIDDetails: IBatchDetails[] = [];
  batchDetails: IBatchDetails;  
  batchHistroyDetails:IBatchHistoryDetails;
  allBatchHistroyDetails:IBatchHistoryDetails[];
  //showHistory: boolean = false;
  //showNoHistoryRecords: boolean = false;
  isHistoryPresent: boolean = false;
  isHistoryNotPresent: boolean = false;

  batchProcessForm: FormGroup;

  locBatchProcessID: boolean = false;

  isStartDemandModalOpen: boolean = false;
  locLastRunStatus: string;
  isLoading:boolean=true;
  
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  loadStop=true;
  isCustomModalOpen: boolean = false;
  fLastRun: any = '';
  updateBatchObj: IBatchPUpdate;
  uBatchProcessId: number;
  uBatchProcess;//(V.E 27-Jul-2021 )
  ulastRun: string;  
  uCreatedOn: any;
  batchIdStatus; //(V.E 27-Jul-2021 )
  batchIdErr={isValid: false, errMsg:''};//(V.E 27-Jul-2021 )
  historyStatus='';
  allBatchFailedDetails:any[]=[];
  batchRow:any;
  isFailedNotPresent:boolean;

 
  @ViewChild("focusElem") focusTag: ElementRef;
  show: boolean=true;
  noRecsFoundBatchDetails: boolean = false;
  selectedStatus: string = '';

  batchProcessColumns: string[] = ['batchProcess', 'description', 'status', 'lastRun','lastRunStatus','nextScheduleRun','frequency', 'batchType', 'createId','batchProcessId'];
  //batchProcessColumns: string[] = ['batchProcess', 'description', 'status', 'lastRun','lastRunStatus','nextScheduleRun','frequency','batchProcessId', 'batchStatusId','createId','createDate', 'updateId','lastUpdateDate'];
  batchProcessGridSource: any;
  isDisabled: boolean=false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild('BatchProcessPaginator', {static: true}) batchProcessPaginator: MatPaginator;
  // @ViewChild('BatchProcessGridSort', {static: true}) batchProcessGridSort: MatSort;
  @ViewChild('BatchProcessPaginator') public batchProcessPaginator: MatPaginator;
  @ViewChild('BatchProcessGridSort') public batchProcessGridSort: MatSort;

  
  
  historyGridColumns: string[] = ['started', 'completed', 'scheduled', 'failed','failedReason'];
  historyGridSource: any;
  // @ViewChild(MatPaginator) paginator2: MatPaginator;
  // @ViewChild(MatSort) sort2: MatSort;
  // @ViewChild('HistoryGridPaginator', {static: true}) historyGridPaginator: MatPaginator;
  // @ViewChild('HistoryGridSort', {static: true}) historyGridSort: MatSort;

  @ViewChild('HistoryGridPaginator') public historyGridPaginator: MatPaginator;
  @ViewChild('HistoryGridSort') public historyGridSort: MatSort;

  selectedRow : Number; 
  isViewModal: boolean;
  isAdmin: boolean;
  fetchBatchDetailsOld: any;
  fetchBatchDetailsNew: any;
  updateNoChange= {flag: false, message: ''}
  
  //setClickedRow : Function;
  constructor(private batchSettingService: BatchSettingService,public loaderService: LoaderService, private fb: FormBuilder, private alertService: AlertService, private datePipe: DatePipe, private loginService: LoginService) { 
    
    
  }
  ngOnInit(): void {    
    this.getBatchStatusList();
    this.listBatchProcessGrid();
    this.initBatchProcessForm();
    this.loginService.getLoggedInRole();
    this.isAdmin = this.loginService.isAdmin;
    
  }
  getBatchStatusList(){
    
    this.batchSettingService.getBatchStatusList().subscribe(
      (data: IBatchStatus[]) => {          
         this.batchStatusList = data;  
         console.log(this.batchStatusList[1].batchStatus)
        this.locLastRunStatus = this.batchStatusList[1].batchStatus;
      }
    );
  }
  

  //(V.E 27-Jul-2021 starts)
  clearErrorMessages(){
    this.batchIdErr.isValid=false;
    this.batchIdErr.errMsg='';
    this.updateNoChange= {flag: false, message: ''}
    this.isFailedNotPresent=false;
  }
 
  showRowHistory(row, index){
    this.clearErrorMessages();
   
    
    this.selectedRow = index;
    this.batchRow=row;
    console.log("row : "+row.batchProcessId); 
    this.isHistoryPresent = false;
    this.isHistoryNotPresent = false; 
    

      this.batchSettingService.getBatchHistoryProcessDetails(row.batchProcessId).subscribe(
        (data:IBatchHistoryDetails[]) => { 
          console.log(data.length);
          this.allBatchHistroyDetails = data; 
          if(data.length>0){
              this.allBatchHistroyDetails = data; 
              console.log(this.allBatchHistroyDetails);
             
              this.isHistoryPresent = true;  
            
              // if(this.historyStatus=="Failed")  
              // {
              //   for (let i = 0; i <= data.length - 1; i++) {
              //     if(data[i].failed != null)
              //     {
              //       this.allBatchFailedDetails.push(data[i]);
              //     }
               
                  //this.pageCount = this.names.length;
                 
              // }
              console.log(this.historyStatus);
             
              setTimeout(() =>{  
                this.historyGridSource = new MatTableDataSource(this.allBatchHistroyDetails);
                  this.historyGridSource.paginator = this.historyGridPaginator;
                  this.historyGridSource.sort = this.historyGridSort; 
                }, 500);
              
            // }
            // else 
            // {
            //   setTimeout(() =>{  
            //     this.historyGridSource = new MatTableDataSource(this.allBatchHistroyDetails);
            //       this.historyGridSource.paginator = this.historyGridPaginator;
            //       this.historyGridSource.sort = this.historyGridSort; 
            //     }, 500);

            // }
             
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
  changeHistorySelect(event){
    this.clearErrorMessages()
    this.allBatchFailedDetails.length=0;
    this.locBatchProcessID = this.batchRow.batchProcessId;

    this.historyStatus=event.target.value;
    console.log(this.historyStatus)
    console.log(this.selectedRow);
    console.log(this.batchRow)
    
    if(this.allBatchHistroyDetails.length>0){
      
      console.log(this.allBatchHistroyDetails);
     
      this.isHistoryPresent = true;  

      if(this.historyStatus=="Failed")  
      {
       
        for (let i = 0; i <= this.allBatchHistroyDetails.length - 1; i++) {
          if(this.allBatchHistroyDetails[i].failed != null)
          {

            this.allBatchFailedDetails.push(this.allBatchHistroyDetails[i]);
            this.isFailedNotPresent=false;
           
          }
          

          // else if(this.allBatchHistroyDetails[i].failed != null)
          // {
          //   this.isFailedNotPresent=true;
          // }
       
          //this.pageCount = this.names.length;
         
      }
      if(this.allBatchFailedDetails.length >=1)
      {
        this.isFailedNotPresent=false;
      }
      else{
        this.isFailedNotPresent=true;

      }
      setTimeout(() =>{  
        this.historyGridSource = new MatTableDataSource(this.allBatchFailedDetails);
          this.historyGridSource.paginator = this.historyGridPaginator;
          this.historyGridSource.sort = this.historyGridSort; 
      
        }, 500);
    }
    else
    {
    
      setTimeout(() =>{  
        this.historyGridSource = new MatTableDataSource(this.allBatchHistroyDetails);
          this.historyGridSource.paginator = this.historyGridPaginator;
          this.historyGridSource.sort = this.historyGridSort; 
     
        }, 500);

    }
   
     
    }
    else{              
      this.isHistoryNotPresent=true;
      this.locBatchProcessID = this.batchRow.batchProcessId;
    }

    

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
    this.getBatchStatusList();
    this.listBatchProcessGrid();
    this.isHistoryPresent = false;
    this.isHistoryNotPresent = false;
  }
  startDemand(elem, batchType){
    console.log(batchType);
    
    let batchid=elem.batchProcessId;
    let userid= this.loginService.currentUserValue.emailID;
    let startDate = this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd, h:mm:ss');
    let lastRunTime = this.datePipe.transform(elem.lastRun, 'yyyy-MM-dd, h:mm:ss');
    let frequency = elem.frequency;
    let nextScheduleRun = "";
    this.isStartDemandModalOpen = true;
    this.batchSettingService.calculateOnStart(batchid,userid,startDate,lastRunTime,frequency,nextScheduleRun,batchType).subscribe(
      (data)=>{        
        
        console.log(data);
      }, (error) => {
        console.log("Start Demand Error : "+error.message);
      }
    )
  }
  openStartDemandModal(open: boolean) {
    this.isStartDemandModalOpen = open;
  }
  initBatchProcessForm() {
    this.batchProcessForm = this.fb.group({
      batchProcessId: 1,
      batchProcess: ['', Validators.required],
      description: ['', Validators.required],
      status: '',
      lastRunStatus: "Completed",
      lastRun: '',
      nextScheduleRun: ['',Validators.required],
      frequency: "Daily",
      createId: '',
      createDate: '',
      updateId: '',
      lastUpdateDate: '',
      batchType:"ASL",
      statusFail:'',
    });
  }
  getBatchDetails(statusVal){  
    this.isFailedNotPresent=false; 
    let status: string = this.batchStatusList[statusVal-1].batchStatus;   
    console.log(status);
    console.log(this.batchStatusList[statusVal]);
    
    this.noRecsFoundBatchDetails = false;
    this.batchSettingService.getBatchProcessDetails(status).subscribe(
      (data: IBatchDetails[]) => {   
            console.log(data.length);
            
            if(data.length==0){
              this.noRecsFoundBatchDetails=true;
              this.selectedStatus = status;
            }
            if(status=='All'||'Completed'||'Running'||'InActive'||'ACtive') // Starts here Modified by Venkatesh Enigonda    
            {
              this.isHistoryPresent = false;
              this.isHistoryNotPresent=false;

            } // Ends Here  
            
         this.allBatchIDDetails = data;    
         this.batchProcessGridSource = new MatTableDataSource(this.allBatchIDDetails);
          this.batchProcessGridSource.paginator = this.batchProcessPaginator;
         this.batchProcessGridSource.sort = this.batchProcessGridSort;            
      }
    ); 
  }
  
  get f() { return this.batchProcessForm.controls; }
   
  openViewModal(bool, id:any){
    this.isViewModal = true;
    this.openCustomModal(bool, id);
  }
  openCustomModal(open: boolean, id:string) {

   setTimeout(()=>{
     this.focusTag.nativeElement.focus()
   }, 100);
    this.submitted = false;
    this.isDisabled=false;
    this.loadStop=true;
    this.clearErrorMessages();//(V.E 27-Jul-2021 )
    this.loading = false;
    if(open && id==null){
      this.batchProcessForm.patchValue({        
        lastRunStatus: "Completed",
        frequency: "Daily",
        batchType:"ASL",
        lastRun: this.datePipe.transform(new Date('02/25/2021'), 'yyyy-MM-dd')
      });
      this.isAddMode = true;   
      this.isViewModal=false;
      this.batchProcessForm.enable();
    }
    this.isCustomModalOpen = open;
    if (!open && id==null) {
     this.listBatchProcessGrid();
      this.batchProcessForm.reset();
      this.isAddMode = false;
      this.isViewModal=false;
    }
    console.log("id inside modal: "+id);
    
    if(id!=null && open){
      this.isAddMode = false;
      let elem:any = id;
      console.log(id);
      this.uBatchProcessId = elem.batchProcessId;
      this.ulastRun = this.datePipe.transform(elem.lastRun, 'yyyy-MM-dd');
      this.uCreatedOn = this.datePipe.transform(new Date('02/25/2021'), 'yyyy-MM-dd');
      
      this.batchProcessForm.patchValue({
        batchProcess: elem.batchProcess,
        description: elem.description,
        status: elem.batchStatusId,
        lastRun: this.ulastRun,
        lastRunStatus: elem.lastRunStatus,
        nextScheduleRun: this.datePipe.transform(elem.nextScheduleRun, 'yyyy-MM-dd'),
        frequency: elem.frequency,
        batchType:elem.batchType
      });      
      
      // this.batchProcessForm.patchValue({        
      //   lastRunStatus: this.f.lastRunStatus.value==''?'Completed':this.f.lastRunStatus.value,
      //   frequency: this.f.frequency.value==''?'Daily':this.f.frequency.value,
      //   batchType:this.f.batchType.value==''?'ASL':this.f.batchType.value
      // });
      if(this.isViewModal==true){
        this.batchProcessForm.disable();
      }
      else{
        this.batchProcessForm.enable();
      }
      console.log(this.batchProcessForm.value);
      
      //(V.E 27-Jul-2021 starts).
      this.uBatchProcess=this.f.batchProcess.value;
      console.log(this.uBatchProcess);
      this.fetchBatchDetailsOld=this.batchProcessForm.value;
      //(V.E 27-Jul-2021 Ends)
    }
  }
  
 
  onSubmit() {
    this.clearErrorMessages();//(V.E 27-Jul-2021)
    this.submitted = true;
    this.loadStop=false;


    // reset alerts on submit
    this.alertService.clear();

    // stop here if form is invalid
    if (this.batchProcessForm.invalid) {
        return;
    }
    //(V.E 27-Jul-2021 starts)
    
    if (!this.isAddMode) {
      console.log(this.uBatchProcess.toLowerCase());
      console.log(this.f.batchProcess.value.toLowerCase());
      if(this.uBatchProcess.toLowerCase()!== this.f.batchProcess.value.toLowerCase())
      {
      
      
          this.batchSettingService.checkDuplicateBatchId(this.f.batchProcess.value).subscribe(id=>
            {
              console.log(id);
               if(id>0)
              {
                this.batchIdErr.isValid=true;
                this.batchIdErr.errMsg="The Batch Process "+this.f.batchProcess.value+" already exists. Please enter different Batch Process";
                return;

              }
              else{

                this.updateBatchProcess();
              }
              
        })
      }else  {
        this.updateBatchProcess();
      }
}


    this.loading = true;
    if (this.isAddMode) 
    {
      this.batchSettingService.checkDuplicateBatchId(this.f.batchProcess.value).subscribe(id=>
        {
          if(id>0)
          {
            this.batchIdErr.isValid=true;
            this.batchIdErr.errMsg="The Batch Process "+this.f.batchProcess.value+" already exists. Please enter different Batch Process"
            return;

          }
          this.addBatchProcess();


         })


    }
    
    
}
//(V.E 27-Jul-2021 Ends )
private addBatchProcess() {
  this.isDisabled=true;
  this.isHistoryPresent = false; // Modified by Venkatesh Enigonda
  this.isHistoryNotPresent=false; // Modified by Venkatesh Enigonda
  
  console.log(this.batchStatusList.length);
  console.log(this.batchStatusList[2].batchStatus);
  console.log(this.f.status.value);
  console.log(this.f.status);
  let nextScheduleRunValue = this.f.nextScheduleRun.value == ""? this.datePipe.transform(new Date('04/04/2021'), 'yyyy-MM-dd'):this.datePipe.transform(this.f.nextScheduleRun.value, 'yyyy-MM-dd');
  let addBatchObj:IBatchPAdd = {
    batchProcessId: 0,
    batchProcess: this.f.batchProcess.value,
    description: this.f.description.value,
    status: '',
    batchStatusId: 1,
    lastRun: this.datePipe.transform(new Date('02/25/2021'), 'yyyy-MM-dd'),
    lastRunStatus: 'Active',
    nextScheduleRun: nextScheduleRunValue,
    frequency: this.f.frequency.value,
    createId: this.loginService.currentUserValue.name,
    createDate: this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd'),
    updateId: this.loginService.currentUserValue.name,  
    lastUpdateDate: this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd'),
    batchType:this.f.batchType.value
  }
  
  this.batchSettingService.addBatchProcess(addBatchObj)
      .pipe(first())
      .subscribe({
          next: () => {
            this.listBatchProcessGrid();
            this.openCustomModal(false, null);
            
            this.batchProcessForm.reset();                
             this.alertService.success('New Batch Process added', { keepAfterRouteChange: true });
             //this.router.navigate(['../'], { relativeTo: this.route });
          },
          error: error => {
              this.alertService.error(error);
              this.loading = false;
          }
      });
      
  }

  private updateBatchProcess() {
  
    this.isHistoryPresent = false; // Modified by Venkatesh Enigonda
    this.isHistoryNotPresent=false; // Modified by Venkatesh Enigonda
    
  let nextScheduleRunValue = this.f.nextScheduleRun.value == ""? this.datePipe.transform(new Date('04/04/2021'), 'yyyy-MM-dd'):this.datePipe.transform(this.f.nextScheduleRun.value, 'yyyy-MM-dd');
  
    this.updateBatchObj = {
      batchProcessId: this.uBatchProcessId,
      batchProcess: this.f.batchProcess.value,
      description: this.f.description.value,
      batchStatusId: 1,
      lastRun: this.datePipe.transform(this.f.lastRun.value, 'yyyy-MM-dd'),
     // lastRunStatus: this.batchStatusList[this.f.lastRunStatus.value].batchStatus,
      lastRunStatus: this.f.lastRunStatus.value,
      nextScheduleRun: nextScheduleRunValue,
      frequency: this.f.frequency.value,
      createId: this.loginService.currentUserValue.name,
      createdOn: this.uCreatedOn,
      updateId: this.loginService.currentUserValue.name,  
      lastUpdateDate: this.datePipe.transform(new Date(Date.now()), 'yyyy-MM-dd'),
      batchType: this.f.batchType.value
    }
    this.fetchBatchDetailsNew = this.batchProcessForm.value;
        if(JSON.stringify(this.fetchBatchDetailsOld) == JSON.stringify(this.fetchBatchDetailsNew) ){
          
          this.updateNoChange.flag=true;
          this.updateNoChange.message="No Values updated. Update atleast one value to update";
          return;
        }
    console.log(this.updateBatchObj);
    
      this.batchSettingService.updateBatchProcess(this.updateBatchObj)
          .pipe(first())
          .subscribe({
              next: () => {                
                  this.openCustomModal(false,null); 
                  this.batchProcessForm.reset();
                  this.uBatchProcess=''; //(V.E 27-Jul-2021 )
                  this.listBatchProcessGrid();
                  this.alertService.success('Batch Process updated', { 
                    keepAfterRouteChange: true });
                 // this.router.navigate(['../../'], { relativeTo: this.route });
                 this.isDisabled=true;
                  
              },
              error: error => {
                  this.alertService.error(error);
                  this.loading = false;
              }
          });
  }
 
}
