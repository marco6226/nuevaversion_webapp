import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';



@ViewChild('diagram')

@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.scss']
})
export class AreaComponent implements OnInit {

  
  constructor(
    private messageService: MessageService,

  ) { }

  ngOnInit(): void {

  }

}
