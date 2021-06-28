import { Injectable } from '@angular/core';
import {IClientObj} from '../models/nav-popups.model';
import {BehaviorSubject, Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NavPopupService  {

  constructor() { }
  clObj: IClientObj ={
    clientId: '',
    clientName: '',
    isAdd: false,
    isUpdate: false
  }
  clientObj= new BehaviorSubject<IClientObj>(this.clObj);
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
    this.clientObj.next(this.clObj);
    this.clientObj.asObservable();
  }

}
