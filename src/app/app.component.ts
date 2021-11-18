import { AfterViewInit, Component, OnInit, isDevMode } from '@angular/core';
import {Router} from '@angular/router';
import { Observable } from 'rxjs';
import { NavPopupService } from './admin/services/nav-popup.service';
import { LoginResponseModel } from './shared/models/login.model';
import {LoginService} from './shared/services/login.service';
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
  loginData:LoginResponseModel; // aug 26 2021 added

  constructor(private loginService: LoginService, private route: Router){

  }

  ngOnInit(){
    if (isDevMode()) {
      console.log('Development!');
    } else {
      console.log('Production!');
    }
    let temp = localStorage.getItem('loginStatus');

    console.log(temp);
    if(temp=="true"){
      this.isLoggedIn = true;
      this.loginData = JSON.parse(localStorage.getItem("loginData")); // aug 26 2021 added
      this.loginService.setMenu(this.loginData.menuDetails); // aug 26 2021 added
    }
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
