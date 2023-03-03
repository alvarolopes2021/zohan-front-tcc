import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-list-tile',
  templateUrl: './list-tile.component.html',
  styleUrls: ['./list-tile.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ListTileComponent implements OnInit {

  @Input()
  leading: any;

  @Input()
  leadingInfo: string = "";

  @Input()
  leadingSubInfo: string = "";

  @Input()
  tag: string = "";

  @Input()
  title: string = "";

  @Input()
  subinfo: any; 

  @Input() actionText: string = "";

  @Input() data : any;

  @Output() action = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  callAction(){
    this.action.next(this.data);
  }

}
