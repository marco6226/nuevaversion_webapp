import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-manuales',
  templateUrl: './manuales.component.html',
  styleUrls: ['./manuales.component.scss']
})
export class ManualesComponent implements OnInit {
  downloadButtons!: NodeListOf<HTMLButtonElement>;  // Lista de botones de descarga
  downloadStatus!: HTMLElement;
  
  constructor(
    private messageService: MessageService,

  ) { 

  }

  ngOnInit(): void {
    this.initializeElements();
  }

  initializeElements(): void {
    // Obtener todos los botones de descarga
    this.downloadButtons = document.querySelectorAll('.downloadButton') as NodeListOf<HTMLButtonElement>;
    this.downloadStatus = document.getElementById('downloadStatus') as HTMLParagraphElement;

    // Agregar el evento de click a todos los botones de descarga
    this.downloadButtons.forEach((button) => {
      button.addEventListener('click', (event) => this.handleDownload(event));
    });
  }
  handleDownload(event: Event): void {
    const button = event.target as HTMLButtonElement;
    const fileUrl = button.getAttribute('data-url');  // Obtener la URL desde el atributo data-url

    if (fileUrl) {
      // Mostrar mensaje cuando comienza la descarga
      this.messageService.add({
        key: 'man',
        severity: "info",
        summary: "Mensaje del sistema",
        detail: "Se esta descargando su manual..."
    });
      // Crear un enlace invisible para descargar el archivo
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = '';

      // Simular el clic en el enlace
      link.click();

      // Simulamos el fin de la descarga tras unos segundos
      setTimeout(() => {
        this.messageService.add({
          key: 'man',
          severity: "success",
          summary: "Mensaje del sistema",
          detail: "Se ha descargado el manual correctamente"
      });      }, 3000); // Tiempo estimado para descargar el archivo
    } else {
      console.error('No se encontró la URL para descargar.');
    }
  }

}
