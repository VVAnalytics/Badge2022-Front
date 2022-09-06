import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Ordonnances } from '../Models/Ordonnances';
import { Observable } from 'rxjs';
import TkStorage from './storageHelper';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrdonnancesService {

  private _ordonnances!: Ordonnances[];
  tokens = TkStorage.getInstance();
  private _url: string = environment.apiURL + "/Formations/";

  constructor(private _http: HttpClient) { }

  getOrdonnances(): Observable<Ordonnances[]> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken() });
    return this._http.get<Ordonnances[]>(this._url + "GetAll", { headers: myheaders });
  }
  getOrdonnancesById(id: number): Observable<any> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken(), 'Content-Type': 'application/json', 'charset': 'utf-8', 'Accept': 'application/json' });
    return this._http.get<Ordonnances>(this._url + "GetOne/" + id, { headers: myheaders });
  }
  addOrdonnances(Ordonnances: Ordonnances): Observable<any> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken(), 'Content-Type': 'application/json', 'charset': 'utf-8', 'Accept': 'application/json' });
    const mybody = JSON.stringify(Ordonnances);
    return this._http.post<Ordonnances[]>(this._url + "Post", mybody, { headers: myheaders });
  }
  editOrdonnances(id: number, Ordonnances: Ordonnances): Observable<any> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken(), 'Content-Type': 'application/json', 'charset': 'utf-8', 'Accept': 'application/json' });
    const mybody = JSON.stringify(Ordonnances);
    return this._http.put<Ordonnances[]>(this._url + "Put/" + id, mybody, { headers: myheaders });
  }
  deleteOrdonnances(id: number): Observable<any> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken(), 'Content-Type': 'application/json', 'charset': 'utf-8', 'Accept': 'application/json' });
    return this._http.delete<Ordonnances[]>(this._url + "Delete/" + id, { headers: myheaders });
  }
}
