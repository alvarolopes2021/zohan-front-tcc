import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constants } from 'src/constants';
import { BarberTimeModel } from '../models/barberTime.model';

@Injectable({
  providedIn: 'root'
})
export class BarberTimeService {

  constructor(
    private http: HttpClient
  ) { }


  assignBarberToTime(item: BarberTimeModel): Observable<any> | null {
    return this.http.post(Constants.HttpEndpoints.BarberTime.ASSIGN_BARBER_TIME, item);
  }

  assignListToBarberTime(item: BarberTimeModel[]): Observable<any> | null {
    return this.http.post(Constants.HttpEndpoints.BarberTime.ASSIGN_LIST_TO_BARBER_TIME, item);
  }

  removeAssignmentToTime(item: BarberTimeModel): Observable<any> | null {

    if (item == null || item == undefined)
      return null;

    let params: HttpParams =
      new HttpParams().append(Constants.Keys.BARBERTIME_USERID, item.barbertime_userid!).append(Constants.Keys.BARBERTIME_DAYTIMEID, item.barbertime_daytimeid!);

    return this.http.delete(Constants.HttpEndpoints.BarberTime.REMOVE_ASSIGNMET_TO_TIME, { params: params });
  }
}
