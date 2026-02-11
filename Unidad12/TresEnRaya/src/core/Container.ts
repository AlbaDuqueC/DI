import { ContextoSignalR } from '../data/datasource/ContextoSignalR';
import { RepositorioJuego } from '../data/repositories/RepositorioJuego';
import { CrearJuego } from '../domain/usecase/CrearJuego';
import { UnirseJuego } from '../domain/usecase/UnirseJuego';
import { RealizarMovimiento } from '../domain/usecase/RealizarMovimiento';
import { ComprobarResultado } from '../domain/usecase/ComprobarResultado';
import { EsperarOponente } from '../domain/usecase/EsperarOponente';
import { JuegoViewModel } from '../ui/viewmodel/JuegoViewModel';

export class Container {
  private static instance: Container;
  
  public contextoSignalR: ContextoSignalR;
  public repositorioJuego: RepositorioJuego;
  public crearJuego: CrearJuego;
  public unirseJuego: UnirseJuego;
  public realizarMovimiento: RealizarMovimiento;
  public comprobarResultado: ComprobarResultado;
  public esperarOponente: EsperarOponente;
  public juegoViewModel: JuegoViewModel;

  private constructor() {
    // DataSource
    this.contextoSignalR = new ContextoSignalR();
    
    // Repository
    this.repositorioJuego = new RepositorioJuego(this.contextoSignalR);
    
    // Use Cases
    this.crearJuego = new CrearJuego(this.repositorioJuego);
    this.unirseJuego = new UnirseJuego(this.repositorioJuego);
    this.realizarMovimiento = new RealizarMovimiento(this.repositorioJuego);
    this.comprobarResultado = new ComprobarResultado();
    this.esperarOponente = new EsperarOponente();
    
    // ViewModel
    this.juegoViewModel = new JuegoViewModel(
      this.crearJuego,
      this.unirseJuego,
      this.realizarMovimiento,
      this.repositorioJuego
    );
  }

  public static getInstance(): Container {
    if (!Container.instance) {
      Container.instance = new Container();
    }
    return Container.instance;
  }
}