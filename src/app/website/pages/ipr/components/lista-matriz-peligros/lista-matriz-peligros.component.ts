import { Component,OnInit } from '@angular/core';
import { MatrizPeligrosService } from '../../../core/services/matriz-peligros.service';
import { MatrizPeligros } from '../../../comun/entities/Matriz-peligros';

@Component({
  selector: 'app-lista-matriz-peligros',
  templateUrl: './lista-matriz-peligros.component.html',
  styleUrls: ['./lista-matriz-peligros.component.scss']
})
export class ListaMatrizPeligrosComponent  implements OnInit {
  matrizPList: MatrizPeligros[] = [];
  matrizSelect!: MatrizPeligros;

  constructor( 
    private matrizPeligrosService: MatrizPeligrosService,
  ) { }

  async ngOnInit() {
    await this.matrizPeligrosService.getForEmpresa().then((resp:any)=>{
      this.matrizPList = (<MatrizPeligros[]>resp).map(matriz => matriz);
    })
    console.log(this.matrizPList)
  }
  

}
