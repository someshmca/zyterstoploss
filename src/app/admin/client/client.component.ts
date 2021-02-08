import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import {IClient, IClientIDRequest, IClientAdd, IClientAddSuccess, IClientUpdate, IClientUpdateSuccess} from '../models/clients-model';
import {IContract} from '../models/contracts-model';
import {ClientsService} from '../services/clients.service';
import {ContractService} from '../services/contract.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {DatePipe} from '@angular/common'
let dp = new DatePipe(navigator.language);
let p = 'y-MM-dd'; // YYYY-MM-DD
@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  
  displayedColumns: string[] = ['clientId', 'description', 'updateid'];
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private clientsService: ClientsService, private fb: FormBuilder, private contractService: ContractService) { }
  
  clients:IClient[] = [];
  clientIDs: IClient[] = [];
  client: IClientIDRequest;
  singleClient: IClient[] = [];

  clientAddRequest: IClientAdd;
  clientUpdateRequest: IClientUpdate;

  contractIDs: IContract[];

  //isRowClicked: boolean = false;
  isAddClientSuccess: boolean = false;

  isClientAddOpen: boolean = false;
  clientAddForm: FormGroup;

  clientUpdateForm: FormGroup;
  isClientUpdateSuccess:  boolean=false;
  isUpdateClientSuccess: boolean = false;
  isClientUpdateOpen: boolean = false;
  clientInfo = {
    id: '',
    cname: '',
    contrid: '',
    desc: ''
  };

  ngOnInit() {
    this.getAllClients();
    this.getAllContracts();
    this.clientAddFormInit();
    this.clientUpdateFormInit();
  }
  
  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }  

  clientAddFormInit(){    
    this.clientAddForm = this.fb.group({   
      clientName:  "",
      contractId:  "",
      description: "",
      isActive: false,
      createdId: "somesh",
      createdBy: new Date("2009-12-12"),
      updatedId: "ashwani",
      lastUpdate: new Date("2020-12-12"),
      deductible: 10,
      individualDeductible: 10.00,
      laserAmount: 0,
      start:new Date("2020-11-17"),
      end:new Date("2020-11-17"),
      asl:"",
      contractType: '12/12', 
      runIn:0,  
      runOut:0,
      corridor:"",
      maxAttachmentPoint:10,
      coveredBenefit:"",
      attachmentPoint:"",
      paid:false,
      monthlyAccomodation:false,
      terminalLiability:false,
      retireesInclude:false,
      annualMaximum:1000,
      lifetimeMaximum:100,
      specificLaser:false,
      unlimited:false,
      contract:false,
      familySpecificDeductibles:false,
      expectedRefund:false,
      monthlyClaimAmount: 0,
      numOfEmployee: 0
    });    
  }
  clientUpdateFormInit(){      
    this.clientUpdateForm = this.fb.group({ 
      clientName:  "",
      contractId: "",  
      description:  "",
      isActive: false,
      createdId: "somesh",
      createdBy: new Date("2009-12-12"),
      updatedId: "ashwani",
      lastUpdate: new Date("2020-12-12"),
      deductible: 10,
      individualDeductible: 10.00,
      laserAmount: 0,
      start:new Date("2020-11-17"),
      end:[new Date("2020-11-17")],
      asl:"",
      runIn:0,
      runOut:0,
      corridor:"",
      maxAttachmentPoint:10,
      coveredBenefit:"",
      attachmentPoint:"",
      paid:false,
      monthlyAccomodation:false,
      terminalLiability:false,
      retireesInclude:false,
      annualMaximum:1200,
      lifetimeMaximum:100,
      specificLaser:false,
      unlimited:false,
      contract:false,
      familySpecificDeductibles:false,
      expectedRefund:false,
      monthlyClaimAmount: 0,
      numOfEmployee: 0
    });  
  }
  loadSelectClients(){

  }
  getAllClients(){    
    this.clientsService.getAllClients().subscribe(
      (data: IClient[]) => {
          this.clientIDs =  data;
          this.clients = data;
          this.dataSource = new MatTableDataSource(this.clients);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      }
    )
  }  
  getAllContracts(){    
    this.contractService.getAllContracts().subscribe(
      (data: IContract[]) => {
          this.contractIDs = data;
      }
    )
  }  
  getClient(clientId){
    this.clientsService.getClient(clientId).subscribe(
      (data: IClient[]) => {
        this.clients = data;
      }
    );
  }
  
  getClientOnUpdate(clientId){
    this.clientsService.getClient(clientId).subscribe(
      (data: IClient[]) => {
        this.singleClient = data;
      }
    );
  }
  showClientRow(clientobj){
    this.clientInfo.id = clientobj.clientId;
    this.clientInfo.cname = clientobj.clientName;
    this.clientInfo.contrid = clientobj.contractId;
    this.clientInfo.desc = clientobj.description;
   // this.isRowClicked = true;
  }
  onChangeClient(clientOption: string){
    switch(clientOption){
      case "Select All": 
        this.getAllClients();
        console.log("select all called");
        break;
      case clientOption:
        this.getClient(clientOption);
        break;
    }    
  }

  openClientAdd(open : boolean)  {
    this.clientAddFormInit();
    this.isClientAddOpen = open;
    if(!open){
      //this.isRuleSuccess = false;
      this.clientAddForm.reset();
    }
  }
  addClient(form:FormGroup){
    
    this.clientAddRequest = {
      clientId: '',
      clientName: this.clientAddForm.get('clientName').value,
      contractId: this.clientAddForm.get('contractId').value,
      description: this.clientAddForm.get('description').value,
      isActive: true,
      createdId: "somesh",
      createdBy: new Date("2020-12-11"),
      updatedId: "someshnuk",
      lastUpdate: new Date("2020-12-11"),
      deductible: this.clientAddForm.get('deductible').value,
      individualDeductible: Number(this.clientAddForm.get('individualDeductible').value),
      laserAmount: this.clientAddForm.get("laserAmount").value,
      start:this.clientAddForm.get('start').value,      
      end:this.clientAddForm.get('end').value,
      asl:this.clientAddForm.get('asl').value,
      contractType: '12/12',      
      runIn:this.clientAddForm.get('runIn').value,
      runOut:this.clientAddForm.get('runOut').value,
      corridor:this.clientAddForm.get('corridor').value,
      maxAttachmentPoint:this.clientAddForm.get('maxAttachmentPoint').value,
      coveredBenefit:this.clientAddForm.get('coveredBenefit').value,
      attachmentPoint:this.clientAddForm.get('attachmentPoint').value,
      paid:this.clientAddForm.get('paid').value,
      monthlyAccomodation:this.clientAddForm.get('monthlyAccomodation').value,
      terminalLiability:this.clientAddForm.get('terminalLiability').value,
      retireesInclude: true,
      annualMaximum:1000,
      lifetimeMaximum: 1200,
      specificLaser: false,
      unlimited: false,
      contract: true,
      familySpecificDeductibles: false,
      expectedRefund: true,
      monthlyClaimAmount: this.clientAddForm.get("monthlyClaimAmount").value,
      numOfEmployee: this.clientAddForm.get("numOfEmployee").value
    };
    console.log(this.clientAddRequest);
    this.clientsService.addClient(this.clientAddRequest).subscribe(
      (data:IClientAddSuccess) => {
          console.log(" client add success data "+data.message);
          this.isAddClientSuccess = true;   
          this.getAllClients();
          this.openClientAdd(false);
      }
    )
  }



openClientUpdateModal(element:any, open : boolean)  {
 // console.log("uuu cli id"+element.clientName);
  //this.getClientOnUpdate(cid);
  //console.log("this id details "+this.singleClient);
  //console.log("singleClient name "+element.clientName);
  
//let dtr = dp.transform(new Date(), p);
//this.transitionForm.setValue({effectiveEndDate: dtr}); 
  //if(cid!=null){
    this.isUpdateClientSuccess = false;
    this.isClientUpdateOpen = open;
    this.clientUpdateForm =this.fb.group({   
      clientId: element.clientId,
      clientName: element.clientName,
      contractId: element.contractId,
      description: element.description,
      deductible: element.deductible,
      individualDeductible: element.individualDeductible,
      laserAmount: element.laserAmount,
      start: element.start,
      end: element.end,
      asl: element.asl,
      contractType: element.contractType,
      runIn: element.runIn,
      runOut: element.runOut,
      corridor: element.corridor,
      maxAttachmentPoint: element.maxAttachmentPoint,
      coveredBenefit: element.coveredBenefit,
      attachmentPoint: element.attachmentPoint,
      paid: element.paid,
      monthlyAccomodation: element.monthlyAccomodation,
      terminalLiability: element.terminalLiability,
      retireesInclude: element.retireesInclude,
      annualMaximum: element.annualMaximum,
      lifetimeMaximum: element.lifetimeMaximum,
      specificLaser: element.specificLaser,
      unlimited: element.unlimited,
      contract: element.contract,
      familySpecificDeductibles:element.familySpecificDeductibles,
      expectedRefund:element.expectedRefund,   
      monthlyClaimAmount: element.monthlyClaimAmount,
      numOfEmployee: element.numOfEmployee
    }); 
   console.log("cli update form : "+this.clientUpdateForm);

  //}
 // alert("Clie : "+clie);


    if(!open){
      this.isClientUpdateOpen = false;
      this.isClientUpdateSuccess = false;
      this.clientUpdateForm.reset();
    }
  }
  updateClient(formData:FormGroup){    
    const headers = { 'content-type': 'application/json'};
    console.log(this.clientUpdateForm.value);
    console.log(this.clientUpdateRequest);

    this.clientUpdateRequest = {
      clientId: "",
      clientName: "HCL Tech",
      contractId: this.clientUpdateForm.get('contractId').value,
      description: this.clientUpdateForm.get('description').value,
      isActive: true,
      createdId: "somesh",
      createdBy: new Date("2020-12-11"),
      updatedId: "someshnuk",
      lastUpdate: new Date("2020-12-11"),
      deductible: this.clientUpdateForm.get('deductible').value,
      individualDeductible: Number(this.clientUpdateForm.get('individualDeductible').value),
      laserAmount: this.clientUpdateForm.get("laserAmount").value,
      start:this.clientUpdateForm.get('start').value,      
      end:this.clientUpdateForm.get('end').value,
      asl:this.clientUpdateForm.get('asl').value,
      contractType: '12/12',      
      runIn:this.clientUpdateForm.get('runIn').value,
      runOut:this.clientUpdateForm.get('runOut').value,
      corridor:this.clientUpdateForm.get('corridor').value,
      maxAttachmentPoint:this.clientUpdateForm.get('maxAttachmentPoint').value,
      coveredBenefit:this.clientUpdateForm.get('coveredBenefit').value,
      attachmentPoint:this.clientUpdateForm.get('attachmentPoint').value,
      paid:this.clientUpdateForm.get('paid').value,
      monthlyAccomodation:this.clientUpdateForm.get('monthlyAccomodation').value,
      terminalLiability:this.clientUpdateForm.get('terminalLiability').value,
      retireesInclude: true,
      annualMaximum:1000,
      lifetimeMaximum: 1200,
      specificLaser: false,
      unlimited: false,
      contract: true,
      familySpecificDeductibles: false,
      expectedRefund: true,      
      monthlyClaimAmount: this.clientUpdateForm.get("monthlyClaimAmount").value,
      numOfEmployee: this.clientUpdateForm.get("numOfEmployee").value
    };
    this.clientsService.updateClient(this.clientUpdateRequest).subscribe(
      (data:IClientUpdateSuccess) => {
        console.log("Update Rule data : "+data.message);
        
        this.openClientUpdateModal(null, false);
        this.getAllClients();
        this.isClientUpdateSuccess = true;
      }
    )
  }


}
