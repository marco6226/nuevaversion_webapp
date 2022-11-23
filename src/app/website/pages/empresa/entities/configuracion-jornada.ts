import { Empleado } from "./empleado";
import { Jornada } from "./jornada";

export interface ConfiguracionJornada {
    id: string;
    fechaEntradaVigencia: Date;
    empleado: Empleado;
    jornadaList: Jornada[];
}
