import { Persona } from "@/app/domain/entities/Persona";
import { IPersonaRepo } from "@/app/domain/interfaces/IPersonaRepo";
import { injectable } from "inversify";

@injectable()
export class PersonasRepo implements  IPersonaRepo {


    /**
     * Get del listado completo de Personas
     * @returns Devuelve un listado de algunas Personas
     */
    getListadoCompletoPersonas(): Persona[] {


        //En un futuro, esto podría hacer llamadas a una API que nos ofreciera los datos
        return [
            new Persona(1, 'Fernando', 'Galiana Fernández', '123456789', 'Calle Falsa 123', 'https://i.pinimg.com/736x/6b/11/f1/6b11f119c171d6afe79440de046e3a7f.jpg', new Date('1990-01-01'), 1),
            new Persona(2, 'Carlos', 'Martínez López', '987654321', 'Avenida Siempre Viva 742', 'https://i.pinimg.com/1200x/70/0f/a4/700fa4e57dd8b56f59d6f4ee3cb278c4.jpg', new Date('1985-05-15'), 2),
            new Persona(3, 'Ana', 'Rodríguez Pérez', '555123456', 'Plaza Mayor 1', 'https://i.pinimg.com/236x/b0/30/c2/b030c22c6c98e7cd637d47981125659f.jpg', new Date('1992-09-30'), 3),
            new Persona(4, 'Miguel', 'Sánchez Ruiz', '444987654', 'Calle del Sol 45', 'https://i.pinimg.com/236x/a6/cd/62/a6cd62473d3789d6bc1b9b8ea07d8580.jpg', new Date('1988-12-12'), 4),
            new Persona(5, 'Laura', 'Torres Díaz', '333654789', 'Camino Real 78', 'https://i.pinimg.com/736x/90/26/45/9026455e768e02ca685c81bae2e7f1ba.jpg', new Date('1995-07-07'), 5),
            new Persona(6, 'David', 'Moreno García', '222321654', 'Avenida del Mar 90', 'https://i.pinimg.com/736x/6b/11/f1/6b11f119c171d6afe79440de046e3a7f.jpg', new Date('1991-03-03'), 1),
        ];
    }
}
