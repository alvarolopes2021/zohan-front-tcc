import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DateRange } from '@angular/material/datepicker';
import { Moment } from 'moment';
import { Constants } from 'src/constants';

@Injectable({
  providedIn: 'root'
})
export class RevenueService {

  constructor(
    private http : HttpClient
  ) { }

  consult(dateRange : DateRange<Moment>, barberId: string){
    let data = JSON.stringify({
      "start": dateRange.start,
      "end": dateRange.end,
      "barberid": barberId == "" || barberId == null ? null : barberId
    })
    let params = new HttpParams().append(Constants.Keys.REVENUE_PARAMS, data);
    
    return this.http.get(Constants.HttpEndpoints.Revenue.GET_REVENUE, {params: params});
  }
}
