import { Component, OnInit } from '@angular/core';
import { UtilService } from 'src/app/utils/util.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  constructor(
    private utils: UtilService
  ) { }

  ngOnInit(): void {
    this.utils.checkIsLoggedIn();
  }

}
