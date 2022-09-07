import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Pharmaciens } from '../Models/Pharmaciens';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PharmaciensService {

  private _pharmacies!: Pharmaciens[];

  private _url: string = environment.apiURL + "/Cours/";

  constructor(private _http: HttpClient) { }

  getPharmaciens(): Observable<Pharmaciens[]> {
    return this._http.get<Pharmaciens[]>(this._url);
  }

  getPharmaciensById(id: number): Observable<Pharmaciens> {
    return this._http.get<Pharmaciens>(this._url + id)
  }

  addPharmaciens(pharmacies: Pharmaciens): Observable<Pharmaciens> {
    return this._http.post<Pharmaciens>(this._url, pharmacies);
  }

  editPharmaciens(id: number, pharmacies: Pharmaciens): Observable<Pharmaciens> {
    return this._http.put<Pharmaciens>(this._url + pharmacies.cid, pharmacies);
  }

  deletePharmaciens(id: number): Observable<Pharmaciens> {
    return this._http.delete<Pharmaciens>(this._url + id)
  }
}
