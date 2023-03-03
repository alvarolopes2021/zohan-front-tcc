import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-snack-bar',
  templateUrl: './snack-bar.component.html',
  styleUrls: ['./snack-bar.component.css']
})
export class SnackBarComponent implements OnInit {


  @Input()
  message: string = "";
  
  constructor() { }

  ngOnInit(): void {
  }

}
