import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Observable } from 'rxjs';
import {LoginService} from '../services/login.service';
import {LoginModel, LoginResponseModel} from  '../models/login.model';
import {Paths} from '../../admin/admin-paths';
import { stringify } from '@angular/compiler/src/util';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';
import {LoaderService} from '../../admin/services/loader.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private loginService: LoginService, public loaderService: LoaderService, private router: Router) { }

  @ViewChild('loginForm') loginForm: NgForm;
  loginData: any;
  submitted = false;

  isLoginSuccess = false;
  userName: string;
  password: string;
  responseName: string = '';
  responseRoleName: string = '';
  loginStatus: boolean;
  invalidLogin: boolean = false;
  invalidPassword: boolean = false;
  currentToken: any;
  @ViewChild("focusElem") focusTag: ElementRef;

  ngOnInit(): void {
    localStorage.setItem('loginStatus',"false");
    this.loginStatus = false;
    console.log(this.loginStatus);
    this.loginService.setLoginStatus(this.loginStatus);
    setTimeout(()=>{
      this.focusTag.nativeElement.focus()
    }, 100);
  }

  // getLoginDetails(){
  //   this.loginService.getLoginDetails().subscribe(
  //     (data:LoginModel ) =>  {
  //         this.loginData = JSON.stringify(data);
  //     }
  //   )
  // }
  checkEmail(){
    this.invalidLogin = false;
  }
  checkPwd(){
    this.invalidLogin = false;
  }
  onSubmit() {

    this.userName = this.loginForm.value.emailId;
    this.password = this.loginForm.value.password;

    console.log("username : "+this.userName);
    console.log("password : "+this.password);
    console.log("Login path : "+Paths.loginPath);
   // if(this.userName =="admin@infinite.com" || this.userName =="ashwani.kumar@infinite.com")
  //  if(this.userName){
  //     this.invalidEmail = false;
  //   }
  //   else{
  //     this.invalidEmail = true;
  //   }
  //   if(this.password == '' || this.password != "pass@1234"){
  //     this.invalidPassword = true;
  //     return this.loginForm.invalid;
  //   }
  //   else{
  //     this.invalidPassword = false;
  //   }
  //this.invalidEmail = true;
    //if(this.userName=="ashwani.kumar@infinite.com" && this.password=="pass@1234")//{
     this.loginService.getLoginDetails(this.userName, this.password).subscribe(
            (data:LoginResponseModel ) =>  {
              if(data){
                this.loginData = data;
                localStorage.setItem("loginData",JSON.stringify(data));  // aug 26 2021 added
                this.loginData = JSON.parse(this.loginData=localStorage.getItem("loginData")); // aug 26 2021 added
                this.loginService.setMenu(this.loginData.menuDetails);  
                
                this.loginService.setToken(this.loginData.token);
                this.loginService.curToken.subscribe(d => {                    
                  console.log("cur token value : "+d);
                  this.currentToken = d;
                });
                //
                this.responseName = this.loginData.name;
                this.responseRoleName = this.loginData.roleName;
                
                this.loginService.setLoggedInUser(this.responseName);
                this.loginService.setLoggedRole(this.responseRoleName);
                // if((this.userName=="ashwani.kumar@infinite.com" && this.password=="pass@1234") || (this.userName=="admin@infinite.com" && this.password=="pass@1234")){
                  this.submitted = true;
                  this.isLoginSuccess = true;
                  this.invalidLogin = false;
                  console.log("Name : "+this.responseName );
                  console.log("Role Name : "+this.responseRoleName);
           
                  localStorage.setItem('currentUser', JSON.stringify(data));
                  localStorage.setItem('loginStatus',"true");
                  this.loginStatus = Boolean(localStorage.getItem('loginStatus'));
                  console.log(this.loginStatus);
                  this.loginService.setLoginStatus(this.loginStatus);
                  this.loginService.loginStatus.subscribe(d => {
                    console.log(" login status "+d);
                  //  
                  });
                  //
                  this.router.navigate(['/dashboard'])
                //}         
              }
            },
            (err) => {
                this.invalidLogin = true;
            }
          );
   // }
   }
   

}

