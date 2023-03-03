import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as dayjs from "dayjs";
import { Constants } from "src/constants";
import { AuthService } from "../services/auth.service";

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    constructor(
        private authService: AuthService,
        private router: Router
    ) { }

    static setInLocalStorage(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    static getFromLocalStorage(key: string) {
        return localStorage.getItem(key);
    }

    static removeFromLocalStorage(key: string): void {
        localStorage.removeItem(key);
    }

    static createTokenDate(expires: number) {
        return dayjs().add(expires, 'second');
    }

    async checkIsLoggedIn() {
        let token = this.authService.getTokenInformation();

        if (token != null && token.size > 0) {
            this.authService.setIsLoggedIn = true;

            switch (token.get(Constants.Keys.ROLE)) {
                case Constants.Roles.USER:
                    this.router.navigate(['/logged/scheduling']);
                    break;
                case Constants.Roles.BARBER:
                    this.router.navigate(['/logged/barber']);
                    break;
                case Constants.Roles.ADMIN:
                    this.router.navigate(['/logged/admin']);
                    break;
                default:
                    this.router.navigate(['/login']);
                    break;
            }

            return;
        }
    }

}