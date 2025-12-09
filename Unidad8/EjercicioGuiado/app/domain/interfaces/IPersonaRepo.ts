import { Persona } from "../entities/Persona";

export interface IRepositoryPersonas {
     getListadoCompletoPersonas(): Persona[];
}
