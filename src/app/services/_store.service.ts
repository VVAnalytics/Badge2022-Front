import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export default class _storeService {
  private static instance?: _storeService;

  // Variable Globale
  isUserLogin$: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  statutSidenav$: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  inputIsCreation: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  inputIsReadOnly: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  currentUrl$: BehaviorSubject<string> = new BehaviorSubject<string>(".");

  // Variable d'entete du Menu
  // contient role => qui vient du token
  rolesOfPersonneLogged$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  // contient unique_name  qui contient email de la personne du token
  emailOfPersonneLogged$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  // ECRAN : Médecins Sélection
  /*   dataSourceB$: BehaviorSubject<MatTableDataSource<IMedecins> | null> = new BehaviorSubject<MatTableDataSource<IMedecins> | null>(null);
    dataSourceO$: Observable<MatTableDataSource<IMedecins>> = new Observable<MatTableDataSource<IMedecins>>(); */

  displayedColumns$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  displayedFields$: Observable<string[]> = new Observable<string[]>();

  private constructor() {
    //super();
  }
  public static getInstance() {
    if (!this.instance) {
      this.instance = new _storeService();
    }
    return this.instance;
  }
}