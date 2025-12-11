export class Persona {
    id: number
    nombre: string
    apellido: string
    telefono: string
    direccion: string
    foto: string
    fechaNacimiento: Date
    IdDepartamento: number

    /**
     * Contructor de la clase Persona
     * @param id Id de la persona
     * @param nombre Nombre de la persona
     * @param apellido Apellido de la persona
     * @param telefono Telefono de la persona
     * @param direccion Direccion de la persona
     * @param foto Enlace de la foto de la persona
     * @param fechaNacimiento Fedcha de nacimiento de la persona
     * @param IdDepartamento Id del departamento de la persona
     */
    constructor(
        id: number,
        nombre: string,
        apellido: string,
        telefono: string,
        direccion: string,
        foto: string,
        fechaNacimiento: Date,
        IdDepartamento: number
    ) {
        this.id = id
        this.nombre = nombre
        this.apellido = apellido
        this.telefono = telefono
        this.direccion = direccion
        this.foto = foto
        this.fechaNacimiento = fechaNacimiento
        this.IdDepartamento = IdDepartamento
    }

    /**
     * Get del id de la persona
     * @returns Devuleve el id de la persona
     */
    getId(): number {
        return this.id
    }

    /**
     * Get del nombre de la persona
     * @returns Devuleve el nombre de Persona
     */
    getNombre(): string {
        return this.nombre
    }

    /**
     * Get del apellido de la persona
     * @returns Devuelve el apellido de la persona
     */
    getApellido(): string {
        return this.apellido
    }

    /**
     * Get del numero de telefono de la persona
     * @returns Devuelve el numero de telefono en String
     */
    getTelefono(): string {
        return this.telefono
    }

    /**
     * Get de la direccion de la persona
     * @returns Devuelve la direccion de la persona
     */
    getDireccion(): string {
        return this.direccion
    }

    /**
     * Get de la foto de la persona
     * @returns Devuelve el enlace de la foto de la persona
     */
    getFoto(): string {
        return this.foto
    }

    /**
     * Get de la fecha de nacimiento de la persona
     * @returns Devuelve la fecha de nacimiento de la persona
     */
    getFechaNacimiento(): Date {
        return this.fechaNacimiento
    }

    /**
     * Get del id del departamento de la persona
     * @returns Devuelve el id del departamento de la persona 
     */
    getIdDepartamento(): number {
        return this.IdDepartamento
    }

    /**
     * Set del nombre de la persona
     * @param nombre Nombre nuevo de la persona 
     */
    setNombre(nombre: string): void {
        this.nombre = nombre
    }

    /**
     * Set del apellido de la persona
     * @param apellido Apellido nuevo de la persona
     */
    setApellido(apellido: string): void {
        this.apellido = apellido
    }

    /**
     * Set del telefono de la persona
     * @param telefono Nuevo telefono de la persona
     */
    setTelefono(telefono: string): void {
        this.telefono = telefono
    }

    /**
     * Set de la direccion de la persona
     * @param direccion Nueva direccion de la persona
     */
    setDireccion(direccion: string): void {
        this.direccion = direccion
    }

    /**
     * Set de la foto de la persona
     * @param foto Nuevo enlace de la foto de la persona
     */
    setFoto(foto: string): void {
        this.foto = foto
    }

    /**
     * Set de la fecha de nacimiento de la persona
     * @param fechaNacimiento Nueva fecha de nacimiento de la persona
     */
    setFechaNacimiento(fechaNacimiento: Date): void {
        this.fechaNacimiento = fechaNacimiento
    }

    /**
     * Set del id del departamento de la persona
     * @param IdDepartamento Nuevo id del departamento de la persona
     */
    setIdDepartamento(IdDepartamento: number): void {
        this.IdDepartamento = IdDepartamento
    }
}