import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Medecins } from '../Models/Medecins';
import { Observable } from 'rxjs';
import TkStorage from '../services/storageHelper';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IMedecins } from '../Models/IMedecins';

@Injectable({
  providedIn: 'root'
})
export class MedecinsService {

  private _medecins!: Medecins[];
  tokens = TkStorage.getInstance();
  private _url: string = environment.apiURL + "/Personnes/";

  constructor(private _http: HttpClient) { }

  getMedecins(): Observable<IMedecins[]> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken() });
    return this._http.get<IMedecins[]>(this._url + "GetAll", { headers: myheaders });
  }
  getMedecinsById(id: number): Observable<any> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken(), 'Content-Type': 'application/json', 'charset': 'utf-8', 'Accept': 'application/json' });
    return this._http.get<IMedecins>(this._url + "GetOne?id=" + id, { headers: myheaders });
  }
  addMedecins(medecins: Medecins): Observable<any> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken(), 'Content-Type': 'application/json', 'charset': 'utf-8', 'Accept': 'application/json' });
    const mybody = JSON.stringify(medecins);
    return this._http.post<Medecins[]>(this._url + "Post", mybody, { headers: myheaders });
  }
  editMedecins(id: number, medecins: IMedecins): Observable<any> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken(), 'Content-Type': 'application/json', 'charset': 'utf-8', 'Accept': 'application/json' });
    const mybody = JSON.stringify(medecins);
    return this._http.put<IMedecins[]>(this._url + "Put/" + id, mybody, { headers: myheaders });
  }
  deleteMedecins(id: number): Observable<any> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken(), 'Content-Type': 'application/json', 'charset': 'utf-8', 'Accept': 'application/json' });
    return this._http.delete<Medecins[]>(this._url + "Delete/" + id, { headers: myheaders });
  }
}
