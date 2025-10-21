export class Persona {

    //Atributos privados
    private _id: number;
    private _nombre: string;
    private _apellidos: string;

    //Constructor del objeto Persona
    constructor(id: number, nombre: string, apellidos: string) {

        this._id = id;
        this._nombre = nombre;
        this._apellidos = apellidos;

    }

    //Getters y Setters

    //Get del id
    get id(): number {
        return this._id;
    }

    //Get del nombre
    get nombre(): string {
        return this._nombre;
    }

    //Set del nombre
    set nombre(nuevoNombre: string) {
        this._nombre = nuevoNombre;
    }

    //Get del apellidos 
    get apellidos(): string {
        return this._apellidos;
    }

    //Set del apellidos 
    set apellidos(nuevoApellido: string) {
        this._apellidos = nuevoApellido;
    }



}

