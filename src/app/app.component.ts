import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

import { slideInAnimation } from './animations/slideAnimation';
import { UtilService } from './utils/util.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    slideInAnimation
  ]
})

export class AppComponent implements OnInit {

  title = 'Zohan - Barber Shop';


  isLoggedIn?: boolean;

  constructor(
    private authService: AuthService,
    private utils: UtilService
  ) { }

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((value) => this.isLoggedIn = value); // {2}
    this.utils.checkIsLoggedIn();
  }

}
