import { Persona } from "@/app/models/entities/Persona";
import { inject } from "inversify";
import { TYPES } from "../core/types";
import { IRepositoryPersonas } from "../models/data/personasRepository";




export class PeopleListVM {


    private _personasList: Persona[] = [];
    private _personaSeleccionada: Persona;
   


    constructor(
        @inject(TYPES.IRepositoryPersonas)
        private RepositoryPersonas: IRepositoryPersonas
    ) {


       
        this._personaSeleccionada = new Persona(0, '', '');


        this._personasList = this.RepositoryPersonas.getListadoCompletoPersonas();
     
    }


    public get personasList(): Persona[] {
        return this._personasList;
    }


    public get personaSeleccionada(): Persona {
        return this._personaSeleccionada;
    }


    public set personaSeleccionada(value: Persona) {
        this._personaSeleccionada = value;
       
    }


  }
