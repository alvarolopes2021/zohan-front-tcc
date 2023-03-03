import { ElementRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { IconServiceService } from 'src/assets/icon-service.service';

@Component({
  host: { '(document:click)': 'onClick($event)' },
  selector: 'app-home-nav',
  templateUrl: './home-nav.component.html',
  styleUrls: ['./home-nav.component.css']
})
export class HomeNavComponent implements OnInit {

  isCollapsed: boolean = true;

  icons: Map<string, any> = new Map<string, any>();

  constructor(
    private iconsService: IconServiceService,
    private _eref: ElementRef
  ) { }

  ngOnInit(): void {
    this.icons = this.iconsService.getIcons();
  }

  showMenu() {
    if (this.isCollapsed) {
      let menu = document.getElementsByClassName("cellphone-menu")[0];
      menu.className = "cellphone-menu absolute";
      this.isCollapsed = false;
      return;
    }

    let menu = document.getElementsByClassName("cellphone-menu")[0];
    menu.className = "cellphone-menu display-none absolute";
    this.isCollapsed = true;
  }

  onClick(event: any) {

    if (!this._eref.nativeElement.contains(event.target) && !this.isCollapsed) {
      let menu = document.getElementsByClassName("cellphone-menu")[0];
      menu.className = "cellphone-menu display-none absolute";
      this.isCollapsed = true;
    }
  }
}
