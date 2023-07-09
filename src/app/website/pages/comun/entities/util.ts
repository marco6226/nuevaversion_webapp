export class Util {
    public static colors = [
      "#DC143C",
      "#CD5C5C",
      "#FF69B4",
      "#FFC0CB",
      "#FF7F50",
      "#FF4500",
      "#FFD700",
      "#FFE4B5",
      "#EE82EE",
      "#9370DB",
      "#7B68EE",
      "#3CB371",
      "#20B2AA",
      "#40E0D0",
      "#4682B4",
      "#87CEEB",
      "#00BFFF",
      "#4169E1",
  
    ];
  
    public static tipo_archivo = {
      dir: { extension: "dir", nombre: 'Directorio', icono: 'bi bi-folder', color: 'rgb(219, 176, 32)' },
      pdf: { extension: "pdf", nombre: 'Portable Document Format (PDF)', icono: 'bi bi-filetype-pdf', color: 'rgb(200, 0, 0)' },
      png: { extension: "png", nombre: 'Imágen png', icono: 'bi bi-file-image', color: 'purple' },
      jpg: { extension: "jpg", nombre: 'Imágen jpg', icono: 'bi bi-file-image', color: 'purple' },
      jpeg: { extension: "jpg", nombre: 'Imágen jpg', icono: 'bi bi-file-image', color: 'purple' },
      txt: { extension: "txt", nombre: 'Archivo de texto', icono: 'bi bi-filetype-txt', color: '#555' },
      csv: { extension: "csv", nombre: 'Archivo csv', icono: 'bi bi-filetype-txt', color: '#555' },
      xlsx: { extension: "xlsx", nombre: 'Hoja de cálculo de excel', icono: 'bi bi-filetype-xlsx', color: '#26a300' },
      pptx: { extension: "pptx", nombre: 'Presentación de power point', icono: 'bi bi-filetype-pptx', color: 'darkred' },
      docx: { extension: "docx", nombre: 'Documento de word', icono: 'bi bi-filetype-docx', color: '#4285f4' },
      xls: { extension: "xls", nombre: 'Hoja de cálculo de excel', icono: 'bi bi-filetype-xls', color: '#26a300' },
      xlsm: { extension: "xlsm", nombre: 'Hoja de cálculo de excel', icono: 'bi bi-filetype-xlsx', color: '#26a300' },
      ppt: { extension: "ppt", nombre: 'Presentación de power point', icono: 'bi bi-filetype-ppt', color: 'darkred' },
      doc: { extension: "doc", nombre: 'Documento de word', icono: 'bi bi-filetype-doc', color: '#4285f4' },
      mp3: { extension: "mp3", nombre: 'Archivo de audio mp3', icono: 'bi bi-filetype-mp3', color: '#555' },
      mp4: { extension: "mp4", nombre: 'Archivo de video mp4', icono: 'bi bi-filetype-mp4', color: '#555' },
      zip: { extension: "zip", nombre: 'Archivo comprimido zip', icono: 'bi bi-file-zip', color: '#555' },
      rar: { extension: "rar", nombre: 'Archivo comprimido rar', icono: 'bi bi-stack', color: '#555' },
      default: { extension: "", nombre: 'Archivo', icono: 'pi pi-file', color: '#555' },
    };
  
    public static randomColor() {
      return Util.colors[Math.floor(Math.random() * Util.colors.length)];
    }
  
    static cambiarNombreFile(file: File, fileName: string): File {
      return new File([file], fileName, { type: file.type });
    }
  
    public static map_chart_style = [
      {
        "elementType": "labels",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "landscape.natural",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry.fill",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "road",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      }
    ];
  
  
  }
  