import { Injectable, Pipe } from '@angular/core';
import { environment } from '../../environments/environment';
import { Piluliers } from '../Models/Piluliers';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import TkStorage from '../services/storageHelper';
import { PersonnesService } from '../services/personnes.service';

@Pipe({
  name: 'KeyValuePipe'
})
@Injectable({
  providedIn: 'root'
})
export class PiluliersService {

  private _piluliers!: Piluliers[];
  private _url: string = environment.apiURL + "/NotesEleves/";
  tokens = TkStorage.getInstance();
  isUserLogin: boolean = false;
  timeOut: number = 500 * 5;

  constructor(private _http: HttpClient, private _personnesService: PersonnesService) { }

  getPiluliers(): Observable<Piluliers[]> {
    if (this.tokens.getAccessToken() !== null) { this.isUserLogin = true; }
    let myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + TkStorage.getInstance() });
    return this._http.get<Piluliers[]>(this._url + "GetAll");
  }

  getPiluliersById(id: number): Observable<Piluliers> {
    let myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + TkStorage.getInstance() });
    return this._http.get<Piluliers>(this._url + id)
  }

  addPiluliers(Piluliers: Piluliers): Observable<Piluliers> {
    let myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + TkStorage.getInstance() });
    return this._http.post<Piluliers>(this._url, Piluliers);
  }

  editPiluliers(id: number, Piluliers: Piluliers): Observable<Piluliers> {
    let myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + TkStorage.getInstance() });
    return this._http.put<Piluliers>(this._url + Piluliers.npid, Piluliers);
  }

  deletePiluliers(id: number): Observable<Piluliers> {
    let myheaders = new HttpHeaders({ 'Authorization': 'Bearer ' + TkStorage.getInstance() });
    return this._http.delete<Piluliers>(this._url + id)
  }
}
