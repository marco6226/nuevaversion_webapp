import { Component, Input, OnInit } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-list-table',
  templateUrl: './list-table.component.html',
  styleUrl: './list-table.component.scss'
})
export class ListTableComponent implements OnInit{


  @Input() columns: string [] = [];
  @Input() listTable: any  []  = [];

  ngOnInit(): void {
    console.log("listTable: ", this.listTable);
    console.log("columns: ", this.columns);
  }
  getValue(object: any, column: string): any {
    let columnCamelCase = this.toCamelCase(column);
    if(columnCamelCase === "paginaWeb"){
      columnCamelCase = "web";
    }else if(columnCamelCase == "arl"){
      return object[columnCamelCase].nombre !== undefined ? object[columnCamelCase].nombre: '';
    }else if(columnCamelCase === "codigoCiiu"){
      columnCamelCase = "ciiu";
      return object[columnCamelCase].codigo !== undefined ? object[columnCamelCase].codigo: '';
    }else if(columnCamelCase === "nombreIiu"){
      columnCamelCase = "ciiu";
      return object[columnCamelCase].nombre !== undefined ? object[columnCamelCase].nombre: '';
    }
    return object[columnCamelCase] !== undefined ? object[columnCamelCase] : '';
  }

  toCamelCase(str:string) {
    // Normalizar la cadena para eliminar tildes y convertir a minúsculas
    str = str
      .normalize("NFD") // Descomponer caracteres acentuados en sus componentes
      .replace(/[\u0300-\u036f]/g, "") // Eliminar los acentos
      .toLowerCase(); // Convertir toda la cadena a minúsculas
  
    // Eliminar conectores comunes
    const conectores = ["de", "en", "y", "a", "la", "el", "del"];
    str = str.split(' ').filter(word => !conectores.includes(word)).join(' ');
  
    // Convertir a camelCase
    return str
      .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => 
        index === 0 ? match.toLowerCase() : match.toUpperCase()
      )
      .replace(/\s+/g, ''); // Eliminar espacios
  }
}
