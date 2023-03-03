import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';
import { OrdersModel } from 'src/app/models/orders.model';
import { ErrorHandler } from 'src/app/services/errorHandler';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.component.html',
  styleUrls: ['./all-orders.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AllOrdersComponent implements OnInit {

  orders: OrdersModel[] = [];

  mode: ProgressSpinnerMode = 'indeterminate';
  isLoading: boolean = false;


  constructor(
    private ordersService: OrdersService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.isLoading = true;

    this.ordersService.getAllOrders()?.pipe(catchError(ErrorHandler.handleError)).subscribe((orders) => {

      if (orders instanceof Map) {
        this.orders = [];
        this.isLoading = false;
        return;
      }

      if (orders.length == 0){
        this.isLoading = false;
        return;
      }

      this.orders = <OrdersModel[]>orders;

      let i = 0;
      this.orders.forEach((element) => {
        this.orders[i].order_daytimeday = element.order_daytimeday?.split("T")[0];
        this.orders[i].canCancelOrder = this.canCancelOrder(element);
        i++;
      });

      this.orders = this.orders
        .sort((a, b) => b.order_daytimeday!.localeCompare(a.order_daytimeday!) || b.order_daytimepretty!.localeCompare(a.order_daytimepretty!));

      this.isLoading = false;
    });
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

  markAsAbsent(order: OrdersModel) {
    let canCancel = this.canCancelOrder(order);

    if(canCancel)
      return;
      
    if (order.isabsent) {
      let op = confirm(order.order_username + " será considerado como presente no dia " + order.order_daytimeday?.split('-').reverse().join('/') + " " + order.order_daytimestart);
      if (!op)
        return;
      
      order.isabsent = false;
    }
    else{
      let op = confirm(order.order_username + " será considerado como faltoso no dia " + order.order_daytimeday?.split('-').reverse().join('/') + " " + order.order_daytimestart);
      if (!op)
        return;
      
      order.isabsent = true;
    }

    this.ordersService.markAsAbsent(order).pipe(catchError(ErrorHandler.handleError)).subscribe((result) => {

    });

  }

  cancelOrder(order: OrdersModel) {
    if (order == null)
      return;


    let date = order.order_daytimeday?.split("-").reverse().join("/");
    let op =
      confirm(`Deseja cancelar o agendamento? ⛔\n${order.order_userid}\n${order.order_daytimestart} ${date}`);

    if (!op)
      return;

    this.ordersService.cancelOrder(order.orderid!).pipe(catchError(ErrorHandler.handleError)).subscribe((result) => {

      if (result instanceof Map) {
        return;
      }

      this.orders.splice(this.orders.indexOf(order), 1);

      this.snackBar.open("Agendamento cancelado ✅",
        "OK",
        { duration: 5000, panelClass: ['blue-snackbar'] }
      );


    });

  }

}
