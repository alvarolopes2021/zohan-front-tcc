import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';

import { OrdersModel } from 'src/app/models/orders.model';
import { AuthService } from 'src/app/services/auth.service';
import { ErrorHandler } from 'src/app/services/errorHandler';
import { OrdersService } from 'src/app/services/orders.service';
import { UtilService } from 'src/app/utils/util.service';
import { Constants } from 'src/constants';

@Component({
  selector: 'app-barber-home',
  templateUrl: './barber-home.component.html',
  styleUrls: ['./barber-home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BarberHomeComponent implements OnInit {

  orderBinding: OrdersModel[] = [];

  mode: ProgressSpinnerMode = 'indeterminate';
  isLoading: boolean = false;

  constructor(
    private ordersService: OrdersService,
    private authService: AuthService,
    private utils: UtilService,
    private snackBar: MatSnackBar
  ) { }


  ngOnInit(): void {
    let userInfo: Map<string, string> | null = this.authService.getTokenInformation();

    if (userInfo == null)
      return;

    this.isLoading = true;

    this.ordersService.getNextOrdersByBarberId(userInfo.get(Constants.Keys.SESSION_CLIENT_ID)!).pipe(catchError(ErrorHandler.handleError)).subscribe((orders) => {

      if (orders instanceof Map) {
        return;
      }

      this.orderBinding = <OrdersModel[]>orders;

      let i = 0;
      this.orderBinding.forEach((element) => {
        this.orderBinding[i].order_daytimeday = this.orderBinding[i].order_daytimeday?.split("T")[0];
        this.orderBinding[i].canCancelOrder = this.canCancelOrder(element);
        i++;
      });

      this.orderBinding = this.orderBinding.filter(this.checkIfIsNextOrder);

      //sort by date and order time
      this.orderBinding.sort((a, b) =>
        a.order_daytimeday!.localeCompare(b.order_daytimeday!) || a.order_daytimepretty!.localeCompare(b.order_daytimepretty!)
      );

      this.isLoading = false;

    });
  }

  checkIfIsNextOrder(element: OrdersModel): Boolean {
    let today = new Date();
    today.setHours(today.getHours() - 3);
    let todayFormatted = today.toISOString();
    let todayDate = todayFormatted.split("T")[0];

    if (element.order_daytimeday == todayDate && element.order_daytimestart! < new Date().toLocaleTimeString('en-GB')) {
      return false;
    }
    return true;
  }


  canCancelOrder(order: OrdersModel) {
    let today = new Date();
    today.setHours(today.getHours() - 3);
    let todayFormatted = today.toISOString();
    let todayDate = todayFormatted.split("T")[0];
    let todayTime = todayFormatted.split("T")[1].split(".")[0];

    if (
      order.order_daytimeday?.split("T")[0]! < todayDate ||
      (order.order_daytimeday?.split("T")[0]! == todayDate && order.order_daytimestart! < todayTime)
    ) {

      return false;
    }

    return true;

  }

  cancelOrder(order: OrdersModel) {
    if (order == null)
      return;


    let date = order.order_daytimeday?.split("-").reverse().join("/");
    let op =
      confirm(`Deseja cancelar o agendamento? ⛔\n${order.order_username}\n${order.order_daytimestart} ${date}`);

    if (!op)
      return;

    this.ordersService.cancelOrder(order.orderid!).pipe(catchError(ErrorHandler.handleError)).subscribe((result) => {

      if (result instanceof Map) {
        return;
      }

      this.orderBinding.splice(this.orderBinding.indexOf(order), 1);

      this.snackBar.open("Agendamento cancelado ✅",
        "OK",
        { duration: 5000, panelClass: ['blue-snackbar'] }
      );


    });

  }

}
