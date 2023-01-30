import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { Empleado } from 'src/app/website/pages/empresa/entities/empleado'
import { EmpleadoService } from 'src/app/website/pages/empresa/services/empleado.service'
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms'

@Component({
  selector: 'app-empleado-selector',
  templateUrl: './empleado-selector.component.html',
  styleUrls: ['./empleado-selector.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EmpleadoSelectorComponent),
    multi: true
  }]
})
export class EmpleadoSelectorComponent implements OnInit {

  @Input() value?: Empleado | null;
  @Input("readOnly") disabled?: boolean;
  @Output("onSelect") onSelect = new EventEmitter<Empleado>();
  propagateChange = (_: any) => { };
  empleadosList?: Empleado[];

  constructor(
    private empleadoService: EmpleadoService,
  ) { }

  ngOnInit(): void {
  }
  onSelection(event:any) {
    this.value = event;
    if(this.value)
    this.onSelect.emit(this.value);
  }

  // Component methods
  buscarEmpleado(event:any) {
    this.empleadoService.buscar(event.query).then(
      data => this.empleadosList = <Empleado[]>data
    );
  }

  resetEmpleado() {
    if (!this.disabled) {
      this.value = null;
    }
  }
}
