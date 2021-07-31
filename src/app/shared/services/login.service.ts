import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import {Paths} from '../../admin/admin-paths';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginModel,LoginResponseModel } from '../models/login.model';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private currentUserSubject: BehaviorSubject<LoginResponseModel>;
    public currentUser: Observable<LoginResponseModel>;
    public User: any;

  username: string;
  password: string;

  public isAdmin:boolean;
  // above paht will give following re3sponse
/*  {
    "name": "Ashwani",
    "roleName": "Admin"
  }
 */

  //path= "https://jsonplaceholder.typicode.com/posts/1";


  private token = new BehaviorSubject<any>('');
  curToken = this.token.asObservable();
  setToken(token: any) {
      this.token.next(token)
    }

  private isLoggedIn = new BehaviorSubject<any>(false);
  loginStatus = this.isLoggedIn.asObservable();
  setLoginStatus(isLoggedIn: boolean) {
    this.isLoggedIn.next(isLoggedIn)
  }

  private loggedUserName = new BehaviorSubject<string>('');
  loggedUser = this.loggedUserName.asObservable();
  setLoggedInUser(loggedUser: string) {
    this.loggedUserName.next(loggedUser)
  }

  loggedRoleName = new BehaviorSubject<string>('');
  loggedRole = this.loggedRoleName.asObservable();
  setLoggedRole(loggedRole: string) {
    this.loggedRoleName.next(loggedRole)
  }

  getLoggedInRole(){
    this.loggedRole.subscribe((data)=>{
      if(data=='Admin'){
        this.isAdmin=true;
      }
      if(data=='User'){
        this.isAdmin=false;
      }
      
    });
  }

  constructor(private http: HttpClient) {
    this.currentUserSubject =
    new BehaviorSubject<LoginResponseModel>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
   }
   public get currentUserValue(): LoginResponseModel {
    return this.currentUserSubject.value;
   }
    getLoginDetails(username: string, password: string){
      this.username = username;
      this.password= password;
      console.log();
      return this.http.get(Paths.loginPath+"?emailId="+this.username+"&password="+this.password)
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify(this.User));
        this.User=user;
        this.currentUserSubject.next(this.User);
        return this.User;
    }));
  }

    private menu = new BehaviorSubject<any>('');
      menuD = this.menu.asObservable();
      setMenu(menu: any) {
          this.menu.next(menu)
      }
    logout() {
      // remove user from local storage and set current user to null
      localStorage.removeItem('currentUser');
      this.currentUserSubject.next(null);
  }

}
