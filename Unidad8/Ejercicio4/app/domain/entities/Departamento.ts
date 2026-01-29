export class Departamento {
  // Propiedad privada que almacena el identificador del departamento
  private _id: number;
  // Propiedad privada que almacena el nombre del departamento
  private _nombre: string;

  // Constructor que inicializa las propiedades del departamento
  constructor(id: number, nombre: string) {
    this._id = id;
    this._nombre = nombre;
  }

  // Getter que permite acceder al ID del departamento de forma controlada
  get id(): number { return this._id; }
  // Getter que permite acceder al nombre del departamento de forma controlada
  get nombre(): string { return this._nombre; }

  // Setter que permite modificar el ID del departamento de forma controlada
  set id(value: number) { this._id = value; }
  // Setter que permite modificar el nombre del departamento de forma controlada
  set nombre(value: string) { this._nombre = value; }
}