import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import decode from 'jwt-decode';

import { Constants } from 'src/constants';
import { UserModel } from '../models/user.model';
import { UtilService } from '../utils/util.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false); // {1}

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  get isLoggedIn() {
    return this.loggedIn.asObservable(); // {2}
  }

  public set setIsLoggedIn(value: boolean) {
    this.loggedIn.next(value);
  }


  signup(user: UserModel): Observable<any> | null {
    if (user == null)
      return user;

    if (user.userpsw == null)
      return null;

    user.userpsw = btoa(user.userpsw.toString());  //converts the password to base64  

    return this.http.post<any>(Constants.HttpEndpoints.Login.SIGN_UP, user);

  }

  login(user: UserModel | null): Observable<UserModel> | null {

    if (user == null)
      return user;

    if (user.userpsw == null || user.userphone == null)
      return null;

    user.userpsw = btoa(user.userpsw.toString());

    return this.http.post<UserModel>(Constants.HttpEndpoints.Login.LOGIN, user, { withCredentials: true });

  }

  logout() {
    UtilService.removeFromLocalStorage(Constants.Auth.TOKEN);
    this.router.navigate(['/login']);
    this.setIsLoggedIn = false;
  }

  public getTokenInformation() {
    //gets the token
    let token = UtilService.getFromLocalStorage(Constants.Auth.TOKEN);
    let decoded : Object;

    if (token != null && token != undefined) { //if the token is not null
      decoded = decode(token);  // we get the payload
      
      let values = new Map(Object.entries(decoded)); //we put the payload into a map
      let payload = atob(values.get("params"));  //we get only the params from the token

      let data : string[] = payload.split(";"); //we split the params into the format the server created it
                  
      let role = data[0].split("=")[1];
      let username = data[1].split("=")[1];
      let userId = data[2].split("=")[1];

      let info : Map<string, string> = new Map<string, string>();

      info.set(Constants.Keys.USERNAME, username);
      info.set(Constants.Keys.ROLE, role);
      info.set(Constants.Keys.SESSION_CLIENT_ID, userId);

      return info;
    }
    
    return null;

  }

}
