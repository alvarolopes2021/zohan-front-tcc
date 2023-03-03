import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { HomeNavComponent } from './navs/home-nav/home-nav.component';
import { LoggedNavComponent } from './navs/logged-nav/logged-nav.component';
import { HomeComponent } from './home/home.component';
import { SignupComponent } from './signup/signup.component';
import { LocationComponent } from './home/location/location.component';
import { PricesComponent } from './home/prices/prices.component';
import { AdsComponent } from './home/ads/ads.component';
import { LoginComponent } from './login/login.component';
import { ClientHomeComponent } from './logged/client/client-home/client-home.component';
import { AdminHomeComponent } from './logged/adm/admin-home/admin-home.component';
import { ListClientsComponent } from './logged/adm/list-clients/list-clients.component';
import { AddAdsComponent } from './logged/adm/add-ads/add-ads.component';
import { ProfileComponent } from './logged/common/profile/profile.component';
import { AddServicesComponent } from './logged/adm/add-services/add-services.component';
import { AllOrdersComponent } from './logged/adm/all-orders/all-orders.component';
import { LoggedHeaderComponent } from './logged/common/logged-header/logged-header.component';
import { SchedulingComponent } from './logged/common/scheduling/scheduling.component';
import { LoggedLocationComponent } from './logged/common/logged-location/logged-location.component';
import { httpInterceptorProviders } from './services/interceptor.module';
import { ForbidenComponent } from './logged/common/forbiden/forbiden.component';
import { OrdersHistoryComponent } from './logged/client/orders-history/orders-history.component';
import { SnackBarComponent } from './custom-components/snack-bar/snack-bar.component';
import { EditDayTimeComponent } from './logged/adm/edit-day-time/edit-day-time.component';
import { AddBarbersComponent } from './logged/adm/add-barbers/add-barbers.component';
import { BarberDetailComponent } from './logged/adm/barber-detail/barber-detail.component';
import { AssingBarberDaytimeComponent } from './logged/adm/assing-barber-daytime/assing-barber-daytime.component';
import { BarberHomeComponent } from './logged/barber/barber-home/barber-home.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ListTileComponent } from './custom-components/list-tile/list-tile.component';
import { HomeLogoComponent } from './logged/common/home-logo/home-logo.component';
import { RevenueComponent } from './logged/adm/revenue/revenue.component';
import { BarberHistoryComponent } from './logged/barber/barber-history/barber-history.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeNavComponent,
    LoggedNavComponent,
    HomeComponent,
    SignupComponent,
    LocationComponent,
    PricesComponent,
    AdsComponent,
    LoginComponent,
    ClientHomeComponent,
    AdminHomeComponent,
    ListClientsComponent,
    AddAdsComponent,
    ProfileComponent,
    AddServicesComponent,
    AllOrdersComponent,
    LoggedHeaderComponent,
    SchedulingComponent,
    LoggedLocationComponent,
    ForbidenComponent,
    OrdersHistoryComponent,
    SnackBarComponent,
    EditDayTimeComponent,
    AddBarbersComponent,
    BarberDetailComponent,
    AssingBarberDaytimeComponent,
    BarberHomeComponent,
    ListTileComponent,
    HomeLogoComponent,
    RevenueComponent,
    BarberHistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxMaskModule.forRoot(),
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable'
      //registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
