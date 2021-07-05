import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from '../services/login.service'
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private loginService: LoginService,private router: Router) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let currentUser = this.loginService.currentUserValue;
        if (localStorage.getItem('currentUser') != null && localStorage.getItem('loginStatus')=='true') {
            //debugger;
            const clonedReq = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + currentUser.token)
            });
            return next.handle(clonedReq).pipe(
                tap(
                    succ => { },
                    err => {
                        if (err.status == 401){
                            localStorage.removeItem('currentUser');
                            this.loginService.setLoginStatus(false);
                            localStorage.removeItem('loginStatus');
                            this.router.navigateByUrl('/user/login');
                        }
                    }
                )
            )
        }
        else
            return next.handle(req.clone());
    }
}