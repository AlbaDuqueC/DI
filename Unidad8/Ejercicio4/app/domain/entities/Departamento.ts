export class Departamento {
  private _id: number;
  private _nombre: string;

  constructor(id: number, nombre: string) {
    this._id = id;
    this._nombre = nombre;
  }

  // Getters
  get id(): number { return this._id; }
  get nombre(): string { return this._nombre; }

  // Setters
  set id(value: number) { this._id = value; }
  set nombre(value: string) { this._nombre = value; }
}