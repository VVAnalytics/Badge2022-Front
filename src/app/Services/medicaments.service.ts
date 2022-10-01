import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Medicaments } from '../Models/Medicaments';
import { Observable } from 'rxjs';
import TkStorage from '../services/storageHelper';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MedicamentsService {

  private _medicaments!: Medicaments[];
  tokens = TkStorage.getInstance();
  private _url: string = environment.apiURL + "/Roles/";

  constructor(private _http: HttpClient) { }

  getMedicaments(): Observable<Medicaments[]> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken() });
    return this._http.get<Medicaments[]>(this._url + "GetAll", { headers: myheaders });
  }
  getMedicamentsById(id: number): Observable<any> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken(), 'Content-Type': 'application/json', 'charset': 'utf-8', 'Accept': 'application/json' });
    return this._http.get<Medicaments>(this._url + "GetOne/" + id, { headers: myheaders });
  }
  addMedicaments(Medicaments: Medicaments): Observable<any> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken(), 'Content-Type': 'application/json', 'charset': 'utf-8', 'Accept': 'application/json' });
    const mybody = JSON.stringify(Medicaments);
    return this._http.post<Medicaments[]>(this._url + "Post", mybody, { headers: myheaders });
  }
  editMedicaments(id: number, Medicaments: Medicaments): Observable<any> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken(), 'Content-Type': 'application/json', 'charset': 'utf-8', 'Accept': 'application/json' });
    const mybody = JSON.stringify(Medicaments);
    return this._http.put<Medicaments[]>(this._url + "Put/" + id, mybody, { headers: myheaders });
  }
  deleteMedicaments(id: number): Observable<any> {
    const myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + this.tokens.getAccessToken(), 'Content-Type': 'application/json', 'charset': 'utf-8', 'Accept': 'application/json' });
    return this._http.delete<Medicaments[]>(this._url + "Delete/" + id, { headers: myheaders });
  }
}
