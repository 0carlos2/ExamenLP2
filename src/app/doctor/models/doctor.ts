import { especialidad } from "../../especialidad/models/especialidad";

export class doctor {
    id: number;
    nombre: string;
    apellidos: string;
    especialidad: especialidad;

    constructor(id: number=0, nombre: string='', apellidos: string='', especialidad: especialidad) {
        this.id = id;
        this.nombre = nombre;
        this.apellidos = apellidos;
        this.especialidad = especialidad;
    }
}