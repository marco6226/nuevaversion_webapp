import {
  Component,
  OnInit,
  Input,
  forwardRef,
  HostBinding,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  FormControl,
} from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { Ciudad } from '../../entities/ciudad';
import { Departamento } from '../../entities/departamento';
import { Pais } from '../../entities/pais';
import { ComunService } from '../../services/comun.service';

@Component({
  selector: 's-ciudadSelector',
  templateUrl: './ciudad-selector.component.html',
  styleUrls: ['./ciudad-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CiudadSelectorComponent),
      multi: true,
    },
  ],
})
export class CiudadSelectorComponent implements OnInit, ControlValueAccessor {
  id!: string;
  @Input('id')
  set id2(id: string) {
    this.id = id;
    this.updateUI();
  }
  _value!: Ciudad | null;
  @Input('_value')
  set value2(_value: Ciudad) {

    console.log(_value);
    if (this._value != null) {
      this.valueIn = _value;
      this.updateUI();
    }
  }

  valueIn: Ciudad | null = null;

  @Input('disabled') disabled: boolean = false;
  @Input() styleRow: string = 'row g-2 mb-3';
  @Input() styleCol: string = 'col-6';
  @Input() inputStyle: string = 'form-control';
  @Input() labelText: string = 'Departamento y Ciudad';

  paisSelectId!: string;
  departamentoSelectId!: string;
  paisItems: SelectItem[] = [];
  departamentosItems: SelectItem[] = [];
  ciudadesItems: SelectItem[] = [];

  propagateChange = (_: any) => { };

  constructor(private comunService: ComunService) { }

  // Interface implements
  async ngAfterViewInit() {
    // this.test()
    this.ciudadesItems.push({ label: '--Ciudad--', value: null });
    this.departamentosItems.push({ label: '--Departamento--', value: null });
    this.paisItems.push({ label: '--Pais--', value: null });

    setTimeout(async () => {

      await this.comunService.findAllPais().then(async (data) => {
        await this.loadPaisItems(<Pais[]>data);
       // if (this.paisSelectId) {
        this.paisSelectId = await this.valueIn?.departamento?.pais.id;
        console.log(this.paisSelectId);
      //};
        

        // Ahora que hemos cargado los países, podemos llamar a findDepartamentoByPais
        if (this.paisSelectId) {
          await this.comunService
            .findDepartamentoByPais(this.paisSelectId)
            .then(async (data) => {
              await this.loadDepartamentosItems(<Departamento[]>data);
              if (this.valueIn?.departamento?.id !== undefined) {
              this.departamentoSelectId = await this.valueIn.departamento.id;
            }

              await this.comunService
                .findCiudadByDepartamento(this.departamentoSelectId)
                .then((data) => {
                  this.loadCiudadesItems(<Ciudad[]>data);
                  this.value = this.valueIn;
                });

            });
        }
      });
    }, 2500);

  }


  ngOnInit() { }

  writeValue(value: Ciudad) {
    this.value = value;
  }
  setDisabledState(isDisabled: boolean): void { }

  registerOnTouched() { }

  memori: any;
  get value() {
    if (this._value != null) this.memori = this._value;

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

  loadDepartamentosItems(departamentos: any[]) {
    this.departamentosItems.splice(1, this.departamentosItems.length - 1);
    departamentos.forEach(depto => {
      this.departamentosItems.push({ label: depto.nombre, value: depto.id });
    });

  }

  async loadPaisItems(paises: any) {
    if (Array.isArray(paises.data)) {
      paises.data.forEach((pais: Pais) => {
        // Aquí se especifica que pais es del tipo Pais
        this.paisItems.push({ label: pais.nombre, value: pais.id });
      });
    } else {
      console.error(
        'La propiedad "data" no es un array en el objeto de países.'
      );
    }
  }

  onPaisSelect(event: any) {
    const selectedPaisId = event.value;
    console.log('País seleccionado ID:', selectedPaisId);
  
    this.departamentosItems = [];
    this.ciudadesItems = [];
  
    if (selectedPaisId) {
      this.comunService
        .findDepartamentoByPais(selectedPaisId)
        .then((data: Departamento[]) => {
          console.log('Departamentos cargados:', data);
          this.loadDepartamentosItems(data);
        })
        .catch(error => {
          console.error('Error al cargar departamentos:', error);
        });
    }
  }

  onDepartamentoChange(event: any) {
    const selectedDepartamentoId = event.value;
    console.log('Departamento seleccionado ID:', selectedDepartamentoId);
  
    this.value = null;
    this.ciudadesItems = [];
  
    if (selectedDepartamentoId) {
      this.loadCiudades(selectedDepartamentoId);
    }
  }

  // onDepartamentomexChange(event: any) {
  //   this.value = null;
  //   if (event.value) this.loadCiudadesmex(event.value);
  //   else this.ciudadesItems = [];
  // }

  async loadCiudades(departamentoId: string) {
    console.log('Cargando ciudades para el departamento ID:', departamentoId);
  
    this.ciudadesItems.splice(2, this.ciudadesItems.length); // Limpiar la lista antes de agregar nuevas ciudades
    await this.comunService
      .findCiudadByDepartamento(departamentoId)
      .then((data) => {
        console.log('Ciudades cargadas:', data);
        this.loadCiudadesItems(<Ciudad[]>data);
      })
      .catch(error => {
        console.error('Error al cargar ciudades:', error);
      });
  }
  // async loadCiudadesmex(departamentoId: string) {
  //   await this.comunService
  //     .findCiudadByDepartamento(departamentoId)
  //     .then((data) => this.loadCiudadesmexico(<Ciudad[]>data));
  // }

  loadCiudadesItems(ciudades: Ciudad[]) {
    this.ciudadesItems.splice(2, this.ciudadesItems.length);
    ciudades.forEach((ciudad) => {
      this.ciudadesItems.push({ label: ciudad.nombre, value: ciudad });
    });
  }

  // loadCiudadesmexico(ciudades: Ciudad[]) {
  //   this.ciudadesItems.splice(2, this.ciudadesItems.length);
  //   ciudades.forEach((ciudad) => {
  //     if (this.value != null && ciudad.id == this.value.id) {
  //       this._value = ciudad;
  //     }
  //     this.ciudadesItems.push({ label: ciudad.nombre, value: ciudad });
  //   });
  // }


  updateUI() {
    // console.log(this.value)
    for (let i = 0; i < 4; i++) {
    setTimeout(() => {
      if (this.value != null) {
        this.paisSelectId = this.value?.departamento?.pais?.id;

        this.departamentoSelectId = this.value?.departamento?.id!;

        this.loadCiudades(this.departamentoSelectId);

      } else {

      }
      }, 2000);
    }
  }
}
