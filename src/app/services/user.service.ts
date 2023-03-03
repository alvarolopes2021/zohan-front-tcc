import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Constants } from 'src/constants';
import { UserModel } from '../models/user.model';
import { ErrorHandler } from './errorHandler';
import { AuthService } from './auth.service';
import { UtilService } from '../utils/util.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private swPush: SwPush,
    private authService: AuthService
  ) { }

  getAllUsers(): Observable<any> | null {
    let params: HttpParams = new HttpParams().append(Constants.Keys.ROLE, Constants.Roles.USER);
    return this.http.get<any>(Constants.HttpEndpoints.Users.GET_ALL_USERS, { params: params });
  }

  getUserProfile(id: string): Observable<any> | null {
    let params: HttpParams = new HttpParams().append(Constants.Keys.SESSION_CLIENT_ID, id);
    return this.http.get(Constants.HttpEndpoints.Users.USER_PROFILE, { params: params });
  }

  updateUserProfile(user: UserModel): Observable<any> | null {
    if (user == null || user == undefined)
      return of();

    if (user.userpsw != null && user.newpsw != null) {
      user.userpsw = btoa(user.userpsw!);
      user.newpsw = btoa(user.newpsw!);
    }
    else if (user.usertype == Constants.Roles.BARBER && user.newpsw != null)
      user.userpsw = btoa(user.userpsw!);

    return this.http.put(Constants.HttpEndpoints.Users.UPDATE_USER_PROFILE, user);
  }

  //added v3.7.0
  addNotificationSubscription(user: UserModel) {
    return this.http.post(Constants.HttpEndpoints.Users.ADD_NOTIFICATION_SUBSCRIPTION, user);
  }

  requestPushSubscription() {

    if (Notification.permission !== "granted") {

      this.swPush.requestSubscription({
        serverPublicKey: environment.PUSH_TOKEN_PUBLIC_KEY
      }).then(sub => {

        let userModel: UserModel = {};
        userModel.userid =
          this.authService.getTokenInformation()?.get(Constants.Keys.SESSION_CLIENT_ID);

        userModel.pushsubscription = [sub];
        this.addNotificationSubscription(userModel).pipe(catchError(ErrorHandler.handleError)).subscribe()

      }
      ).catch(err =>
        console.error("Could not subscribe to notifications", err)
      );

    }

  }

  deleteAccount(user: UserModel): Observable<any> | null {
    return this.http.delete(Constants.HttpEndpoints.Users.DELETE_ACCOUNT, { body: user });
  }

}
