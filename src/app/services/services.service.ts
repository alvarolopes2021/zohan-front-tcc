import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


import { Constants } from 'src/constants';
import { ServicesModel } from '../models/services.model';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private http: HttpClient) { }

  insertServices(servicesModelList: ServicesModel[]) : Observable<any> | null{
    return this.http.post<any>(Constants.HttpEndpoints.Services.ADD_SERVICES, servicesModelList);
  }

  getServices() : Observable<any> | null {
    return this.http.get<any>(Constants.HttpEndpoints.Services.GET_SERVICES);
  }

  deleteService(serviceId: string[]): Observable<any> | null {
    if(serviceId == null || serviceId == undefined)
      return null;

    let params = new HttpParams().append(Constants.Keys.SERVICE_ID, serviceId.toString());

    return this.http.delete(Constants.HttpEndpoints.Services.DELETE_SERVICES, {params: params});
  }

  updateService(serviceModel: ServicesModel): Observable<any> | null {
    if(serviceModel == null || serviceModel == undefined)
      return null;

    return this.http.put(Constants.HttpEndpoints.Services.UPDATE_SERVICES, serviceModel);
  }

}
