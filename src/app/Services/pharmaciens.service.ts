import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Pharmaciens } from '../Models/Pharmaciens';
import { Observable } from 'rxjs';
import TkStorage from './storageHelper';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PharmaciensService {

  private _pharmaciens!: Pharmaciens[];
  tokens = TkStorage.getInstance();
  private _url: string = environment.apiURL + "/Cours/";

  constructor(private _http: HttpClient) { }

  getPharmaciens(): Observable<Pharmaciens[]> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken() });
    return this._http.get<Pharmaciens[]>(this._url + "GetAll", { headers: myheaders });
  }
  getPharmaciensById(id: number): Observable<any> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken(), 'Content-Type': 'application/json', 'charset': 'utf-8', 'Accept': 'application/json' });
    return this._http.get<Pharmaciens>(this._url + "GetOne/" + id, { headers: myheaders });
  }
  addPharmaciens(Pharmaciens: Pharmaciens): Observable<any> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken(), 'Content-Type': 'application/json', 'charset': 'utf-8', 'Accept': 'application/json' });
    const mybody = JSON.stringify(Pharmaciens);
    return this._http.post<Pharmaciens[]>(this._url + "Post", mybody, { headers: myheaders });
  }
  editPharmaciens(id: number, Pharmaciens: Pharmaciens): Observable<any> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken(), 'Content-Type': 'application/json', 'charset': 'utf-8', 'Accept': 'application/json' });
    const mybody = JSON.stringify(Pharmaciens);
    return this._http.put<Pharmaciens[]>(this._url + "Put/" + id, mybody, { headers: myheaders });
  }
  deletePharmaciens(id: number): Observable<any> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken(), 'Content-Type': 'application/json', 'charset': 'utf-8', 'Accept': 'application/json' });
    return this._http.delete<Pharmaciens[]>(this._url + "Delete/" + id, { headers: myheaders });
  }
}
