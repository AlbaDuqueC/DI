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
    console.log(`🔄 ViewModel: Cargando persona con ID ${id}...`);
    // Activa el indicador de carga
    this._isLoading = true;
    // Limpia errores previos
    this._error = null;
    
    try {
      // Obtiene la persona del caso de uso
      const persona = await this._useCase.getPersonaById(id);
      console.log('✅ ViewModel: Persona cargada:', persona.getNombreCompleto());
      
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
        
        console.log('📝 ViewModel: Estado actualizado con ID:', this._id);
      });
    } catch (error) {
      console.error('❌ ViewModel: Error al cargar persona:', error);
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
    console.log('🧹 ViewModel: Limpiando formulario...');
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

    console.log('💾 ViewModel: Iniciando guardado de persona...');
    console.log('📋 ViewModel: Modo edición:', this._isEditMode);
    console.log('🆔 ViewModel: ID actual:', this._id);
    
    // Activa el indicador de carga
    this._isLoading = true;
    // Limpia errores previos
    this._error = null;
    
    try {
      // 🔧 FIX CRÍTICO: Crear la persona con el ID correcto
      // En modo edición, usar this._id que se cargó desde la base de datos
      // En modo creación, usar 0
      const idParaCrear = this._isEditMode ? this._id : 0;
      
      console.log('🏗️ ViewModel: Creando entidad Persona con ID:', idParaCrear);
      
      // Crea una instancia de la entidad Persona con todos los datos
      const persona = new Persona(
        idParaCrear, // ✅ Usar el ID correcto según el modo
        this._nombre,
        this._apellidos,
        this._foto,
        this._fechaNacimiento,
        this._direccion,
        this._telefono,
        this._idDepartamento
      );
      
      console.log('✅ ViewModel: Entidad creada:', {
        id: persona.id,
        nombre: persona.getNombreCompleto(),
        modo: this._isEditMode ? 'EDICIÓN' : 'CREACIÓN'
      });
      
      // Decide si crear o actualizar según el modo
      if (this._isEditMode) {
        console.log(`🔄 ViewModel: Actualizando persona con ID ${this._id}...`);
        // ✅ IMPORTANTE: Pasar el ID como primer parámetro
        await this._useCase.actualizarPersona(this._id, persona);
        console.log('✅ ViewModel: Persona actualizada exitosamente');
      } else {
        console.log('➕ ViewModel: Creando nueva persona...');
        // Crea una nueva persona
        const nuevoId = await this._useCase.crearPersona(persona);
        console.log(`✅ ViewModel: Persona creada con ID ${nuevoId}`);
      }
    } catch (error) {
      console.error('❌ ViewModel: Error al guardar persona:', error);
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