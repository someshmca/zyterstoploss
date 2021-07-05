import { Injectable } from '@angular/core';
import {IClientObj} from '../models/nav-popups.model';
import {BehaviorSubject, Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NavPopupService  {

  constructor() { }
  clientObjInit: IClientObj ={
    clientId: '',
    clientName: '',
    isAdd: false,
    isUpdate: false
  }
  
  clientObj= new BehaviorSubject<IClientObj>(this.clientObjInit);
  setClientObj(clientId, clientName, isAdd, isUpdate){
    this.clientObj.next({
      clientId: clientId,
      clientName: clientName,
      isAdd: isAdd,
      isUpdate: isUpdate
    });
    this.clientObj.asObservable();
  }
  resetClientObj(){
    this.clientObj.next(this.clientObjInit);
    this.clientObj.asObservable();
  }

  contractObj= new BehaviorSubject<IClientObj>(this.clientObjInit);
  setContractObj(clientId, clientName, isAdd, isUpdate){
    this.contractObj.next({
      clientId: clientId,
      clientName: clientName,
      isAdd: isAdd,
      isUpdate: isUpdate
    });
    this.contractObj.asObservable();
  }
  resetContractObj(){
    this.contractObj.next(this.clientObjInit);
    this.contractObj.asObservable();
  }

  productObj= new BehaviorSubject<IClientObj>(this.clientObjInit);
  setProductObj(clientId, clientName, isAdd, isUpdate){
    this.productObj.next({
      clientId: clientId,
      clientName: clientName,
      isAdd: isAdd,
      isUpdate: isUpdate
    });
    this.productObj.asObservable();
  }
  resetProductObj(){
    this.productObj.next(this.clientObjInit);
    this.productObj.asObservable();
  }

  planObj= new BehaviorSubject<IClientObj>(this.clientObjInit);
  setPlanObj(clientId, clientName, isAdd, isUpdate){
    this.planObj.next({
      clientId: clientId,
      clientName: clientName,
      isAdd: isAdd,
      isUpdate: isUpdate
    });
    this.planObj.asObservable();
  }
  resetPlanObj(){
    this.planObj.next(this.clientObjInit);
    this.planObj.asObservable();
  }

  laseringObj= new BehaviorSubject<IClientObj>(this.clientObjInit);
  setLaseringObj(clientId, clientName, isAdd, isUpdate){
    this.laseringObj.next({
      clientId: clientId,
      clientName: clientName,
      isAdd: isAdd,
      isUpdate: isUpdate
    });
    this.laseringObj.asObservable();
  }
  resetLaseringObj(){
    this.laseringObj.next(this.clientObjInit);
    this.laseringObj.asObservable();
  }
  
  isLasering=new BehaviorSubject<boolean>(false)
  setIsLasering(status:boolean){
    this.isLasering.next(status);
    this.isLasering.asObservable();
  }
  clearPopupSessions(){
    
    this.resetClientObj();
    this.resetContractObj();
    this.resetProductObj();
    this.resetPlanObj();
    this.resetLaseringObj();
    console.log(this.clientObj);
    console.log(this.productObj);
    console.log(this.contractObj);
    console.log(this.laseringObj);
    console.log(this.planObj);    
  }

}
