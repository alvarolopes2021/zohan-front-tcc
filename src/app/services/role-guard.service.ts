import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Constants } from 'src/constants';
import { UtilService } from '../utils/util.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService implements CanActivate {

  constructor(
    private authService : AuthService,
    public router : Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    const expectedRole = route.data['expectedRole'];

    let userInfo = this.authService.getTokenInformation();

    // checks if user is logged in
    if(userInfo === null){
      try{
        UtilService.removeFromLocalStorage(Constants.Auth.TOKEN);
        this.authService.setIsLoggedIn = false;
      }
      catch(e){

      }      
      this.router.navigate(['/login']);
      return false;
    }
    else if(userInfo.get(Constants.Keys.ROLE) == expectedRole){ // if user is logged, checks the ROLE
        return true;
    }
    else{
      this.router.navigate(['/forbiden']);
      return false;
    }

  }
}
