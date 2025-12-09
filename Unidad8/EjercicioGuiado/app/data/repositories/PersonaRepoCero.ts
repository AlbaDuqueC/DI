import { Persona } from "@/app/domain/entities/Persona";
import { IPersonaRepo } from "@/app/domain/interfaces/IPersonaRepo";
import { injectable } from "inversify";

@injectable()
export class PersonasRepo implements  IPersonaRepo {


    /**
     * Get del listado  de Personas
     * @returns Devuelve un listado vacío de Personas
     */

    getListadoCompletoPersonas(): Persona[] {


        //En un futuro, esto podría hacer llamadas a una API que nos ofreciera los datos
        return [
            
        ];
    }
}