import { Component, ElementRef, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/utils/util.service';

import { IconServiceService } from 'src/assets/icon-service.service';
import { Constants } from 'src/constants';

@Component({
  host: { '(document:click)': 'onClick($event)' },
  selector: 'app-logged-nav',
  templateUrl: './logged-nav.component.html',
  styleUrls: ['./logged-nav.component.css']
})

export class LoggedNavComponent implements OnInit {

  icons: Map<string, any> = new Map<string, any>();

  userInfo: Map<string, string> | null = new Map<string, string>();

  readonly CONSTANTS = Constants;

  isCollapsed: boolean = true;

  constructor(
    private iconService: IconServiceService,
    private authService: AuthService,
    private _eref: ElementRef
  ) { }

  ngOnInit(): void {
    this.icons = this.iconService.getIcons();
    this.userInfo = this.authService.getTokenInformation();
    this.userInfo?.set(Constants.Keys.USERNAME, UtilService.getFromLocalStorage(Constants.Keys.USERNAME)!);
  }

  logout() {
    let willLogout = confirm('Você tem certeza que deseja SAIR?');
    if (willLogout)
      this.authService.logout();
  }

  openMenu() {
    if (this.isCollapsed) {
      let mediaQueries = document.getElementsByClassName("media-query");

      for (let i = 0; i < mediaQueries.length; i) { //when you change the class name, the element is rmeoved from the array
        mediaQueries[i].className = "display-block";
      }
      document.getElementById("nav")!.className = "expand-menu";

      this.isCollapsed = false;

      return;
    }
    let mediaQueries = document.getElementsByClassName("display-block");
    for (let i = 0; i < mediaQueries.length; i) {
      mediaQueries[i].className = "media-query";
    }
    document.getElementById("nav")!.className = "";

    this.isCollapsed = true;
  }

  onClick(event: any) {
    if (!this._eref.nativeElement.contains(event.target) && !this.isCollapsed) {
      let mediaQueries = document.getElementsByClassName("display-block");
      
      if(mediaQueries == null || mediaQueries == undefined)
        return;

      for (let i = 0; i < mediaQueries.length; i) {
        mediaQueries[i].className = "media-query";
      }
      document.getElementById("nav")!.className = "";

      this.isCollapsed = true;
    }
  }

}
