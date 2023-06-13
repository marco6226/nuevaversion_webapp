import { Component, ElementRef, ViewChild,OnInit } from '@angular/core';
import SignaturePad from 'signature_pad';
import { Empresa } from '../../../empresa/entities/empresa';
import { SesionService } from '../../../core/services/session.service';
import { ActivatedRoute } from "@angular/router";
import { firmaservice } from 'src/app/website/pages/core/services/firmas.service';
import{firma} from 'src/app/website/pages/comun/entities/firma'

@Component({
  selector: 'app-firma',
  templateUrl: './firma.component.html',
  styleUrls: ['./firma.component.scss']
})
export class FirmaComponent implements OnInit{
  title = 'signatureJS';
  signaturePad?: SignaturePad;
  @ViewChild('canvas') canvasEl?: ElementRef;
  signatureImg?: string;
  empresaSelect?: Empresa | null;
  datosFirma?:any;
  firma?:any;

  constructor(
    private sesionService: SesionService,
    private route: ActivatedRoute,
    private firmaservice:firmaservice
  ) { }
  public async ngOnInit(){
    this.lenghtWidows()
    console.log(this.route.snapshot.params["id"])

    this.firmaservice.findById(this.route.snapshot.params["id"]).then((resp:any)=>{
      this.datosFirma=resp
      console.log(resp)})
  }

  lenghtWidows(){
    var windowWidth = (window.innerWidth*0.75).toString();
    var windowHeight = (window.innerHeight*0.65).toString();
    document.getElementById('tamcanvas')!.setAttribute("height", windowHeight);
    document.getElementById('tamcanvas')!.setAttribute("width", windowWidth);
  }
  ngAfterViewInit() {
    this.signaturePad = new SignaturePad(this.canvasEl!.nativeElement);
  }

  startDrawing(event: Event) {
    console.log(event);
    // works in device not in browser

  }

  moved(event: Event) {
    // works in device not in browser
  }

  clearPad() {
    this.signaturePad!.clear();
  }

  savePad() {
    this.firma = this.signaturePad!.toDataURL();
    let firm = new firma()
    firm.id =this.datosFirma.id
    firm.firma=this.firma
    firm.idempresa=this.datosFirma.idempresa;
    firm.fechacreacion=this.datosFirma.fechacreacion;
    firm.idrelacionado=this.datosFirma.idrelacionado;
    firm.email=this.datosFirma.email;
    firm.idusuario=this.datosFirma.idusuario;
    firm.terminoscondiciones=this.datosFirma.terminoscondiciones;
    console.log(firm)

    this.firmaservice.update(firm).then(resp=>console.log(resp)).catch(er=>
      console.log(er))
  }
}
