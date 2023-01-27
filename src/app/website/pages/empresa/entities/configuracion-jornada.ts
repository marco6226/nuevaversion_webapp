import { Empleado } from "./empleado";
import { Jornada } from "./jornada";

export class ConfiguracionJornada {
    id?: string;
    fechaEntradaVigencia!: Date | null;
    empleado!: Empleado;
    jornadaList!: Jornada[];
}
