import { Component, OnInit, Input } from '@angular/core';
import { Desempeno, IdentificacionFC } from 'src/app/website/pages/comun/entities/factor-causal';

@Component({
  selector: 'app-identificacion-factor-causal',
  templateUrl: './identificacion-factor-causal.component.html',
  styleUrls: ['./identificacion-factor-causal.component.scss']
})
export class IdentificacionFactorCausalComponent implements OnInit {

  @Input()identificacionFc!: Desempeno | null
  @Input()factor!: IdentificacionFC | null

  selectedValues: string[] = [];
  value!: boolean

  constructor() { }

  ngOnInit(): void {
  }

 
}
