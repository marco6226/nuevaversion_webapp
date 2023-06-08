import { Component, ElementRef, ViewChild,OnInit } from '@angular/core';
import SignaturePad from 'signature_pad';
import { Empresa } from '../../../empresa/entities/empresa';
import { SesionService } from '../../../core/services/session.service';

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

  constructor(
    private sesionService: SesionService,
  ) { }
  public async ngOnInit(){
    this.lenghtWidows()
  }

  lenghtWidows(){
    var windowWidth = (window.innerWidth*0.75).toString();
    var windowHeight = (window.innerHeight*0.65).toString();
    document.getElementById('tamcanvas')!.setAttribute("height", windowHeight);
    document.getElementById('tamcanvas')!.setAttribute("width", windowWidth);

    console.log(windowWidth)
    console.log(windowHeight)
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
    const base64Data = this.signaturePad!.toDataURL();
    this.signatureImg = base64Data;
  }
}
