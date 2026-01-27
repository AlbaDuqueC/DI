// app/domain/entities/Persona.ts

export class Persona {
  private _id: number;
  private _nombre: string;
  private _apellidos: string;
  private _foto: string;
  private _fechaNacimiento: Date;
  private _direccion: string;
  private _telefono: string;
  private _idDepartamento: number;

  constructor(
    id: number,
    nombre: string,
    apellidos: string,
    foto: string,
    fechaNacimiento: Date,
    direccion: string,
    telefono: string,
    idDepartamento: number
  ) {
    this._id = id;
    this._nombre = nombre;
    this._apellidos = apellidos;
    this._foto = foto;
    this._fechaNacimiento = fechaNacimiento;
    this._direccion = direccion;
    this._telefono = telefono;
    this._idDepartamento = idDepartamento;
  }

  // Getters
  get id(): number { return this._id; }
  get nombre(): string { return this._nombre; }
  get apellidos(): string { return this._apellidos; }
  get foto(): string { return this._foto; }
  get fechaNacimiento(): Date { return this._fechaNacimiento; }
  get direccion(): string { return this._direccion; }
  get telefono(): string { return this._telefono; }
  get idDepartamento(): number { return this._idDepartamento; }

  // Setters
  set id(value: number) { this._id = value; }
  set nombre(value: string) { this._nombre = value; }
  set apellidos(value: string) { this._apellidos = value; }
  set foto(value: string) { this._foto = value; }
  set fechaNacimiento(value: Date) { this._fechaNacimiento = value; }
  set direccion(value: string) { this._direccion = value; }
  set telefono(value: string) { this._telefono = value; }
  set idDepartamento(value: number) { this._idDepartamento = value; }

  getNombreCompleto(): string {
    return `${this._nombre} ${this._apellidos}`;
  }

  // ✅ CAMBIO: Retornar number en lugar de string
  getEdad(): number {
    const hoy = new Date();
    let edad = hoy.getFullYear() - this._fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - this._fechaNacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < this._fechaNacimiento.getDate())) {
      edad--;
    }
    return edad;
  }
}