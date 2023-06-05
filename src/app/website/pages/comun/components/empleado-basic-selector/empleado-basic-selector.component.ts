import { Component, OnInit, forwardRef, Input, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Criteria } from '../../../core/entities/filter';
import { FilterQuery } from '../../../core/entities/filter-query';
import { EmpleadoBasic } from '../../../empresa/entities/empleado-basic';
import { EmpleadoService } from '../../../empresa/services/empleado.service';

@Component({
  selector: 's-empleadoBasicSelector',
  templateUrl: './empleado-basic-selector.component.html',
  styleUrls: ['./empleado-basic-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EmpleadoBasicSelectorComponent),
      multi: true
    },
    EmpleadoService
  ]
})
export class EmpleadoBasicSelectorComponent implements OnInit, ControlValueAccessor {


  @Input() _value!: EmpleadoBasic | null;
  @Input("readOnly") disabled!: boolean;
  @Input("empresaEmpleadora") empEmpleadora: number | null = null;
  @Output("onSelect") onSelect = new EventEmitter<EmpleadoBasic | null>();
  propagateChange = (_: any) => { };
  empleadosList: EmpleadoBasic[] = [];

  fields: string[] = [
    'id',
    'primerNombre',
    'primerApellido',
    'numeroIdentificacion', 
    'usuarioBasic'
  ];
  selectedField: any = 1;

  constructor(
    private empleadoService: EmpleadoService,
  ) { }

  ngOnInit() {
  }

  writeValue(value: EmpleadoBasic) {
    this.value = value;
  }

  registerOnTouched() { }


  get value() {
    return this._value;
  }

  set value(val) {
    this._value = val;
    this.propagateChange(this._value);
  }

  registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  async buscarEmpleado(event:any) {

    let filterQuery = new FilterQuery();
    filterQuery.sortField = event.sortField;
    filterQuery.sortOrder = event.sortOrder;
    filterQuery.offset = event.first;
    filterQuery.rows = event.rows;
    filterQuery.count = true;

    filterQuery.fieldList = this.fields;
    filterQuery.filterList = FilterQuery.filtersToArray(event.filters);

    for (let i = 1; i < this.fields.length; i++) {
      filterQuery.filterList.pop();
      if(this.fields[i] != 'usuarioBasic'){
        filterQuery.filterList.push({ criteria: Criteria.LIKE, field: this.fields[i], value1: '%'+event.query+'%'});
      }else{
        filterQuery.filterList.push({ criteria: Criteria.LIKE, field: 'usuarioBasic.email', value1: '%'+event.query+'%'});
      }

      if(this.empEmpleadora){
        filterQuery.filterList.push(
          {criteria: Criteria.EQUALS, field: 'cargo.empresa.id', value1: this.empEmpleadora.toString()}
        );
      }

      let terminarBusqueda = false;
      await this.empleadoService.findByFilter(filterQuery).then(
        (data: any) => {
          let datos: EmpleadoBasic[] = data.data;
          if(datos.length > 0){
            this.empleadosList = datos;
            terminarBusqueda = true;
          }
        }
      );
      if(terminarBusqueda) break;
    }

  }
  
  onSelection(event: any) {
    this.value = event;
    this.onSelect.emit(this.value);
  }

  resetEmpleado() {
    if (!this.disabled) {
      this.value = null;
    }
  }
}
