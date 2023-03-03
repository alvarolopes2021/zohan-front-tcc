import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Constants } from 'src/constants';
import { AdsModel } from '../models/ads.model';

@Injectable({
  providedIn: 'root'
})
export class AdsService {

  constructor(private http: HttpClient) { }


  createAd(ad: string) : Observable<any> | null{
    let adsModel : AdsModel = {};
    adsModel.addescription = ad;
    return this.http.post<any>(Constants.HttpEndpoints.Ads.CREATE_AD, adsModel);
  }

  getAds() : Observable<any> | null{
    return this.http.get<any>(Constants.HttpEndpoints.Ads.GET_ADD);
  }
}
