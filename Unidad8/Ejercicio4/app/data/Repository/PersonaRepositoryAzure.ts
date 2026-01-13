import { Persona } from "@/app/domain/entities/Persona";
import Connection from "../datasource/AzureAPI";
import { IPersonaRepository } from "@/app/domain/interfaces/Repository/IPersonaRepository";

export class PersonaRepositoryAzure implements IPersonaRepository {
  
  public async getListaPersonas(): Promise<Persona[]> {
    if (Connection.useMockData()) {
      console.log("Usando datos mock para desarrollo");
      return [
        new Persona(1, 'Juan', 'Pérez', 'Calle 1', new Date('1990-01-01'), 'foto.jpg', '123456789', 1),
        new Persona(2, 'María', 'García', 'Calle 2', new Date('1992-05-15'), 'foto2.jpg', '987654321', 2),
        new Persona(3, 'Pedro', 'López', 'Calle 3', new Date('1988-11-20'), 'foto3.jpg', '456789123', 3)
      ];
    }

    try {
      const url = `${Connection.getConnection()}/personas`;
      console.log('Conectando a:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log("Datos recibidos de Azure:", data.length, "registros");
      
      const lista: Persona[] = [];
      
      for (const reader of data) {
        // Azure devuelve la estructura anidada
        // Los datos de la persona están en reader.persona, no en reader directamente
        const personaData = reader.persona;
        
        if (!personaData) {
          console.warn("Registro sin datos de persona:", reader);
          continue;
        }

        const id = personaData.id ?? 0;
        const nombre = personaData.nombre ?? '';
        const apellidos = personaData.apellidos ?? '';
        const direccion = personaData.direccion ?? '';
        const fechaNac = personaData.fechaNacimiento ? new Date(personaData.fechaNacimiento) : new Date();
        const foto = personaData.foto ?? '';
        const telefono = personaData.telefono ?? '';
        const idDepartamento = personaData.idDepartamento ?? 0;
        
        console.log(`Procesando: ${id} - ${nombre} ${apellidos} (Depto: ${idDepartamento})`);
        
        // Constructor: (id, nombre, apellido, direccion, fechaNac, imagen, telefono, idDepartamento)
        lista.push(
          new Persona(
            id,
            nombre,
            apellidos,
            direccion,
            fechaNac,
            foto,
            telefono,
            idDepartamento
          )
        );
      }

      console.log(`Total personas procesadas: ${lista.length}`);
      return lista;
      
    } catch (error) {
      console.error("Error completo:", error);
      return [];
    }
  }

  getPersonaPorId(id: number): Promise<Persona | null> {
    throw new Error("Method not implemented.");
  }
  crearPersona(persona: Persona): Promise<number> {
    throw new Error("Method not implemented.");
  }
  actualizarPersona(id: number, persona: Persona): Promise<number> {
    throw new Error("Method not implemented.");
  }
  eliminarPersona(id: number): Promise<number> {
    throw new Error("Method not implemented.");
  }
}