import { Component, OnInit } from '@angular/core';
import { IconServiceService } from 'src/assets/icon-service.service';

@Component({
  selector: 'app-forbiden',
  templateUrl: './forbiden.component.html',
  styleUrls: ['./forbiden.component.css']
})
export class ForbidenComponent implements OnInit {


  icons: Map<string, any> = new Map<string, any>();

  constructor(
    private iconsService: IconServiceService
  ) { }

  ngOnInit(): void {
    this.icons = this.iconsService.getIcons();
  }

}
