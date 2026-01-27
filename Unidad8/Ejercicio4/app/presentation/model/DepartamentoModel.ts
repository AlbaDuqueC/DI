// app/presentation/model/DepartamentoModel.ts

export class DepartamentoModel {
  public id: number;
  public nombre: string;

  constructor(id: number, nombre: string) {
    this.id = id;
    this.nombre = nombre;
  }
}