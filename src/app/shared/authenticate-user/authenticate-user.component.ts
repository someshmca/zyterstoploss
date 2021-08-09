import { Component, OnInit } from '@angular/core';
import {AuthenticateUserService} from '../services/authenticate-user.service';
@Component({
  selector: 'app-authenticate-user',
  templateUrl: './authenticate-user.component.html',
  styleUrls: ['./authenticate-user.component.css']
})
export class AuthenticateUserComponent implements OnInit {
  authUser: any;
  constructor(private authenticateUserService: AuthenticateUserService) { }

  ngOnInit() {
    debugger;
    this.authenticateUser();
  }
  authenticateUser(){
    debugger;
    this.authenticateUserService.getAuthenticatedUser().subscribe(
      (data)=>{
        debugger;
        this.authUser = data;
          console.log(data);
      }
    )
  }
}
