// app/presentation/viewModel/EditarInsertarPersona.ts

import { injectable, inject } from 'inversify';
import { makeObservable, observable, action, computed, runInAction } from 'mobx';
import 'reflect-metadata';
import { IPersonaUseCase } from '../../domain/interfaces/UseCase/IPersonaUseCase';
import { Persona } from '../../domain/entities/Persona';
import { TYPES } from '../../core/types';

// Decorador que marca la clase como inyectable
@injectable()
export class EditarInsertarPersonaVM {
  // Propiedad privada que almacena el caso de uso de personas
  private readonly _useCase: IPersonaUseCase;
  
  // Propiedades observables que almacenan los datos del formulario
  @observable
  private _id: number = 0;
  
  @observable
  private _nombre: string = '';
  
  @observable
  private _apellidos: string = '';
  
  @observable
  private _foto: string = '';
  
  @observable
  private _fechaNacimiento: Date = new Date();
  
  @observable
  private _direccion: string = '';
  
  @observable
  private _telefono: string = '';
  
  @observable
  private _idDepartamento: number = 0;
  
  // Propiedad observable que indica si está en modo edición
  @observable
  private _isEditMode: boolean = false;
  
  // Propiedad observable que indica si hay una operación en curso
  @observable
  private _isLoading: boolean = false;
  
  // Propiedad observable que almacena mensajes de error
  @observable
  private _error: string | null = null;

  // Constructor que recibe el caso de uso mediante inyección de dependencias
  constructor(
    @inject(TYPES.IPersonaUseCase) useCase: IPersonaUseCase
  ) {
    this._useCase = useCase;
    // Hace que las propiedades sean reactivas
    makeObservable(this);
  }

  // Getters para acceder a las propiedades privadas
  get id(): number { return this._id; }
  get nombre(): string { return this._nombre; }
  get apellidos(): string { return this._apellidos; }
  get foto(): string { return this._foto; }
  get fechaNacimiento(): Date { return this._fechaNacimiento; }
  get direccion(): string { return this._direccion; }
  get telefono(): string { return this._telefono; }
  get idDepartamento(): number { return this._idDepartamento; }
  get isEditMode(): boolean { return this._isEditMode; }
  get isLoading(): boolean { return this._isLoading; }
  get error(): string | null { return this._error; }

  // Actions que actualizan las propiedades del formulario
  @action
  public setNombre(nombre: string): void {
    this._nombre = nombre;
    // Limpia el error cuando el usuario modifica el campo
    this._error = null;
  }

  @action
  public setApellidos(apellidos: string): void {
    this._apellidos = apellidos;
    this._error = null;
  }

  @action
  public setFoto(foto: string): void {
    this._foto = foto;
  }

  @action
  public setFechaNacimiento(fecha: Date): void {
    this._fechaNacimiento = fecha;
  }

  @action
  public setDireccion(direccion: string): void {
    this._direccion = direccion;
  }

  @action
  public setTelefono(telefono: string): void {
    this._telefono = telefono;
  }

  @action
  public setIdDepartamento(id: number): void {
    this._idDepartamento = id;
  }

  // Action asíncrono que carga los datos de una persona existente para edición
  @action
  public async cargarPersona(id: number): Promise<void> {
    // Activa el indicador de carga
    this._isLoading = true;
    // Limpia errores previos
    this._error = null;
    
    try {
      // Obtiene la persona del caso de uso
      const persona = await this._useCase.getPersonaById(id);
      // Actualiza el estado con los datos de la persona
      runInAction(() => {
        this._id = persona.id;
        this._nombre = persona.nombre;
        this._apellidos = persona.apellidos;
        this._foto = persona.foto;
        this._fechaNacimiento = persona.fechaNacimiento;
        this._direccion = persona.direccion;
        this._telefono = persona.telefono;
        this._idDepartamento = persona.idDepartamento;
        this._isEditMode = true;
      });
    } catch (error) {
      // Actualiza el estado de error
      runInAction(() => {
        this._error = 'Error al cargar la persona';
      });
    } finally {
      // Desactiva el indicador de carga
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }

  // Action que limpia el formulario para crear una nueva persona
  @action
  public limpiarFormulario(): void {
    this._id = 0;
    this._nombre = '';
    this._apellidos = '';
    this._foto = '';
    this._fechaNacimiento = new Date();
    this._direccion = '';
    this._telefono = '';
    this._idDepartamento = 0;
    this._isEditMode = false;
    this._error = null;
  }

  // Action asíncrono que guarda la persona (crea o actualiza según el modo)
  @action
  public async guardarPersona(): Promise<void> {
    // Valida que los campos obligatorios no estén vacíos
    if (!this._nombre.trim()) {
      this._error = 'El nombre es obligatorio';
      return;
    }

    if (!this._apellidos.trim()) {
      this._error = 'Los apellidos son obligatorios';
      return;
    }

    // Activa el indicador de carga
    this._isLoading = true;
    // Limpia errores previos
    this._error = null;
    
    try {
      // Crea una instancia de la entidad Persona con todos los datos
      const persona = new Persona(
        this._id,
        this._nombre,
        this._apellidos,
        this._foto,
        this._fechaNacimiento,
        this._direccion,
        this._telefono,
        this._idDepartamento
      );
      
      // Decide si crear o actualizar según el modo
      if (this._isEditMode) {
        // Actualiza la persona existente
        await this._useCase.actualizarPersona(this._id, persona);
      } else {
        // Crea una nueva persona
        await this._useCase.crearPersona(persona);
      }
    } catch (error) {
      // Actualiza el estado de error
      runInAction(() => {
        this._error = error instanceof Error ? error.message : 'Error al guardar';
      });
      // Propaga el error para que la UI pueda manejarlo
      throw error;
    } finally {
      // Desactiva el indicador de carga
      runInAction(() => {
        this._isLoading = false;
      });
    }
  }
}