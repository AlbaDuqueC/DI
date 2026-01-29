export class DepartamentoModel {
  // Propiedad pública que almacena el identificador del departamento
  public id: number;
  // Propiedad pública que almacena el nombre del departamento
  public nombre: string;

  // Constructor que inicializa las propiedades del modelo
  constructor(id: number, nombre: string) {
    this.id = id;
    this.nombre = nombre;
  }
}