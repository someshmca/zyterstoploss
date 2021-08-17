import { AfterViewInit, Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';
import { NavPopupService } from './admin/services/nav-popup.service';
import {LoginService} from './shared/services/login.service';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  user: string;
  role: string;
  isLoggedIn: boolean=false;
  isStopScroll:boolean=false;

  constructor(private loginService: LoginService, private route: Router, private cookieService: CookieService){

  }

  ngOnInit(){
    let temp = localStorage.getItem('loginStatus');
    console.log(temp);
    if(temp=="true")
    this.isLoggedIn = true;
    else
    this.isLoggedIn = false;
      }
    ngAfterViewInit(){  
      this.loginService.setLoginStatus(this.isLoggedIn);  
      this.loginService.loginStatus.subscribe((d) => {
        this.isLoggedIn = d;
      });
      let obj = JSON.parse(localStorage.getItem('currentUser'));
      
      if(obj){
        this.loginService.setLoggedInUser(obj.name);
        this.loginService.loggedUser.subscribe((user)=>{
          this.user = user;
          
        });
        this.loginService.setLoggedRole(obj.roleName);
        this.loginService.loggedRole.subscribe((role)=>{
          this.role=role;
          
        });
      }
      
    }
    logout(){          
      localStorage.removeItem('loginStatus');
      this.loginService.setLoginStatus(false);
      this.loginService.loginStatus.subscribe((d) => {
        this.isLoggedIn = d;
        //
      });
      this.route.navigate(['/login']);
    }
}
