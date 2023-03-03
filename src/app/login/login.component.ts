import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';


import { IconServiceService } from 'src/assets/icon-service.service';
import { AuthService } from '../services/auth.service';
import { Constants } from 'src/constants';
import { UserModel } from '../models/user.model';
import { ErrorHandler } from '../services/errorHandler';
import { UtilService } from '../utils/util.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  /* FLAGS */

  isLoggingIn: boolean = false;

  mode: ProgressSpinnerMode = 'indeterminate';

  readonly CONSTANTS = Constants;

  errors: Map<string, string> = new Map<string, string>();

  icons: Map<string, any> = new Map<string, any>();

  loginForm = new FormGroup({
    userPhone: new FormControl('', [Validators.required]),
    userPsw: new FormControl('', [Validators.required, Validators.min(6)]),
  });

  constructor(
    private iconService: IconServiceService,
    private authService: AuthService,
    private router: Router,
    private utils: UtilService
  ) { }


  ngOnInit(): void {
    this.utils.checkIsLoggedIn();
    this.icons = this.iconService.getIcons();
  }

  async login() {

    this.errors.clear();

    let formValue = this.loginForm;

    if (!formValue.valid) {
      alert('Todos os campos devem ser preenchidos!');
      return;
    }

    this.isLoggingIn = true;

    let user: UserModel = {};

    user.userphone = formValue.get('userPhone')?.value;
    user.userpsw = formValue.get('userPsw')?.value;

    this.authService.login(user)?.pipe(catchError(ErrorHandler.handleError)).subscribe((value) => {

      if (value instanceof Map) {
        this.errors = value;
        this.isLoggingIn = false;
        return;
      }

      user = <UserModel>value;

      switch (user.usertype) {
        case Constants.Roles.USER:
          this.router.navigate(['/logged/scheduling']);
          this.authService.setIsLoggedIn = true;
          break;
        case Constants.Roles.BARBER:
          this.router.navigate(['/logged/barber']);
          this.authService.setIsLoggedIn = true;
          break;
        case Constants.Roles.ADMIN:
          this.router.navigate(['/logged/admin']);
          this.authService.setIsLoggedIn = true;
          break;
      }

      // inserts the token in local storage
      if (user.usertoken != null && user.userid != null && user.username != null) {
        UtilService.setInLocalStorage(Constants.Auth.TOKEN, user.usertoken.token);
        UtilService.setInLocalStorage(Constants.Keys.SESSION_CLIENT_ID, user.userid);
        UtilService.setInLocalStorage(Constants.Keys.USERNAME, user.username);
      }

    });

  }

  async close() {
    let mainDiv = document.getElementsByClassName("login-main")[0];
    if (mainDiv != null && mainDiv != undefined) {
      mainDiv.remove();
    }
  }

}
