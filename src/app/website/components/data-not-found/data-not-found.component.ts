import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-dataNotFound',
  templateUrl: './data-not-found.component.html',
  styleUrls: ['./data-not-found.component.scss']
})
export class DataNotFoundComponent implements OnInit {

  @Input('icon') icon!: string;
  @Input('message') message!: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
