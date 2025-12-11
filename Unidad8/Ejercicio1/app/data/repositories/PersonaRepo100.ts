import { Persona } from "@/app/domain/entities/Persona";
import { IPersonaRepo } from "@/app/domain/interfaces/IPersonaRepo";
import { injectable } from "inversify";

@injectable()
export class PersonasRepo100 implements  IPersonaRepo {


    /**
     * Get del listado completo de personas
     * @returns Listado de 100 personas
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
            new Persona(7, 'Sofía', 'Hernández Gómez', '111987321', 'Calle Luna 56', 'https://i.pinimg.com/1200x/70/0f/a4/700fa4e57dd8b56f59d6f4ee3cb278c4.jpg', new Date('1993-11-11'), 2),
            new Persona(8, 'Javier', 'Vargas Ramírez', '666123987', 'Avenida Estrella 89', 'https://i.pinimg.com/236x/b0/30/c2/b030c22c6c98e7cd637d47981125659f.jpg', new Date('1987-04-04'), 3),
            new Persona(9, 'Marta', 'Cruz Fernández', '777456123', 'Plaza Sol 23', 'https://i.pinimg.com/236x/a6/cd/62/a6cd62473d3789d6bc1b9b8ea07d8580.jpg', new Date('1994-08-08'), 4),
            new Persona(10, 'Andrés', 'López Sánchez', '888789456', 'Calle Mar 67', 'https://i.pinimg.com/736x/90/26/45/9026455e768e02ca685c81bae2e7f1ba.jpg', new Date('1990-02-02'), 5),
            new Persona(11, 'Elena', 'Gómez Ruiz', '999321654', 'Camino Estrella 12', 'https://i.pinimg.com/736x/6b/11/f1/6b11f119c171d6afe79440de046e3a7f.jpg', new Date('1996-06-06'), 1),
            new Persona(12, 'Pablo', 'Díaz Torres', '000654987', 'Avenida Luna 34', 'https://i.pinimg.com/1200x/70/0f/a4/700fa4e57dd8b56f59d6f4ee3cb278c4.jpg', new Date('1989-09-09'), 2),
            new Persona(13, 'Carmen', 'Ramírez Morales', '123987654', 'Calle Sol 78', 'https://i.pinimg.com/236x/b0/30/c2/b030c22c6c98e7cd637d47981125659f.jpg', new Date('1992-12-25'), 3),
            new Persona(14, 'Luis', 'Fernández García', '456123789', 'Plaza Mar 90', 'https://i.pinimg.com/236x/a6/cd/62/a6cd62473d3789d6bc1b9b8ea07d8580.jpg', new Date('1986-03-14'), 4),
            new Persona(15, 'Isabel', 'Sánchez López', '789456123', 'Camino Falsa 21', 'https://i.pinimg.com/736x/90/26/45/9026455e768e02ca685c81bae2e7f1ba.jpg', new Date('1993-05-05'), 5),
            new Persona(16, 'Roberto', 'Jiménez Castro', '321654987', 'Calle Verde 44', 'https://i.pinimg.com/736x/6b/11/f1/6b11f119c171d6afe79440de046e3a7f.jpg', new Date('1991-07-17'), 1),
            new Persona(17, 'Patricia', 'Navarro Ortiz', '654987321', 'Avenida Azul 55', 'https://i.pinimg.com/1200x/70/0f/a4/700fa4e57dd8b56f59d6f4ee3cb278c4.jpg', new Date('1994-10-20'), 2),
            new Persona(18, 'Sergio', 'Romero Vega', '987321654', 'Plaza Roja 66', 'https://i.pinimg.com/236x/b0/30/c2/b030c22c6c98e7cd637d47981125659f.jpg', new Date('1988-01-25'), 3),
            new Persona(19, 'Raquel', 'Gil Delgado', '147258369', 'Camino Blanco 77', 'https://i.pinimg.com/236x/a6/cd/62/a6cd62473d3789d6bc1b9b8ea07d8580.jpg', new Date('1995-04-18'), 4),
            new Persona(20, 'Alberto', 'Muñoz Serrano', '258369147', 'Calle Negro 88', 'https://i.pinimg.com/736x/90/26/45/9026455e768e02ca685c81bae2e7f1ba.jpg', new Date('1987-08-22'), 5),
            new Persona(21, 'Beatriz', 'Iglesias Molina', '369147258', 'Avenida Gris 99', 'https://i.pinimg.com/736x/6b/11/f1/6b11f119c171d6afe79440de046e3a7f.jpg', new Date('1992-11-30'), 1),
            new Persona(22, 'Tomás', 'Blanco Prieto', '741852963', 'Plaza Amarilla 11', 'https://i.pinimg.com/1200x/70/0f/a4/700fa4e57dd8b56f59d6f4ee3cb278c4.jpg', new Date('1990-06-14'), 2),
            new Persona(23, 'Cristina', 'Rubio Caballero', '852963741', 'Camino Naranja 22', 'https://i.pinimg.com/236x/b0/30/c2/b030c22c6c98e7cd637d47981125659f.jpg', new Date('1993-09-19'), 3),
            new Persona(24, 'Francisco', 'Pascual Méndez', '963741852', 'Calle Rosa 33', 'https://i.pinimg.com/236x/a6/cd/62/a6cd62473d3789d6bc1b9b8ea07d8580.jpg', new Date('1989-12-08'), 4),
            new Persona(25, 'Mónica', 'Guerrero Santos', '159357486', 'Avenida Violeta 44', 'https://i.pinimg.com/736x/90/26/45/9026455e768e02ca685c81bae2e7f1ba.jpg', new Date('1996-03-27'), 5),
            new Persona(26, 'Ángel', 'Carrasco Mora', '357486159', 'Plaza Celeste 55', 'https://i.pinimg.com/736x/6b/11/f1/6b11f119c171d6afe79440de046e3a7f.jpg', new Date('1991-05-11'), 1),
            new Persona(27, 'Silvia', 'Cortés Peña', '486159357', 'Camino Índigo 66', 'https://i.pinimg.com/1200x/70/0f/a4/700fa4e57dd8b56f59d6f4ee3cb278c4.jpg', new Date('1994-07-23'), 2),
            new Persona(28, 'Víctor', 'Lozano Fuentes', '159753486', 'Calle Turquesa 77', 'https://i.pinimg.com/236x/b0/30/c2/b030c22c6c98e7cd637d47981125659f.jpg', new Date('1988-10-16'), 3),
            new Persona(29, 'Lucía', 'Esteban Campos', '753486159', 'Avenida Coral 88', 'https://i.pinimg.com/236x/a6/cd/62/a6cd62473d3789d6bc1b9b8ea07d8580.jpg', new Date('1995-01-29'), 4),
            new Persona(30, 'Raúl', 'Vidal Herrera', '486951357', 'Plaza Esmeralda 99', 'https://i.pinimg.com/736x/90/26/45/9026455e768e02ca685c81bae2e7f1ba.jpg', new Date('1990-04-12'), 5),
            new Persona(31, 'Natalia', 'Aguilar Ramos', '159486753', 'Camino Ámbar 10', 'https://i.pinimg.com/736x/6b/11/f1/6b11f119c171d6afe79440de046e3a7f.jpg', new Date('1992-06-05'), 1),
            new Persona(32, 'Enrique', 'Bravo Núñez', '753159486', 'Calle Jade 21', 'https://i.pinimg.com/1200x/70/0f/a4/700fa4e57dd8b56f59d6f4ee3cb278c4.jpg', new Date('1987-09-28'), 2),
            new Persona(33, 'Alicia', 'Méndez Cabrera', '486753159', 'Avenida Rubí 32', 'https://i.pinimg.com/236x/b0/30/c2/b030c22c6c98e7cd637d47981125659f.jpg', new Date('1994-12-19'), 3),
            new Persona(34, 'Guillermo', 'Soto Flores', '357951486', 'Plaza Zafiro 43', 'https://i.pinimg.com/236x/a6/cd/62/a6cd62473d3789d6bc1b9b8ea07d8580.jpg', new Date('1991-02-08'), 4),
            new Persona(35, 'Teresa', 'Medina Garrido', '951486357', 'Camino Perla 54', 'https://i.pinimg.com/736x/90/26/45/9026455e768e02ca685c81bae2e7f1ba.jpg', new Date('1993-05-31'), 5),
            new Persona(36, 'Ignacio', 'Reyes Parra', '486357951', 'Calle Ópalo 65', 'https://i.pinimg.com/736x/6b/11/f1/6b11f119c171d6afe79440de046e3a7f.jpg', new Date('1989-08-24'), 1),
            new Persona(37, 'Pilar', 'Marín Cano', '258147369', 'Avenida Topacio 76', 'https://i.pinimg.com/1200x/70/0f/a4/700fa4e57dd8b56f59d6f4ee3cb278c4.jpg', new Date('1996-11-17'), 2),
            new Persona(38, 'Óscar', 'Gallego León', '147369258', 'Plaza Cuarzo 87', 'https://i.pinimg.com/236x/b0/30/c2/b030c22c6c98e7cd637d47981125659f.jpg', new Date('1990-01-10'), 3),
            new Persona(39, 'Rosa', 'Calvo Domínguez', '369258147', 'Camino Granate 98', 'https://i.pinimg.com/236x/a6/cd/62/a6cd62473d3789d6bc1b9b8ea07d8580.jpg', new Date('1992-04-03'), 4),
            new Persona(40, 'Adrián', 'Peña Hidalgo', '741963852', 'Calle Amatista 19', 'https://i.pinimg.com/736x/90/26/45/9026455e768e02ca685c81bae2e7f1ba.jpg', new Date('1988-07-26'), 5),
            new Persona(41, 'Inmaculada', 'Lorenzo Ortega', '963852741', 'Avenida Citrino 28', 'https://i.pinimg.com/736x/6b/11/f1/6b11f119c171d6afe79440de046e3a7f.jpg', new Date('1995-10-21'), 1),
            new Persona(42, 'Marcos', 'Carmona Suárez', '852741963', 'Plaza Lapislázuli 37', 'https://i.pinimg.com/1200x/70/0f/a4/700fa4e57dd8b56f59d6f4ee3cb278c4.jpg', new Date('1991-01-14'), 2),
            new Persona(43, 'Nuria', 'Sanz Vázquez', '159852741', 'Camino Malaquita 46', 'https://i.pinimg.com/236x/b0/30/c2/b030c22c6c98e7cd637d47981125659f.jpg', new Date('1993-04-07'), 3),
            new Persona(44, 'Daniel', 'Moya Giménez', '852741159', 'Calle Ónix 57', 'https://i.pinimg.com/236x/a6/cd/62/a6cd62473d3789d6bc1b9b8ea07d8580.jpg', new Date('1989-06-30'), 4),
            new Persona(45, 'Amparo', 'Castillo Ferrer', '741159852', 'Avenida Turmalina 68', 'https://i.pinimg.com/736x/90/26/45/9026455e768e02ca685c81bae2e7f1ba.jpg', new Date('1994-09-23'), 5),
            new Persona(46, 'Jorge', 'Mora Benítez', '357159852', 'Plaza Obsidiana 79', 'https://i.pinimg.com/736x/6b/11/f1/6b11f119c171d6afe79440de046e3a7f.jpg', new Date('1990-12-16'), 1),
            new Persona(47, 'Dolores', 'Pardo Rojas', '159357852', 'Camino Ágata 80', 'https://i.pinimg.com/1200x/70/0f/a4/700fa4e57dd8b56f59d6f4ee3cb278c4.jpg', new Date('1992-03-09'), 2),
            new Persona(48, 'Iván', 'Núñez Velasco', '852357159', 'Calle Cornalina 91', 'https://i.pinimg.com/236x/b0/30/c2/b030c22c6c98e7cd637d47981125659f.jpg', new Date('1988-05-02'), 3),
            new Persona(49, 'Gloria', 'Ibáñez Duran', '753852159', 'Avenida Heliotropo 12', 'https://i.pinimg.com/236x/a6/cd/62/a6cd62473d3789d6bc1b9b8ea07d8580.jpg', new Date('1995-08-25'), 4),
            new Persona(50, 'Rubén', 'Arias Mendoza', '159753852', 'Plaza Calcedonia 23', 'https://i.pinimg.com/736x/90/26/45/9026455e768e02ca685c81bae2e7f1ba.jpg', new Date('1991-11-18'), 5),
            new Persona(51, 'Celia', 'Gutiérrez Luna', '456789123', 'Camino Cristal 34', 'https://i.pinimg.com/736x/6b/11/f1/6b11f119c171d6afe79440de046e3a7f.jpg', new Date('1993-02-11'), 1),
            new Persona(52, 'Antonio', 'Márquez Silva', '789123456', 'Calle Diamante 45', 'https://i.pinimg.com/1200x/70/0f/a4/700fa4e57dd8b56f59d6f4ee3cb278c4.jpg', new Date('1987-05-04'), 2),
            new Persona(53, 'Rocío', 'Cabrera Rivas', '123456789', 'Avenida Berilo 56', 'https://i.pinimg.com/236x/b0/30/c2/b030c22c6c98e7cd637d47981125659f.jpg', new Date('1994-07-27'), 3),
            new Persona(54, 'Emilio', 'Santana Cordero', '456123789', 'Plaza Fluorita 67', 'https://i.pinimg.com/236x/a6/cd/62/a6cd62473d3789d6bc1b9b8ea07d8580.jpg', new Date('1990-10-20'), 4),
            new Persona(55, 'Inés', 'Campos Martín', '789456123', 'Camino Pirita 78', 'https://i.pinimg.com/736x/90/26/45/9026455e768e02ca685c81bae2e7f1ba.jpg', new Date('1992-01-13'), 5),
            new Persona(56, 'Manuel', 'Delgado Herrero', '321789456', 'Calle Aragonito 89', 'https://i.pinimg.com/736x/6b/11/f1/6b11f119c171d6afe79440de046e3a7f.jpg', new Date('1988-04-06'), 1),
            new Persona(57, 'Yolanda', 'Navarro Vicente', '654321789', 'Avenida Azurita 90', 'https://i.pinimg.com/1200x/70/0f/a4/700fa4e57dd8b56f59d6f4ee3cb278c4.jpg', new Date('1995-06-29'), 2),
            new Persona(58, 'José', 'Martín Crespo', '987654321', 'Plaza Celestita 01', 'https://i.pinimg.com/236x/b0/30/c2/b030c22c6c98e7cd637d47981125659f.jpg', new Date('1991-09-22'), 3),
            new Persona(59, 'María José', 'Romero Ortiz', '147852369', 'Camino Dolomita 13', 'https://i.pinimg.com/236x/a6/cd/62/a6cd62473d3789d6bc1b9b8ea07d8580.jpg', new Date('1993-12-15'), 4),
            new Persona(60, 'Jesús', 'García Pascual', '369147852', 'Calle Epidota 24', 'https://i.pinimg.com/736x/90/26/45/9026455e768e02ca685c81bae2e7f1ba.jpg', new Date('1989-03-08'), 5),
            new Persona(61, 'Concepción', 'López Molina', '258369147', 'Avenida Feldespato 35', 'https://i.pinimg.com/736x/6b/11/f1/6b11f119c171d6afe79440de046e3a7f.jpg', new Date('1996-05-01'), 1),
            new Persona(62, 'Rafael', 'Torres Blanco', '741258369', 'Plaza Galena 46', 'https://i.pinimg.com/1200x/70/0f/a4/700fa4e57dd8b56f59d6f4ee3cb278c4.jpg', new Date('1990-07-24'), 2),
            new Persona(63, 'Encarna', 'Díaz Prieto', '963741258', 'Camino Halita 57', 'https://i.pinimg.com/236x/b0/30/c2/b030c22c6c98e7cd637d47981125659f.jpg', new Date('1992-10-17'), 3),
            new Persona(64, 'José Luis', 'Sánchez Caballero', '852963741', 'Calle Hematita 68', 'https://i.pinimg.com/236x/a6/cd/62/a6cd62473d3789d6bc1b9b8ea07d8580.jpg', new Date('1988-01-10'), 4),
            new Persona(65, 'Montserrat', 'Ramírez Méndez', '159753486', 'Avenida Ilmenita 79', 'https://i.pinimg.com/736x/90/26/45/9026455e768e02ca685c81bae2e7f1ba.jpg', new Date('1994-03-03'), 5),
            new Persona(66, 'Juan Carlos', 'Fernández Santos', '486159753', 'Plaza Jadeíta 80', 'https://i.pinimg.com/736x/6b/11/f1/6b11f119c171d6afe79440de046e3a7f.jpg', new Date('1991-05-26'), 1),
            new Persona(67, 'Josefa', 'Moreno Mora', '753486159', 'Camino Magnetita 91', 'https://i.pinimg.com/1200x/70/0f/a4/700fa4e57dd8b56f59d6f4ee3cb278c4.jpg', new Date('1993-08-19'), 2),
            new Persona(68, 'Pedro', 'Hernández Fuentes', '357951486', 'Calle Limonita 02', 'https://i.pinimg.com/236x/b0/30/c2/b030c22c6c98e7cd637d47981125659f.jpg', new Date('1989-11-12'), 3),
            new Persona(69, 'Mercedes', 'Vargas Campos', '951486357', 'Avenida Muscovita 14', 'https://i.pinimg.com/236x/a6/cd/62/a6cd62473d3789d6bc1b9b8ea07d8580.jpg', new Date('1995-02-05'), 4),
            new Persona(70, 'Francisco Javier', 'Cruz Herrera', '486357951', 'Plaza Nefelina 25', 'https://i.pinimg.com/736x/90/26/45/9026455e768e02ca685c81bae2e7f1ba.jpg', new Date('1990-04-28'), 5),
            new Persona(71, 'Francisca', 'Gómez Ramos', '258147369', 'Camino Oligoclasa 36', 'https://i.pinimg.com/736x/6b/11/f1/6b11f119c171d6afe79440de046e3a7f.jpg', new Date('1992-07-21'), 1),
            new Persona(72, 'José Antonio', 'Ruiz Núñez', '147369258', 'Calle Plagioclasa 47', 'https://i.pinimg.com/1200x/70/0f/a4/700fa4e57dd8b56f59d6f4ee3cb278c4.jpg', new Date('1988-10-14'), 2),
            new Persona(73, 'Josefina', 'Torres Cabrera', '369258147', 'Avenida Ortoclasa 58', 'https://i.pinimg.com/236x/b0/30/c2/b030c22c6c98e7cd637d47981125659f.jpg', new Date('1994-01-07'), 3),
            new Persona(74, 'Miguel Ángel', 'Morales Flores', '741963852', 'Plaza Piroxeno 69', 'https://i.pinimg.com/236x/a6/cd/62/a6cd62473d3789d6bc1b9b8ea07d8580.jpg', new Date('1991-03-30'), 4),
            new Persona(75, 'Antonia', 'García Garrido', '963852741', 'Camino Biotita 70', 'https://i.pinimg.com/736x/90/26/45/9026455e768e02ca685c81bae2e7f1ba.jpg', new Date('1993-06-23'), 5),
            new Persona(76, 'Juan', 'López Parra', '852741963', 'Calle Talco 81', 'https://i.pinimg.com/736x/6b/11/f1/6b11f119c171d6afe79440de046e3a7f.jpg', new Date('1989-09-16'), 1),
            new Persona(77, 'Ana María', 'Santos Cano', '159852741', 'Avenida Yeso 92', 'https://i.pinimg.com/1200x/70/0f/a4/700fa4e57dd8b56f59d6f4ee3cb278c4.jpg', new Date('1995-12-09'), 2),
            new Persona(78, 'Javier', 'Ramírez Suárez', '852741159', 'Plaza Zinc 03', 'https://i.pinimg.com/236x/b0/30/c2/b030c22c6c98e7cd637d47981125659f.jpg', new Date('1990-02-02'), 3),
            new Persona(79, 'María Luisa', 'Vega Vázquez', '741159852', 'Camino Cuarcita 14', 'https://i.pinimg.com/236x/a6/cd/62/a6cd62473d3789d6bc1b9b8ea07d8580.jpg', new Date('1992-04-27'), 4),
            new Persona(80, 'Santiago', 'Castillo Giménez', '357159852', 'Calle Halita 25', 'https://i.pinimg.com/736x/90/26/45/9026455e768e02ca685c81bae2e7f1ba.jpg', new Date('1988-07-20'), 5),
            new Persona(81, 'Beatriz', 'Flores Ferrer', '159357852', 'Avenida Jade 36', 'https://i.pinimg.com/736x/6b/11/f1/6b11f119c171d6afe79440de046e3a7f.jpg', new Date('1994-10-13'), 1),
            new Persona(82, 'Alfonso', 'Serrano Benítez', '852357159', 'Plaza Lapislázuli 47', 'https://i.pinimg.com/1200x/70/0f/a4/700fa4e57dd8b56f59d6f4ee3cb278c4.jpg', new Date('1991-01-06'), 2),
            new Persona(83, 'Carmen', 'Molina Rojas', '753852159', 'Camino Malaquita 58', 'https://i.pinimg.com/236x/b0/30/c2/b030c22c6c98e7cd637d47981125659f.jpg', new Date('1993-03-31'), 3),
            new Persona(84, 'Diego', 'Ortega Velasco', '159753852', 'Calle Ónix 69', 'https://i.pinimg.com/236x/a6/cd/62/a6cd62473d3789d6bc1b9b8ea07d8580.jpg', new Date('1989-06-24'), 4),
            new Persona(85, 'Lucía', 'Duran Duran', '456123789', 'Avenida Perla 70', 'https://i.pinimg.com/736x/90/26/45/9026455e768e02ca685c81bae2e7f1ba.jpg', new Date('1996-09-17'), 5),
            // ... Puedes agregar más personas 
        ];
    }
}
