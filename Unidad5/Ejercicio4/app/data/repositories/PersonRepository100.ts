import { IPersonRepository } from "../../domain/repositories/IPersonRepository";
import { Person } from "../../domain/entities/Person";

export class PersonRepository100 implements IPersonRepository {
  private persons: Person[];

  constructor() {
    this.persons = [
      new Person(1, "Laura", "Gómez Ruiz", "1992-03-15"),
      new Person(2, "Carlos", "Fernández López", "1988-07-09"),
      new Person(3, "María", "Santos Díaz", "1995-01-21"),
      new Person(4, "Javier", "Romero Pérez", "1990-11-02"),
      new Person(5, "Lucía", "Herrera Castro", "1993-06-10"),
      new Person(6, "Andrés", "Morales Vega", "1989-09-30"),
      new Person(7, "Paula", "Navarro Martín", "1996-12-25"),
      // Puedes seguir agregando hasta 100 personas si lo deseas.
      new Person(8, "David", "Suárez Torres", "1991-05-12"),
      new Person(9, "Clara", "Jiménez Soto", "1994-08-18"),
      new Person(10, "Miguel", "Cano Ortiz", "1997-02-05"),
      new Person(11, "Elena", "Vargas León", "1990-04-30"),
      new Person(12, "Sergio", "Lara Gómez", "1987-10-15"),
      new Person(13, "Raquel", "Marín Cruz", "1993-01-08"),
      new Person(14, "Diego", "Ortega Ruiz", "1998-06-20"),
      new Person(15, "Sara", "Prieto Gil", "1991-09-27"),
      new Person(16, "Adrián", "Delgado Ramos", "1985-12-12"),
      new Person(17, "Marta", "Campos Núñez", "1992-05-07"),
      new Person(18, "Rubén", "Castro Molina", "1989-03-23"),
      new Person(19, "Patricia", "Reyes Ibáñez", "1996-11-19"),
      new Person(20, "Alejandro", "López Vargas", "1990-07-04")
    ];
  }

  getAllPersons(): Person[] {
    return this.persons;
  }
}

