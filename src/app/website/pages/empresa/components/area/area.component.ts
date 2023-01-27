import { Component, OnInit, ViewChild } from '@angular/core';
import { ChangeEventArgs as NumericChangeEventArgs } from '@syncfusion/ej2-inputs';
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
