import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-empresa-list',
  templateUrl: './empresa-list.component.html',
  styleUrls: ['./empresa-list.component.scss']
})
export class EmpresaListComponent implements OnInit {
  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  @Input() empresasList: SelectItem[] = [];
  @Output() changeEmpresa = new EventEmitter<SelectItem>();
  constructor(private confirmationService: ConfirmationService) { }

  ngOnInit(): void {
  }

  onSelect(empresa: SelectItem){
    this.confirmationService.confirm({
      message: '¿Confirma cambiar a la compañia ' + empresa.label +' ?',
      key: 'empresalist',
      accept: () => {
          //Actual logic to perform a confirmation
          this.changeEmpresa.emit(empresa);
      }
    });
  }

}

interface SelectItem{
  label: string,
  value: string
}