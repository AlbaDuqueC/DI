export class Persona {
  // Propiedad privada que almacena el identificador único de la persona
  private _id: number;
  // Propiedad privada que almacena el nombre de la persona
  private _nombre: string;
  // Propiedad privada que almacena los apellidos de la persona
  private _apellidos: string;
  // Propiedad privada que almacena la URL o ruta de la foto
  private _foto: string;
  // Propiedad privada que almacena la fecha de nacimiento como objeto Date
  private _fechaNacimiento: Date;
  // Propiedad privada que almacena la dirección de residencia
  private _direccion: string;
  // Propiedad privada que almacena el número de teléfono
  private _telefono: string;
  // Propiedad privada que almacena el ID del departamento al que pertenece
  private _idDepartamento: number;

  // Constructor que inicializa todas las propiedades de la persona
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

  // Getter que retorna el ID de la persona
  get id(): number { return this._id; }
  // Getter que retorna el nombre de la persona
  get nombre(): string { return this._nombre; }
  // Getter que retorna los apellidos de la persona
  get apellidos(): string { return this._apellidos; }
  // Getter que retorna la URL/ruta de la foto
  get foto(): string { return this._foto; }
  // Getter que retorna la fecha de nacimiento
  get fechaNacimiento(): Date { return this._fechaNacimiento; }
  // Getter que retorna la dirección
  get direccion(): string { return this._direccion; }
  // Getter que retorna el teléfono
  get telefono(): string { return this._telefono; }
  // Getter que retorna el ID del departamento
  get idDepartamento(): number { return this._idDepartamento; }

  // Setter que permite modificar el ID
  set id(value: number) { this._id = value; }
  // Setter que permite modificar el nombre
  set nombre(value: string) { this._nombre = value; }
  // Setter que permite modificar los apellidos
  set apellidos(value: string) { this._apellidos = value; }
  // Setter que permite modificar la foto
  set foto(value: string) { this._foto = value; }
  // Setter que permite modificar la fecha de nacimiento
  set fechaNacimiento(value: Date) { this._fechaNacimiento = value; }
  // Setter que permite modificar la dirección
  set direccion(value: string) { this._direccion = value; }
  // Setter que permite modificar el teléfono
  set telefono(value: string) { this._telefono = value; }
  // Setter que permite modificar el ID del departamento
  set idDepartamento(value: number) { this._idDepartamento = value; }

  // Método que retorna el nombre completo concatenando nombre y apellidos
  getNombreCompleto(): string {
    return `${this._nombre} ${this._apellidos}`;
  }

  // Método que calcula y retorna la edad actual de la persona en años
  getEdad(): number {
    // Obtiene la fecha actual
    const hoy = new Date();
    // Calcula la diferencia de años entre la fecha actual y la fecha de nacimiento
    let edad = hoy.getFullYear() - this._fechaNacimiento.getFullYear();
    // Obtiene la diferencia de meses
    const mes = hoy.getMonth() - this._fechaNacimiento.getMonth();
    // Ajusta la edad si aún no ha cumplido años este año
    if (mes < 0 || (mes === 0 && hoy.getDate() < this._fechaNacimiento.getDate())) {
      edad--;
    }
    // Retorna la edad calculada
    return edad;
  }
}