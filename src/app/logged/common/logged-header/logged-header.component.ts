import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-logged-header',
  templateUrl: './logged-header.component.html',
  styleUrls: ['./logged-header.component.css']
})
export class LoggedHeaderComponent implements OnInit {

  @Input()
  title: string = "";

  constructor() { }

  ngOnInit(): void {
  }

}
