import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Paths} from '../../admin/admin-paths';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateUserService {

  constructor(private http: HttpClient) { }
  getAuthenticatedUser(){
    return this.http.get(Paths.authenticateUser+"QDI_Sateesh.Chandra%20Bhadravathiveeranna");
  }
}
