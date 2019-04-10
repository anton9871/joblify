import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-registration',
  templateUrl: './login-registration.component.html',
  styleUrls: ['./login-registration.component.css']
})
export class LoginRegistrationComponent implements OnInit {
  regUser: any;
  logUser:any;


  loginBool:boolean;
  errorLogin = "Invalid email/password";

  duplicateBool = false;


  constructor(private _httpService:HttpService, private _router:Router) { }

  ngOnInit() {
    this.regUser = {
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    };
    this.logUser = {
      email: "access@joblify.com",
      password: "password"
    }
  }
  register(){
    this._httpService.registerUser(this.regUser).subscribe(data => {
      if(data['status'] == 'success'){
        this._router.navigate(['/jobSearch'])
      } else if ( data['status'] == 'duplicate'){
        this.duplicateBool = true;
      }
    })
  }

  login(){
    this._httpService.loginUser(this.logUser).subscribe(data => {
        this._router.navigate(['/jobSearch'])
    })
  }
}
