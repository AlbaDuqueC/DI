// app/presentation/model/PersonaModel.ts

export class PersonaModel {
  public id: number;
  public nombre: string;
  public apellidos: string;
  public foto: string;
  public fechaNacimiento: string; // Formato legible
  public direccion: string;
  public telefono: string;
  public idDepartamento: number;
  public edad: number;
  public nombreCompleto: string;

  constructor(
    id: number,
    nombre: string,
    apellidos: string,
    foto: string,
    fechaNacimiento: Date,
    direccion: string,
    telefono: string,
    idDepartamento: number,
    edad: number
  ) {
    this.id = id;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.foto = foto;
    this.fechaNacimiento = this.formatearFecha(fechaNacimiento);
    this.direccion = direccion;
    this.telefono = telefono;
    this.idDepartamento = idDepartamento;
    this.edad = edad;
    this.nombreCompleto = `${nombre} ${apellidos}`;
  }

  private formatearFecha(fecha: Date): string {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const anio = fecha.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }
}