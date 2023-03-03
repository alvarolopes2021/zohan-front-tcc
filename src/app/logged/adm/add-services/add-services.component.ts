import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError } from 'rxjs';

import { ServicesModel } from 'src/app/models/services.model';
import { ErrorHandler } from 'src/app/services/errorHandler';
import { ServicesService } from 'src/app/services/services.service';
import { IconServiceService } from 'src/assets/icon-service.service';

@Component({
  selector: 'app-add-services',
  templateUrl: './add-services.component.html',
  styleUrls: ['./add-services.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AddServicesComponent implements OnInit {

  form = new FormGroup({
    serviceToInsert: new FormControl('')
  })

  icons: Map<string, any> = new Map<string, any>();

  services: ServicesModel[] = [];

  constructor(
    private iconService: IconServiceService,
    private servicesService: ServicesService,
    private snackBar: MatSnackBar
  ) { }


  ngOnInit(): void {
    this.icons = this.iconService.getIcons();
    this.servicesService.getServices()?.pipe(catchError(ErrorHandler.handleError)).subscribe((services) => {
      if (services instanceof Map) {
        return;
      }

      this.services = <ServicesModel[]>services;
    })
  }

  addToList() {
    let serviceModel: ServicesModel = {};

    serviceModel.serviceid = (this.services.length + 1).toString();
    serviceModel.servicedescription = "CORTE";
    serviceModel.servicevalue = "R$25.00"

    let nextId = 0;
    if (this.services.length > 0) {
      let lastId = this.services[this.services.length - 1].serviceid;

      if (lastId != null && lastId != undefined) {
        nextId = parseInt(lastId) + 1;
        serviceModel.serviceid = nextId.toString();
      }
    }

    this.servicesService.insertServices([serviceModel])?.pipe(catchError(ErrorHandler.handleError)).subscribe((service) => {

      if (service instanceof Map) {
        return;
      }

      this.services.push(<ServicesModel>service[0]);

    })

  }

  deleteFromList(item: ServicesModel) {

    let op = confirm("Deseja deletar este serviço?");

    if (!op)
      return;

    if (this.services.includes(item)) {
      let index = this.services.indexOf(item);

      if (index != -1) {

        this.servicesService.deleteService([item.serviceid!])?.pipe(catchError(ErrorHandler.handleError)).subscribe((service) => {

          if (service instanceof Map) {
            return;
          }

          this.services.splice(index, 1);

          this.snackBar.open("Serviços deletado ✅",
            "OK",
            { duration: 5000, panelClass: ['blue-snackbar'] }
          );

        });

      }
    }
  }

  editItemInList(item: ServicesModel) {
    let editDescription = "description_";
    let editValue = "value_";

    if (item.serviceid !== undefined) {

      let descriptionById = document.getElementById(editDescription + item.serviceid) as HTMLInputElement;
      let valueById = document.getElementById(editValue + item.serviceid) as HTMLInputElement;

      if (descriptionById != null && descriptionById !== undefined && valueById !== null && valueById != undefined) {

        let index = this.services.indexOf(item);
        if (index != -1) {

          let copy = this.services[index];
          copy.servicedescription = descriptionById.value;
          copy.servicevalue = valueById.value;

          this.servicesService.updateService(copy)?.pipe(catchError(ErrorHandler.handleError)).subscribe((value) => {

            if (value instanceof Map) {
              return;
            }

            this.services[index].servicedescription = descriptionById.value;
            this.services[index].servicevalue = valueById.value;

          })
        }
      }

      let descriptionSpan = document.getElementsByClassName("description") as HTMLCollection;
      let valueSpan = document.getElementsByClassName("value") as HTMLCollection;

      if (descriptionSpan !== null && valueSpan !== null) {

        for (let i = 0; i < descriptionSpan.length; i++) {

          if (descriptionSpan[i].id.toString() === item.serviceid) {

            if (descriptionById != null && descriptionById !== undefined && valueById !== null && valueById != undefined) {
              descriptionSpan[i].innerHTML = `<span id="${item.serviceid}" class="description">${item.servicedescription}</span>`;

              valueSpan[i].innerHTML = `<span id="${item.serviceid}" class="value">${item.servicevalue}</span>`;

              return;
            }

            descriptionSpan[i].innerHTML =
              `<input type='text' value='${item.servicedescription}' id='${editDescription + item.serviceid}' class='description'>`;

            valueSpan[i].innerHTML =
              `<input type='text' value='${item.servicevalue}' id='${editValue + item.serviceid}' class='value'>`;
          }
        }

      }
    }
  }

  willUseMoreTime(event: any, service: ServicesModel){
    service.usesmoretime = event.target.checked;
    this.servicesService.updateService(service)?.pipe(catchError(ErrorHandler.handleError)).subscribe((value) => {
      if(value instanceof Map){
        return;
      }

      this.services[this.services.findIndex(predicate => predicate.serviceid == service.serviceid)] = service;

    });
  }

  addServices() {
    this.servicesService.insertServices(this.services)?.pipe(catchError(ErrorHandler.handleError)).subscribe((value) => {
      if (value instanceof Map) {
        return;
      }

      this.snackBar.open("Serviços cadastrados com sucesso ✅",
        "OK",
        { duration: 5000, panelClass: ['blue-snackbar'] }
      );

    });
  }


}
