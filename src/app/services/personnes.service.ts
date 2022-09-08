import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Personnes } from '../Models/Personnes';
import { Tokens } from '../Models/Tokens';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import TkStorage from './storageHelper';
import { DecodedToken } from '../Models/DecodedToken';
import jwtDecode from 'jwt-decode';
import _storeService from './_store.service';
import * as forge from 'node-forge';

@Injectable({
  providedIn: 'root'
})
export class PersonnesService {

  private publicKey: string = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAskgPKBcNpz71mi4NSYa5
    mazJrO0WZim7T2yy7qPxk2NqQE7OmWWakLJcaeUYnI0kO3yC57vck66RPCjKxWuW
    SGZ7dHXe0bWb5IXjcT4mNdnUIalR+lV8czsoH/wDUvkQdG1SJ+IxzW64WvoaCRZ+
    /4wBF2cSUh9oLwGEXiodUJ9oJXFZVPKGCEjPcBI0vC2ADBRmVQ1sKsZg8zbHN+gu
    U9rPLFzN4YNrCnEsSezVw/W1FKVS8J/Xx4HSSg7AyVwniz8eHi0e3a8VzFg+H09I
    5wK+w39sjDYfAdnJUkr6PjtSbN4/Sg/NMkKB2Ngn8oj7LCfe/7RNqIdiS+dQuSFg
    eQIDAQAB
    -----END PUBLIC KEY-----`;

  private _personnes!: Personnes[];
  _storeService$ = _storeService.getInstance();
  tokens = TkStorage.getInstance();
  private _url: string = environment.apiURL + "/Personnes/";

  // Je créer un Obsevate private pour décoder le JSON qui contient le Token
  private roles$: BehaviorSubject<DecodedToken | null>;

  constructor(private _http: HttpClient) {
    this.roles$ = new BehaviorSubject<DecodedToken | null>(null);
    this._storeService$.emailOfPersonneLogged$ = new BehaviorSubject<string | null>(null);
    this._storeService$.rolesOfPersonneLogged$ = new BehaviorSubject<string | null>(null);
  }

  getPersonnes(): Observable<Personnes[]> {
    let myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken() });
    return this._http.get<Personnes[]>(this._url, { headers: myheaders });
  }
  getPersonnesAs(as: string): Observable<Personnes[]> {
    let myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken() });
    return this._http.get<Personnes[]>(this._url + as, { headers: myheaders });
  }
  getPersonnesId(id: number): Observable<Personnes> {
    let myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken() });
    return this._http.get<Personnes>(this._url + id, { headers: myheaders });
  }
  getPersonnesIdAs(id: number, as: string): Observable<Personnes> {
    let myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken() });
    return this._http.get<Personnes>(this._url + 'id=' + id + '&connectAs=' + as, { headers: myheaders });
  }
  addPersonnes(user: Personnes): Observable<Personnes> {
    let myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken() });
    return this._http.post<Personnes>(this._url, user, { headers: myheaders });
  }

  // Pour aller chercher le Token et mettre a jour le Store
  addPersonnesLogin(email: string, password: string): Observable<Tokens> {
    var rsa = forge.pki.publicKeyFromPem(this.publicKey);
    const conversionEncryptOutput =  window.btoa(rsa.encrypt(password));
    return this._http.post<Tokens>(this._url + 'Login?' + 'email=' + email + '&password=' + conversionEncryptOutput, undefined).pipe(tap(data => {
      this.roles$.next(jwtDecode(data.token));
      this._storeService$.emailOfPersonneLogged$.next(this.roles$.value?.unique_name ?? "");
      this._storeService$.rolesOfPersonneLogged$.next(this.roles$.value?.role ?? "");
    }));
  }
  addPersonnesRegister(email: string, password: string): Observable<Personnes> {
    return this._http.post<Personnes>(this._url + 'Register?' + 'email=' + email + '&password=' + password, undefined);
  }
  addPersonnesCreate(email: string, password: string): Observable<Personnes> {
    let myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken() });
    return this._http.post<Personnes>(this._url + 'Create?' + 'email=' + email + '&password=' + password, undefined, { headers: myheaders });
  }
  edit(id: number, personne: Personnes): Observable<Personnes> {
    let myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken() });
    return this._http.put<Personnes>(this._url + personne.Id, personne, { headers: myheaders });
  }
  delete(id: number): Observable<Personnes> {
    let myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken() });
    return this._http.delete<Personnes>(this._url + id, { headers: myheaders });
  }
}

