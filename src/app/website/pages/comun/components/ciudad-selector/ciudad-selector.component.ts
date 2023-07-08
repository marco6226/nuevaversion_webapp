import { Component, OnInit, Input, forwardRef, HostBinding } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms'
import { SelectItem } from 'primeng/api';
import { Ciudad } from '../../entities/ciudad';
import { Departamento } from '../../entities/departamento';
import { ComunService } from '../../services/comun.service';

@Component({
    selector: 's-ciudadSelector',
    templateUrl: './ciudad-selector.component.html',
    styleUrls: ['./ciudad-selector.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CiudadSelectorComponent),
            multi: true
        }
    ]
})
export class CiudadSelectorComponent implements OnInit, ControlValueAccessor {
    id!: string;
    @Input("id") 
    set id2(id: string){
        this.id=id
        this.updateUI()
    }
    _value!: Ciudad | null;
    @Input("_value")
    set value2(_value: Ciudad){
        console.log(_value)
        this._value=_value
        this.updateUI()
    }
    @Input('disabled') disabled: boolean = false;
    @Input() styleRow: string = 'row g-2 mb-3';
    @Input() styleCol: string = 'col-6';
    @Input() inputStyle: string = 'form-control';
    @Input() labelText: string = 'Departamento y Ciudad'; 

    departamentoSelectId!: string;
    departamentosItems: SelectItem[] = [];
    ciudadesItems: SelectItem[] = [];

    propagateChange = (_: any) => { };

    constructor(
        private comunService: ComunService
    ) {

    }

    // Interface implements
    ngAfterViewInit(){
        this.ciudadesItems.push({ label: '--Ciudad--', value: null });
        this.departamentosItems.push({ label: '--Departamento--', value: null });
        this.comunService.findDepartamentoByPais("1").then(
            data => this.loadDepartamentosItems(<Departamento[]>data)
        );
    }
    ngOnInit() {

    }

    writeValue(value: Ciudad) {
        this.value = value;
    }
    setDisabledState(isDisabled: boolean): void {
      }

    registerOnTouched() { }

    memori:any
    get value() {
        if(this._value != null)
        this.memori=this._value

        return this._value;
    }

    set value(val) {
        // console.log(val)
        this._value = val;
        this.propagateChange(this._value);
        this.updateUI();
    }


    // Component methods

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    async loadDepartamentosItems(departamentos: Departamento[]) {
        await this.departamentosItems.splice(1, this.ciudadesItems.length);
        departamentos.forEach(depto => {
      this.departamentosItems.push({ label: depto.nombre, value: depto.id });
        });
    }

    onDepartamentoChange(event: any) {
        this.value = null;
        this.loadCiudades(event.value);
    }

    async loadCiudades(departamentoId: string) {
        await this.comunService.findCiudadByDepartamento(departamentoId).then(
            data => this.loadCiudadesItems(<Ciudad[]>data)
        );
    }

    loadCiudadesItems(ciudades: Ciudad[]) {
        this.ciudadesItems.splice(1, this.ciudadesItems.length);
        ciudades.forEach(ciudad => {
            if (this.value != null && ciudad.id == this.value.id) {
                this._value = ciudad;
            }
            this.ciudadesItems.push({ label: ciudad.nombre, value: ciudad });
        });
    }

    updateUI() {
        // console.log(this.value)
        // setTimeout(() => {
            if (this.value != null) {
                this.departamentoSelectId = this.value?.departamento?.id!;
                this.loadCiudades(this.departamentoSelectId);
            } else {} 
        // }, 3000);
    }
}
