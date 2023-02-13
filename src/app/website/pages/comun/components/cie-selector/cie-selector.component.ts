import { Component, OnInit, Output, EventEmitter, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl } from '@angular/forms'
import { Cie } from 'src/app/website/pages/comun/entities/cie'
import { ComunService } from 'src/app/website/pages/comun/services/comun.service'

@Component({
  selector: 's-cieSelector',
  templateUrl: './cie-selector.component.html',
  styleUrls: ['./cie-selector.component.scss'],
  providers: [{
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CieSelectorComponent),
      multi: true
  }]
})
export class CieSelectorComponent implements OnInit, ControlValueAccessor {

  @Output() dateChange = new EventEmitter<any>()
  @Input() _value?: Cie | null;
  @Input("readOnly") disabled?: boolean;
  propagateChange = (_: any) => { };
  cieList?: Cie[];

  constructor(
    private comunService: ComunService,
  ) { }

  ngOnInit(): void {
  }
  onSelect(event:any) {
    this.value = event;
    this.dateChange.emit(event)
}

buscarCie(event:any) {
  this.comunService.buscarCie(event.query).then(
      data => this.cieList = <Cie[]>data
  );
}
resetCie() {
  if (!this.disabled) {
      this._value = null;
  }
}

  writeValue(value: Cie) {
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
  registerOnChange(fn:any) {
    this.propagateChange = fn;
  }
}
