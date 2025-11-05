export class Person {
  private id: number;
  private nombre: string;
  private apellidos: string;
  private fechaNacimiento: string;

  constructor(id: number, nombre: string, apellidos: string, fechaNacimiento: string) {
    this.id = id;
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.fechaNacimiento = fechaNacimiento;
  }

  // Getters
  public getId(): number {
    return this.id;
  }
  public getNombre(): string {
    return this.nombre;
  }
  public getApellidos(): string {
    return this.apellidos;
  }
  public getFechaNacimiento(): string {
    return this.fechaNacimiento;
  }

  // Setters
  public setId(id: number): void {
    this.id = id;
  }
  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }
  public setApellidos(apellidos: string): void {
    this.apellidos = apellidos;
  }
  public setFechaNacimiento(fechaNacimiento: string): void {
    this.fechaNacimiento = fechaNacimiento;
  }
}
