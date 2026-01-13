import "reflect-metadata";
import { injectable } from "inversify";

/**
 * DataSource que conecta con la API REST de Azure.
 * Encapsula todas las peticiones HTTP al backend.
 */
@injectable()
export class AzureAPI {
    private readonly URL_BASE: string;

    constructor() {
        this.URL_BASE = "https://juanluis-g9hvdhc7azdvgphc.spaincentral-01.azurewebsites.net";
    }

    // ==================== PERSONAS ====================

    /**
     * Obtiene la lista completa de personas desde la API.
     * @returns Promise con array de objetos JSON de personas
     */
    async obtenerListaPersonas(): Promise<any> {
        const respuesta = await fetch(`${this.URL_BASE}/api/Persona`);
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP al consultar personas: ${respuesta.status}`);
        }
        
        return respuesta.json();
    }

    /**
     * Obtiene una persona específica por su ID.
     * @param id - ID de la persona a buscar
     * @returns Promise con objeto JSON de la persona
     */
    async obtenerPersonaPorId(id: number): Promise<any> {
        const respuesta = await fetch(`${this.URL_BASE}/api/Persona/${id}`);
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP al buscar persona ${id}: ${respuesta.status}`);
        }
        
        return respuesta.json();
    }

    /**
     * Crea una nueva persona en la API.
     * @param persona - Objeto con datos de la persona a crear
     * @returns Promise con objeto JSON de la persona creada
     */
    async crearPersona(persona: any): Promise<any> {
        const respuesta = await fetch(`${this.URL_BASE}/api/Persona`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(persona),
        });
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP al crear persona: ${respuesta.status}`);
        }
        
        return respuesta.json();
    }

    /**
     * Actualiza una persona existente en la API.
     * @param id - ID de la persona a actualizar
     * @param persona - Objeto con nuevos datos de la persona
     * @returns Promise con objeto JSON de la persona actualizada
     */
    async actualizarPersona(id: number, persona: any): Promise<any> {
        const respuesta = await fetch(`${this.URL_BASE}/api/Persona/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(persona),
        });
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP al actualizar persona ${id}: ${respuesta.status}`);
        }
        
        return respuesta.json();
    }

    /**
     * Elimina una persona de la API.
     * @param id - ID de la persona a eliminar
     * @returns Promise que se resuelve cuando se elimina
     */
    async eliminarPersona(id: number): Promise<any> {
        const respuesta = await fetch(`${this.URL_BASE}/api/Persona/${id}`, {
            method: 'DELETE',
        });
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP al eliminar persona ${id}: ${respuesta.status}`);
        }
        
        return respuesta.status === 204 ? true : respuesta.json();
    }

    // ==================== DEPARTAMENTOS ====================

    /**
     * Obtiene la lista completa de departamentos desde la API.
     * @returns Promise con array de objetos JSON de departamentos
     */
    async obtenerListaDepartamentos(): Promise<any> {
        const respuesta = await fetch(`${this.URL_BASE}/api/Departamento`);
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP al consultar departamentos: ${respuesta.status}`);
        }
        
        return respuesta.json();
    }

    /**
     * Obtiene un departamento específico por su ID.
     * @param id - ID del departamento a buscar
     * @returns Promise con objeto JSON del departamento
     */
    async obtenerDepartamentoPorId(id: number): Promise<any> {
        const respuesta = await fetch(`${this.URL_BASE}/api/Departamento/${id}`);
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP al buscar departamento ${id}: ${respuesta.status}`);
        }
        
        return respuesta.json();
    }

    /**
     * Crea un nuevo departamento en la API.
     * @param departamento - Objeto con datos del departamento a crear
     * @returns Promise con objeto JSON del departamento creado
     */
    async crearDepartamento(departamento: any): Promise<any> {
        const respuesta = await fetch(`${this.URL_BASE}/api/Departamento`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(departamento),
        });
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP al crear departamento: ${respuesta.status}`);
        }
        
        return respuesta.json();
    }

    /**
     * Actualiza un departamento existente en la API.
     * @param id - ID del departamento a actualizar
     * @param departamento - Objeto con nuevos datos del departamento
     * @returns Promise con objeto JSON del departamento actualizado
     */
    async actualizarDepartamento(id: number, departamento: any): Promise<any> {
        const respuesta = await fetch(`${this.URL_BASE}/api/Departamento/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(departamento),
        });
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP al actualizar departamento ${id}: ${respuesta.status}`);
        }
        
        return respuesta.json();
    }

    /**
     * Elimina un departamento de la API.
     * @param id - ID del departamento a eliminar
     * @returns Promise que se resuelve cuando se elimina
     */
    async eliminarDepartamento(id: number): Promise<any> {
        const respuesta = await fetch(`${this.URL_BASE}/api/Departamento/${id}`, {
            method: 'DELETE',
        });
        
        if (!respuesta.ok) {
            throw new Error(`Error HTTP al eliminar departamento ${id}: ${respuesta.status}`);
        }
        
        return respuesta.status === 204 ? true : respuesta.json();
    }
}