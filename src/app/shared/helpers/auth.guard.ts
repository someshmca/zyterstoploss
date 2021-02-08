import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login.service'
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    loginStatus: boolean;
    constructor(
        private router: Router,
        private loginService: LoginService        
    ) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {   
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loginStatus = Boolean(localStorage.getItem('loginStatus'));
        if (currentUser && this.loginStatus) {
            // authorised so return true
           // debugger;
            return true;
        }        
        // not logged in so redirect to login page with the return url
        localStorage.setItem('loginStatus','false');
        this.loginStatus=Boolean(localStorage.getItem('loginStatus'));
        this.loginService.setLoginStatus(this.loginStatus);
        //debugger;
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});

        return false;
    }
}
