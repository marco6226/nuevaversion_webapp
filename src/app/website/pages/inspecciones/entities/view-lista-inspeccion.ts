import { Formulario } from "../../comun/entities/formulario";
import { Empresa } from "../../empresa/entities/empresa";
import { ElementoInspeccion } from "./elemento-inspeccion";
import { ListaInspeccionPK } from "./lista-inspeccion-pk";
import { OpcionCalificacion } from "./opcion-calificacion";

export interface ViewListaInspeccion {
  listaInspeccionPK: ListaInspeccionPK;
  id: number;
  nombre: string;
  codigo: string;
  fkPerfilId: string;
  tipoLista:string;
  estado:string;
  descripcion: string;
  elementoInspeccionList: ElementoInspeccion[];
  opcionCalificacionList: OpcionCalificacion[];
  formulario: Formulario;
  usarTipoHallazgo:boolean;
  usarNivelRiesgo:boolean;
  fkdocumento: number;
  version: number;
  numeroPreguntas: number;
  pkUsuarioId: number;
  empresa:Empresa;
}
