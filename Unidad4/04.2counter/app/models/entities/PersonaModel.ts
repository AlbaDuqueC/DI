
export class Persona {
  private _id: number;
  private _nombre: string;
  private _apellido: string;

  constructor(id: number, nombre: string, apellido: string) {
    this._id = id;
    this._nombre = nombre;
    this._apellido = apellido;
  }

  // Getters
  get id(): number {
    return this._id;
  }

  get nombre(): string {
    return this._nombre;
  }

  get apellido(): string {
    return this._apellido;
  }

  // Setters
  set nombre(nuevoNombre: string) {
    this._nombre = nuevoNombre;
  }

  set apellido(nuevoApellido: string) {
    this._apellido = nuevoApellido;
  }
}
