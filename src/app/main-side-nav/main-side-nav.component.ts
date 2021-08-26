import { AfterViewInit,Component, OnInit } from '@angular/core';
import { LoginService } from '../shared/services/login.service';
import {NavPopupService} from '../admin/services/nav-popup.service';
import * as $ from 'jquery';
import { ClaimService } from '../admin/services/claim.service';
@Component({
  selector: 'app-main-side-nav',
  templateUrl: './main-side-nav.component.html',
  styleUrls: ['./main-side-nav.component.css']
})
export class MainSideNavComponent implements OnInit, AfterViewInit {
  menu: any[]; 
  isLoggedIn: boolean;
  linkToHome: string='';
  roleName: string;                          
  constructor(private loginService: LoginService, private claimService:ClaimService ,private navService: NavPopupService) { }
  
  ngOnInit(): void {
    if(this.isLoggedIn==true){
        this.linkToHome='/dashboard';
    }
    else{
      this.linkToHome = '/login';
    }
  }
  clearPopupSessions(){
    this.claimService.resetClaimSearch();
    this.navService.clearPopupSessions();
    
  }
  ngAfterViewInit(){
    this.loginService.loginStatus.subscribe((d) => {
      console.log("main side nav after vinit logged status "+d);
      this.isLoggedIn = d;
    }
    );
    this.loginService.loggedRole.subscribe((data) => {
      console.log("main side nav after vinit logged status "+data);
      this.roleName=data; 
    })
    this.loginService.menuD.subscribe((data) => {
          console.log(" menuD status"+data);
        this.menu=data;
      }
      ); 
        
      let cdata=JSON.parse(localStorage.getItem("currentUser"));
      console.log(cdata);
      //
  }  
}
