import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs';
import { ServicesModel } from 'src/app/models/services.model';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorHandler } from 'src/app/services/errorHandler';
import { ServicesService } from 'src/app/services/services.service';
import { Constants } from 'src/constants';

@Component({
  selector: 'app-client-home',
  templateUrl: './client-home.component.html',
  styleUrls: ['./client-home.component.css']
})
export class ClientHomeComponent implements OnInit {

  services: ServicesModel[] = [];

  constructor(
    private servicesService: ServicesService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.servicesService.getServices()?.pipe(catchError(ErrorHandler.handleError)).subscribe((value) => {

      if (value instanceof Map) {
        return;
      }

      this.services = <ServicesModel[]>value;
    });
  }

}
