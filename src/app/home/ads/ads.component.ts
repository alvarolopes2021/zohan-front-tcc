import { Component, OnInit } from '@angular/core';
import { catchError } from 'rxjs';
import { AdsService } from 'src/app/services/ads.service';
import { ErrorHandler } from 'src/app/services/errorHandler';
import { UtilService } from 'src/app/utils/util.service';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
export class AdsComponent implements OnInit {

  ad?: string | null;

  constructor(
    private adsService: AdsService,
    private utils: UtilService
  ) { }

  ngOnInit(): void {

    this.utils.checkIsLoggedIn();

    this.adsService.getAds()?.pipe(catchError(ErrorHandler.handleError)).subscribe((ads) => {

      if(ads instanceof Map){
        return;
      }
      
      if(ads == null || ads == undefined)
        return;

      let adsArray = <string[]>ads;

      if (adsArray.length <= 0)
        return;

      this.ad = ads.addescription;

      let adh3 = document.getElementById("ad");

      if (adh3 !== null && adh3 !== undefined && this.ad !== null && this.ad !== undefined)
        adh3.innerText = this.ad;

    });
  }

}
