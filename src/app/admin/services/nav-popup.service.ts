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

  
  isLasering=new BehaviorSubject<boolean>(false)
  setIsLasering(status:boolean){
    this.isLasering.next(status);
    this.isLasering.asObservable();
  }

}
