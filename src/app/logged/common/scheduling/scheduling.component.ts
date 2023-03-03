import { Component, ElementRef, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, shareReplay } from 'rxjs';
import { OrdersModel } from 'src/app/models/orders.model';
import { MatSnackBar } from '@angular/material/snack-bar';


import { DayTimeModel } from 'src/app/models/dayTime.model';
import { ServicesModel } from 'src/app/models/services.model';
import { ErrorHandler } from 'src/app/services/errorHandler';
import { OrdersService } from 'src/app/services/orders.service';
import { ScheduleService } from 'src/app/services/schedule.service';
import { ServicesService } from 'src/app/services/services.service';
import { AuthService } from 'src/app/services/auth.service';
import { IconServiceService } from 'src/assets/icon-service.service';
import { Constants } from 'src/constants';
import { UserModel } from 'src/app/models/user.model';
import { BarbersService } from 'src/app/services/barbers.service';
import { BarberTimeModel } from 'src/app/models/barberTime.model';
import { UserService } from 'src/app/services/user.service';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-scheduling',
  templateUrl: './scheduling.component.html',
  styleUrls: ['./scheduling.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SchedulingComponent implements OnInit {

  selected?: Date | null;
  oldSelection?: Date | null;
  minDate?: Date | null = new Date();

  readonly CONSTANTS = Constants;

  errors: Map<string, string> = new Map<string, string>();

  icons: Map<string, any> = new Map<string, any>();

  services: ServicesModel[] = [];
  schedules: DayTimeModel[] = [];
  barbers: UserModel[] = [];

  selectedService: ServicesModel = {};
  selectedSchedule: DayTimeModel = {};

  userInfo: Map<string, string> | null = new Map<string, string>();

  isLoading: boolean = false;
  isLoadingBarbers: boolean  = false;
  isLoadingServices: boolean  = false;
  isLoadingTimes: boolean  = false;
  mode: ProgressSpinnerMode = 'indeterminate';

  form = new FormGroup({
    scheduleToInsert: new FormControl(''),
    schedule: new FormControl('', Validators.required),
    service: new FormControl('', Validators.required),
    barber: new FormControl('', [Validators.required]),
    userPhone: new FormControl('')
  });

  constructor(
    private iconsService: IconServiceService,
    private scheduleService: ScheduleService,
    private servicesService: ServicesService,
    private ordersService: OrdersService,
    private authService: AuthService,
    private barberService: BarbersService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.icons = this.iconsService.getIcons();
    this.userInfo = this.authService.getTokenInformation();

    //this.userService.requestPushSubscription();
  }


  getServices() {
    if (this.selected === null || this.selected === undefined)
      return;

    if (this.selectedService.serviceid != null) {
      this.getSchedules();
      return;
    }

    this.schedules = [];
    this.services = [];
    this.errors.clear();

    this.isLoadingServices = true;

    this.servicesService.getServices()?.pipe(catchError(ErrorHandler.handleError)).subscribe((value) => {

      if (this.errors.size > 0) {
        this.isLoadingServices = false;
        return;
      }

      if (value instanceof Map) {
        this.errors = value;
        this.isLoadingServices = false;
        return;
      }

      this.services = <ServicesModel[]>value;
      this.services = this.services.sort((a, b) => a.servicedescription!.localeCompare(b.servicedescription!));

      this.isLoadingServices = false;
    });

  }

  getSchedules() {
    if (this.selected == null || this.selected == undefined)
      return alert('Escolha um dia!');

    let service = this.services.findIndex((value) => value.serviceid === this.form.get("service")?.value);

    if (service == null)
      return;

    this.selectedService = this.services[service];

    this.isLoadingTimes = true;

    if (this.selectedService.usesmoretime) {

      this.scheduleService.getAvailableDayTimeUsesMoreTime(this.selected, this.form.get('barber')?.value).pipe(catchError(ErrorHandler.handleError), shareReplay(1)).subscribe((value) => {

        if (value instanceof Map) {
          this.schedules = [];
          this.errors = value;
          this.isLoadingTimes = false;
          return;
        }

        let today = new Date();
        today.setHours(new Date().getHours() - 3);
        let correctDay = today.toISOString();
        let todayDate = correctDay?.split("T")[0];
        let todayTime = correctDay?.split("T")[1].split(".")[0];

        this.schedules = <DayTimeModel[]>value;

        let availableSchedules: DayTimeModel[] = [];

        this.schedules.forEach((element) => {
          if (element.daytimeday?.split("T")[0]! > todayDate ||
            (element.daytimeday?.split("T")[0]! == todayDate && element.daytimestart! >= todayTime)) {

            let contains = availableSchedules.filter(predicate => predicate.daytimeid == element.daytimeid);

            if (contains.length <= 0)
              availableSchedules.push(element);
          }
        });

        if (availableSchedules.length <= 0) {
          this.schedules = [];
          this.errors.set(Constants.Errors.ERROR, "Sem horários disponíveis");
          this.isLoadingTimes = false;
          return;
        }

        this.schedules = availableSchedules;
        this.schedules.sort((a, b) => a.daytimestart!.localeCompare(b.daytimeend!));
        this.isLoadingTimes = false;
      });

      return;
    }

    this.scheduleService.getAvailableDayTime(this.selected, this.form.get('barber')?.value).pipe(catchError(ErrorHandler.handleError), shareReplay(1)).subscribe((value) => {

      if (value instanceof Map) {
        this.schedules = [];
        this.errors = value;
        this.isLoadingTimes = false;
        return;
      }

      let today = new Date();
      today.setHours(new Date().getHours() - 3);
      let correctDay = today.toISOString();
      let todayDate = correctDay?.split("T")[0];
      let todayTime = correctDay?.split("T")[1].split(".")[0];

      this.schedules = <DayTimeModel[]>value;

      let availableSchedules: DayTimeModel[] = [];

      this.schedules.forEach((element) => {
        if (element.daytimeday?.split("T")[0]! > todayDate ||
          (element.daytimeday?.split("T")[0]! == todayDate && element.daytimestart! >= todayTime)) {

          let contains = availableSchedules.filter(predicate => predicate.daytimeid == element.daytimeid);

          if (contains.length <= 0)
            availableSchedules.push(element);
        }
      });

      if (availableSchedules.length <= 0) {
        this.schedules = [];
        this.errors.set(Constants.Errors.ERROR, "Sem horários disponíveis");
        this.isLoadingTimes = false;
        return;
      }

      this.schedules = availableSchedules;
      this.schedules.sort((a, b) => a.daytimestart!.localeCompare(b.daytimeend!));

      this.isLoadingTimes = false;

    });

  }

  getBarbers() {
    if (this.selected === null || this.selected === undefined)
      return;

    if (this.selectedService.serviceid != null && this.form.get('barber')?.valid) {
      this.getSchedules();
      return;
    }

    if (this.barbers.length > 0)
      return;

    if (this.selected != this.oldSelection) {
      this.oldSelection = this.selected;

      this.isLoadingBarbers = true;

      this.barberService.getAllBarbers()?.pipe(catchError(ErrorHandler.handleError)).subscribe((barbers) => {

        if (barbers instanceof Map) {
          this.errors = barbers;
          this.isLoadingBarbers = false;
          return;
        }

        this.barbers = <UserModel[]>barbers;

        this.isLoadingBarbers = false;

      });

    }

  }

  createOrder() {
    if (this.selected == null || this.selected == undefined)
      return alert("Escolha um dia!");

    let form = this.form;

    if (!form.valid) {

      if (form.get("barber")?.invalid)
        return alert("Escolha um barbeiro");

      else if (form.get("service")?.invalid)
        return alert("Escolha um serviço");

      else if (form.get("schedule")?.invalid)
        return alert("Escolha um horário!");

      return alert("Selecione algum serviço");
    }

    let userInfo: Map<string, string> | null = this.authService.getTokenInformation();

    if (userInfo == null)
      return;

    let index = this.schedules.findIndex((value) => value.daytimeid === form.get("schedule")?.value);
    if (index == null)
      return;
    this.selectedSchedule = this.schedules[index];


    let service = this.services.findIndex((value) => value.serviceid === form.get("service")?.value);
    if (service == null)
      return;
    this.selectedService = this.services[service];


    let orderModel: OrdersModel = {};

    orderModel.order_userid = userInfo.get(Constants.Keys.SESSION_CLIENT_ID);
    orderModel.order_userphone = "";
    orderModel.barberid = this.form.get('barber')?.value;
    orderModel.order_daytimeid = this.selectedSchedule.daytimeid;
    orderModel.order_serviceid = this.selectedService.serviceid;
    orderModel.order_servicedescription = this.selectedService.servicedescription;
    orderModel.order_servicevalue = this.selectedService.servicevalue;
    orderModel.order_willusemoretime = this.selectedService.usesmoretime;

    if (userInfo.get(Constants.Keys.ROLE) !== Constants.Roles.USER) {
      if (form.get("userPhone")?.value == null || form.get("userPhone")?.value == "")
        return alert("Insira o número do cliente!")

      orderModel.order_userphone = form.get("userPhone")?.value;
    }

    orderModel.barberid = this.form.get('barber')?.value;

    this.isLoading = true;

    this.ordersService.createOrder(orderModel).pipe(catchError(ErrorHandler.handleError)).subscribe((value) => {

      if (value instanceof Map) {
        this.snackBar.open(`${value.get("ERROR")} ⛔`,
          "OK",
          { duration: 5000, panelClass: ['blue-snackbar'] }
        );
        this.isLoading = false;
        return;
      }

      this.snackBar.open("Horário agendado ✅",
        "OK",
        { duration: 5000, panelClass: ['blue-snackbar'] }
      );

      this.isLoading = false;

      if (userInfo?.get(Constants.Keys.ROLE) == Constants.Roles.ADMIN) {
        this.router.navigate(['logged/admin']);
        return;
      }

      if (userInfo?.get(Constants.Keys.ROLE) == Constants.Roles.BARBER) {
        this.router.navigate(['logged/barber']);
        return;
      }

      this.router.navigate(['logged/orders-history']);


    });


  }

}
