import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';

import { ErrorHandler } from 'src/app/services/errorHandler';
import { OrdersService } from 'src/app/services/orders.service';
import { UserService } from 'src/app/services/user.service';
import { OrdersModel } from 'src/app/models/orders.model';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminHomeComponent implements OnInit {

  nextOrders: OrdersModel[] = [];
  
  mode: ProgressSpinnerMode = 'indeterminate';
  isLoading: boolean = false;

  constructor(
    private ordersService: OrdersService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    
  ) { }

  ngOnInit(): void {

    this.userService.requestPushSubscription();
   
    this.isLoading = true;

    this.ordersService.getNextOrders().pipe(catchError(ErrorHandler.handleError)).subscribe((orders) => {

      if (orders instanceof Map) {
        return;
      }

      this.nextOrders = <OrdersModel[]>orders;

      let i = 0;
      this.nextOrders.forEach((element) => {
        this.nextOrders[i].order_daytimeday = this.nextOrders[i].order_daytimeday?.split("T")[0];
        this.nextOrders[i].canCancelOrder = this.canCancelOrder(element);
        i++;
      });

      this.nextOrders = this.nextOrders.filter(this.checkIfIsNextOrder);

      this.nextOrders = this.nextOrders.sort((a, b) => a.order_daytimeday!.localeCompare(b.order_daytimeday!) || a.order_daytimepretty!.localeCompare(b.order_daytimepretty!));

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

    if (order.order_daytimeday?.split("T")[0]! <= todayDate && order.order_daytimestart! < todayTime) {
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

      this.nextOrders.splice(this.nextOrders.indexOf(order), 1);

      this.snackBar.open("Agendamento cancelado ✅",
        "OK",
        { duration: 5000, panelClass: ['blue-snackbar'] }
      );


    });

  }

}
