export class PersonaModel {
  // Propiedad pública que almacena el ID de la persona
  public id: number;
  // Propiedad pública que almacena el nombre
  public nombre: string;
  // Propiedad pública que almacena los apellidos
  public apellidos: string;
  // Propiedad pública que almacena la URL/ruta de la foto
  public foto: string;
  // Propiedad pública que almacena la fecha de nacimiento formateada como string
  public fechaNacimiento: string;
  // Propiedad pública que almacena la dirección
  public direccion: string;
  // Propiedad pública que almacena el teléfono
  public telefono: string;
  // Propiedad pública que almacena el ID del departamento
  public idDepartamento: number;
  // Propiedad pública que almacena la edad calculada
  public edad: number;
  // Propiedad pública que almacena el nombre completo
  public nombreCompleto: string;

  // Constructor que inicializa todas las propiedades del modelo
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
    // Formatea la fecha de nacimiento a un string legible
    this.fechaNacimiento = this.formatearFecha(fechaNacimiento);
    this.direccion = direccion;
    this.telefono = telefono;
    this.idDepartamento = idDepartamento;
    this.edad = edad;
    // Concatena nombre y apellidos para crear el nombre completo
    this.nombreCompleto = `${nombre} ${apellidos}`;
  }

  // Método privado que formatea un objeto Date a string en formato DD/MM/YYYY
  private formatearFecha(fecha: Date): string {
    // Obtiene el día y lo formatea a 2 dígitos
    const dia = fecha.getDate().toString().padStart(2, '0');
    // Obtiene el mes (sumando 1 porque los meses van de 0-11) y lo formatea a 2 dígitos
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    // Obtiene el año completo
    const anio = fecha.getFullYear();
    // Retorna la fecha formateada como string
    return `${dia}/${mes}/${anio}`;
  }
}