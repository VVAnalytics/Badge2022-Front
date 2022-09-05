import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { DecodedToken } from '../Models/DecodedToken';
import { PersonnesService } from '../Services/personnes.service';
import TkStorage from '../Services/storageHelper';
import _storeService from '../Services/_store.service';
import { ModalService } from '../_modal';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

  bodyText: string = "";
  _storeService$ = _storeService.getInstance();
  cheminImage: any = "/assets/images/admin-settings-male.png";
  tokens = TkStorage.getInstance();

  constructor(private modalService: ModalService,
    private personneService: PersonnesService) {
  }

  ngOnInit(): void {
    this.bodyText = 'Loading...';
    this.loadMenu();
  }

  openMenuModal(id: string) {
    this.modalService.open(id);
  }

  closeMenuModal(id: string) {
    this.modalService.close(id);
  }

  loadMenu(): void {
    const tokens = TkStorage.getInstance();
    if (this._storeService$.rolesOfPersonneLogged$.value != tokens.getAccessToken()) {
      const decoded = <DecodedToken>JSON.parse(JSON.stringify(jwtDecode(tokens.getAccessToken()))
        .replace("\"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name\"", "\"unique_name\"")
        .replace("\"http://schemas.microsoft.com/ws/2008/06/identity/claims/role\"", "\"role\""));
      this._storeService$.isUserLogin$.next(true);
      this._storeService$.emailOfPersonneLogged$.next(decoded.unique_name);
      this._storeService$.rolesOfPersonneLogged$.next(decoded.role);
    }
    this._storeService$.rolesOfPersonneLogged$.subscribe(
      {
        next: (data: any) => {
          switch (this._storeService$.rolesOfPersonneLogged$.value) {
            case "Admin": {
              this._storeService$.menuOption1$.next("Personnes");
              this._storeService$.menuOption2$.next("Formations");
              this._storeService$.menuOption3$.next("Cours");
              this._storeService$.menuOption4$.next("Notes");
              this._storeService$.menuOption5$.next("");
              this._storeService$.menuOption6$.next("Roles");
              this._storeService$.menuOption7$.next("");
              this._storeService$.menuOption8$.next("");
              this._storeService$.menuOption9$.next("");
              this.cheminImage = "/assets/images/_admin.png";
              break;
            }
            case "Professeurs": {
              this._storeService$.menuOption1$.next("");
              this._storeService$.menuOption2$.next("Formations");
              this._storeService$.menuOption3$.next("Cours");
              this._storeService$.menuOption4$.next("Notes");
              this._storeService$.menuOption5$.next("");
              this._storeService$.menuOption6$.next("");
              this._storeService$.menuOption7$.next("");
              this._storeService$.menuOption8$.next("");
              this._storeService$.menuOption9$.next("");
              this.cheminImage = "/assets/images/_patient.jpg";
              break;
            }
            case "Eleves": {
              this._storeService$.menuOption1$.next("");
              this._storeService$.menuOption2$.next("");
              this._storeService$.menuOption3$.next("");
              this._storeService$.menuOption4$.next("Notes");
              this._storeService$.menuOption5$.next("");
              this._storeService$.menuOption6$.next("");
              this._storeService$.menuOption7$.next("");
              this._storeService$.menuOption8$.next("");
              this._storeService$.menuOption9$.next("");
              this.cheminImage = "/assets/images/_praticien.png";
              break;
            }
            default: {
              this._storeService$.menuOption1$.next("Login");
              this._storeService$.menuOption2$.next("Register");
              this._storeService$.menuOption3$.next("");
              this._storeService$.menuOption4$.next("");
              this._storeService$.menuOption5$.next("");
              this._storeService$.menuOption6$.next("");
              this._storeService$.menuOption7$.next("");
              this._storeService$.menuOption8$.next("");
              this._storeService$.menuOption9$.next("");
              this.cheminImage = "/assets/images/_someone.png";
              break;
            }
          }
        }
      }
    );
  }
  button1() {
    switch (this._storeService$.rolesOfPersonneLogged$.value) {
      case "Admin": {

        break;
      }
      case "Eleves": {
        break;
      }
      case "Professeurs": {
        break;
      }
      default: {
        this.scrollTo('copyright');
        break;
      }
    }
  }

  button2() {
    switch (this._storeService$.rolesOfPersonneLogged$.value) {
      case "Admin": {
        break;
      }
      case "Eleves": {
        break;
      }
      case "Professeurs": {
        break;
      }
      default: {
        this.scrollTo('copyright');
        break;
      }
    }
  }
  button3() { }
  button4() { }
  button5() { }
  button6() { }
  button7() { }
  button8() { }
  button9() { }

  scrollTo(className: string): void {
    const elementList = document.querySelectorAll('.' + className);
    const element = elementList[0] as HTMLElement;
    element.scrollIntoView({ behavior: 'smooth' });
  }
  replaceSpec(Texte: string): string {
    let TabSpec: any = {}; // Using the Object literal notation
    TabSpec = { "à": "a", "á": "a", "â": "a", "ã": "a", "ä": "a", "å": "a", "ò": "o", "ó": "o", "ô": "o", "õ": "o", "ö": "o", "ø": "o", "è": "e", "é": "e", "ê": "e", "ë": "e", "ç": "c", "ì": "i", "í": "i", "î": "i", "ï": "i", "ù": "u", "ú": "u", "û": "u", "ü": "u", "ÿ": "y", "ñ": "n", "-": " ", "_": " " };
    var reg = /[àáäâèéêëçìíîïòóôõöøùúûüÿñ_-]/gi;
    return Texte.replace(reg, function () { return TabSpec[arguments[0].toLowerCase()]; }).toLowerCase();
  }
}

