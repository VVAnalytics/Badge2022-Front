import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { ModalService } from '../../_modal';
import _storeService from '../../Services/_store.service';
import { MedecinsService } from 'medecins.service';
import { IMedecins } from 'src/app/Models/IMedecins';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Medecins } from 'src/app/Models/Medecins';
import { Location } from '@angular/common';

@Component({
  selector: 'app-medecins-edition',
  templateUrl: './medecins-edition.component.html',
  styleUrls: ['./medecins-edition.component.css']
})

export class MedecinsEditionComponent implements OnInit {
  values = '';
  titleAlert: string = 'This field is required';
  _storeService$ = _storeService.getInstance();
  post: any = '';
  formGroup!: FormGroup;

  // Param de l'écran :
  inputIsCreation: boolean = false;
  inputIsReadOnly: boolean = true;

  bodyText: string = "";
  title = 'GestPharmaFR';
  windowScrolled: boolean | undefined;
  dataSource = new MatTableDataSource<IMedecins>();
  displayedFields: string[] = ['Nom', 'Prénom', 'Rue', 'Code postal', 'Ville', 'Email', 'Details', 'Update', 'Delete'];   // ,'medecinRue','medecinFax'

  Id: number = 0;
  medecins: Medecins = new Medecins;

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private _activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private location: Location,
    private _medecinsService: MedecinsService,
    @Inject(DOCUMENT) private document: Document,
    private route: Router,
  ) {
    this._storeService$.displayedColumns$ = new BehaviorSubject<string[]>(
      ['unom', 'uprenom', 'urue',
        'ucodep', 'uville', 'email',
        'details', 'update', 'delete']);   // ,'medecinRue','medecinFax'
    this._storeService$.dataSourceO$ = new Observable<MatTableDataSource<IMedecins>>();
    this.inputIsCreation = (this._storeService$.inputIsCreation.value == true) ? true : false;
    this.inputIsReadOnly = (this._storeService$.inputIsReadOnly.value == true) ? true : false;
    this.Id = Number(this._activatedRoute.snapshot.params['id']);
  }

  @HostListener("window:scroll", [])

  ngOnInit(): void {
    this._storeService$.dataSourceO$ =
      this._medecinsService.getMedecins().pipe(
        map(things => {
          const dataSource = new MatTableDataSource<IMedecins>();
          dataSource.data = things;
          return dataSource;
        }));
    this._storeService$.dataSourceO$ =
      this._storeService$.dataSourceO$.pipe(
        map(things => {
          things.sort = this.sort ?? null;
          things.paginator = this.paginator ?? null;
          this.dataSource = things
          return this.dataSource;
        }));
    this.createForm();
    this.formGroup = this._storeService$.medecinCreationFG$;
    if (!this.inputIsCreation) {
      this._medecinsService.getMedecinsById(this.Id).subscribe(x => {
        const mdc = x;  //x[0] as IMedecins;
        this.formGroup.controls['unom'].setValue(mdc.unom);
        this.formGroup.controls['uprenom'].setValue(mdc.uprenom);
        this.formGroup.controls['urue'].setValue(mdc.urue);
        this.formGroup.controls['ucodep'].setValue(mdc.ucodep);
        this.formGroup.controls['uville'].setValue(mdc.uville);
        this.formGroup.controls['email'].setValue(mdc.email);
      }
      )
    }
  }

  createForm() {
    let nameregex: RegExp = /[A-Za-z0-9]/;
    let inamiregex: RegExp = /[A-Za-z0-9]/;
    let rueregex: RegExp = /[A-Za-z0-9]/;
    let villeregex: RegExp = /[0-9]{4,4}/;
    let telregex: RegExp = /[A-Za-z0-9]/;
    let gsmregex: RegExp = /^[\w\.=-]+@[\w\.-]+\.[\w]{2,3}$/;

    this._storeService$.medecinCreationFG$ = this.formBuilder.group({
      'unom': [null, [Validators.required,
      Validators.minLength(2), Validators.maxLength(255),
      Validators.pattern(nameregex)]],

      'uprenom': [null, [Validators.required,
      Validators.minLength(2), Validators.maxLength(255),
      Validators.pattern(inamiregex)]],

      'urue': [null, [Validators.required,
      Validators.minLength(2), Validators.maxLength(255),
      Validators.pattern(rueregex)]],

      'ucodep': [null, [Validators.required,
      Validators.minLength(2), Validators.maxLength(255),
      Validators.pattern(villeregex)]],

      'uville': [null, [Validators.required,
      Validators.minLength(2), Validators.maxLength(255),
      Validators.pattern(telregex)]],

      'email': [null, [Validators.required,
      Validators.minLength(2), Validators.maxLength(255),
      Validators.pattern(gsmregex)]],
    });
  }

  get unom() {
    return this.formGroup.get('unom') as FormControl
  }
  get uprenom() {
    return this.formGroup.get('uprenom') as FormControl
  }
  get urue() {
    return this.formGroup.get('urue') as FormControl
  }
  get ucodep() {
    return this.formGroup.get('ucodep') as FormControl
  }
  get uville() {
    return this.formGroup.get('uville') as FormControl
  }
  get email() {
    return this.formGroup.get('email') as FormControl
  }

  getErrorMedecinName() {
    return this.formGroup!.get('unom')!.hasError('required') ? 'Field is required' :
      this.formGroup!.get('unom')!.hasError('pattern') ? 'Not a valid NAME' :
        this.formGroup!.get('unom')!.hasError('alreadyInUse') ? 'This NAME is already in use' : '';
  }
  getErrorMedecinInami() {
    return this.formGroup!.get('uprenom')!.hasError('required') ? 'Field is required' :
      this.formGroup!.get('uprenom')!.hasError('pattern') ? 'Not a valid INAMI number' :
        this.formGroup!.get('uprenom')!.hasError('alreadyInUse') ? 'This INAMI number is already in use' : '';
  }
  getErrorMedecinRue() {
    return this.formGroup!.get('urue')!.hasError('required') ? 'Field is required' :
      this.formGroup!.get('urue')!.hasError('pattern') ? 'Not a valid street' :
        this.formGroup!.get('urue')!.hasError('alreadyInUse') ? 'This street is already in use' : '';
  }
  getErrorMedecinVille() {
    return this.formGroup!.get('ucodep')!.hasError('required') ? 'Field is required' :
      this.formGroup!.get('ucodep')!.hasError('pattern') ? 'Not a valid town' :
        this.formGroup!.get('ucodep')!.hasError('alreadyInUse') ? 'This town is already in use' : '';
  }
  getErrorMedecinTelephone() {
    return this.formGroup!.get('uville')!.hasError('required') ? 'Field is required' :
      this.formGroup!.get('uville')!.hasError('pattern') ? 'Not a valid phone' :
        this.formGroup!.get('uville')!.hasError('alreadyInUse') ? 'This phone is already in use' : '';
  }
  getErrorMedecinGsm() {
    return this.formGroup!.get('email')!.hasError('required') ? 'Field is required' :
      this.formGroup!.get('email')!.hasError('pattern') ? 'Not a valid GSM' :
        this.formGroup!.get('email')!.hasError('alreadyInUse') ? 'This GSM is already in use' : '';
  }


  onSubmit(post: any) {
    this.post = post;
    var formData: Medecins = new Medecins;
    this._medecinsService.getMedecinsById(this.Id).subscribe(x => {
      formData = x;
      formData.unom = this.unom.value;
      formData.uprenom = this.uprenom.value;
      formData.urue = this.urue.value;
      formData.ucodep = this.ucodep.value;
      formData.uville = this.uville.value;
      formData.email = this.email.value;
      this._medecinsService.editMedecins(this.Id, formData).subscribe(x => {
        this._storeService$.dataSourceO$ =
          this._medecinsService.getMedecins().pipe(
            map(things => {
              const dataSource = new MatTableDataSource<IMedecins>();
              dataSource.data = things;
              return dataSource;
            }));
        this._storeService$.inputIsCreation.next(false);
        this._storeService$.inputIsReadOnly.next(true);
        this.route.navigateByUrl('personnes/selection');
      });
    }
    )
  }
  onKey(event: any) { this.document.body.tabIndex = 0; }

  deleteMedecin() {
    this._storeService$.inputIsCreation.next(false);
    this._storeService$.inputIsReadOnly.next(true);
    this._medecinsService.deleteMedecins(this.Id).subscribe(x => {
      this._storeService$.dataSourceO$ =
        this._medecinsService.getMedecins().pipe(
          map(things => {
            const dataSource = new MatTableDataSource<IMedecins>();
            dataSource.data = things;
            return dataSource;
          }));
      this.route.navigateByUrl('personnes/selection');
    });
  }

  editMedecin() {
    console.log("edit")
    this._storeService$.inputIsCreation.next(false);
    this._storeService$.inputIsReadOnly.next(false);
    this.reloadComponent();
  }

  reloadComponent() {
    let currentUrl = this.route.url;
    console.log(currentUrl)
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
    });
  }
  backMedecins() {
    this.route.navigateByUrl('personnes/selection');
  }
}
