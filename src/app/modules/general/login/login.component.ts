import { Component, Directive, Injectable, OnInit } from '@angular/core';
import { PersonnesService } from 'src/app/services/personnes.service';
import { KeyValuePipe } from '@angular/common';
import TkStorage from 'src/app/services/storageHelper';
import jwtDecode from 'jwt-decode';
import { DecodedToken } from 'src/app/models/DecodedToken';
import _storeService from 'src/app/services/_store.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [KeyValuePipe]
})

export class LoginComponent implements OnInit {
  bodyText: string = "";
  title = 'Ecole';
  AccEmail = '';
  AccPwd = '';
  tokens = TkStorage.getInstance();
  _storeService$ = _storeService.getInstance();

  constructor(
    private _personnesService: PersonnesService,
    private keyValue: KeyValuePipe,
    private route: Router) {

    const content = 'Login content with meta';

  }
  ngOnInit(): void {
    this._storeService$.isUserLogin$.next(false);
    if (this.tokens.getAccessToken() !== null) { this._storeService$.isUserLogin$.next(true); }
  }

  async logUsers() {
    console.log('loguser');
    console.log(this.AccEmail);
    console.log(this.AccPwd)


    this.bodyText = 'Loading...';

    this._personnesService.addPersonnesLogin(this.AccEmail, this.AccPwd).subscribe(data => {
      const decoded = <DecodedToken>jwtDecode(data.token);
      this.tokens.setAccessToken(data.token);
      this._storeService$.isUserLogin$.next(true);
      this._storeService$.emailOfPersonneLogged$.next(decoded.unique_name);
      this._storeService$.rolesOfPersonneLogged$.next(decoded.role);
      //this.route.navigateByUrl('');
    });
  }
  byeUsers() {
    const tokens = TkStorage.getInstance();
    tokens.clear();
    this._storeService$.isUserLogin$.next(false);
    this._storeService$.emailOfPersonneLogged$.next(null);
    this._storeService$.rolesOfPersonneLogged$.next(null);
    this.route.navigateByUrl('home');
  }

}
