import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { ModalService } from '../../_modal';
import _storeService from '../../Services/_store.service';
import { MedecinsService } from 'src/app/Services/medecins.service';
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

  medecinsId: number = 0;
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
        'ucodep', 'uville', 'Email',
        'details', 'update', 'delete']);   // ,'medecinRue','medecinFax'
    this._storeService$.dataSourceO$ = new Observable<MatTableDataSource<IMedecins>>();
    this.inputIsCreation = (this._storeService$.inputIsCreation.value == true) ? true : false;
    this.inputIsReadOnly = (this._storeService$.inputIsReadOnly.value == true) ? true : false;
    this.medecinsId = Number(this._activatedRoute.snapshot.params['id']);
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
      this._medecinsService.getMedecinsById(this.medecinsId).subscribe(x => {
        const mdc = x[0] as IMedecins;
        this.formGroup.controls['uprenom'].setValue(mdc.unom);
        this.formGroup.controls['uprenom'].setValue(mdc.uprenom);
        this.formGroup.controls['urue'].setValue(mdc.urue);
        this.formGroup.controls['ucodep'].setValue(mdc.ucodep);
        this.formGroup.controls['uville'].setValue(mdc.uville);
        this.formGroup.controls['Email'].setValue(mdc.Email);
      }
      )
    }
  }

  createForm() {
    let nameregex: RegExp = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
    let inamiregex: RegExp = /^[0-9]{6,6}$/;
    let rueregex: RegExp = /^[\w'\-,.][^_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
    let villeregex: RegExp = /^[\w'\-,.][^_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
    let telregex: RegExp = /^[\+]?[(]?[0-9]{3,4}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    let gsmregex: RegExp = /^[\+]?[(]?[0-9]{3,4}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    let faxregex: RegExp = /^[\+]?[(]?[0-9]{3,4}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    let emailregex: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    this._storeService$.medecinCreationFG$ = this.formBuilder.group({
      'unom': [null, [Validators.required,
      Validators.minLength(5), Validators.maxLength(255),
      Validators.pattern(nameregex)], [this.checkInUseName()]],

      'uprenom': [null, [Validators.required,
      Validators.minLength(5), Validators.maxLength(255),
      Validators.pattern(inamiregex)], [this.checkInUseINAMI()]],

      'urue': [null, [Validators.required,
      Validators.minLength(5), Validators.maxLength(255),
      Validators.pattern(rueregex)], [this.checkInUseRue()]],

      'ucodep': [null, [Validators.required,
      Validators.minLength(5), Validators.maxLength(255),
      Validators.pattern(villeregex)], [this.checkInUseVille()]],

      'uville': [null, [Validators.required,
      Validators.minLength(10), Validators.maxLength(12),
      Validators.pattern(telregex)], [this.checkInUseTel()]],

      'Email': [null, [Validators.required,
      Validators.minLength(10), Validators.maxLength(10),
      Validators.pattern(gsmregex)], [this.checkInUseGsm()]],
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
  get Email() {
    return this.formGroup.get('Email') as FormControl
  }


  checkInUseName(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this._storeService$.dataSourceO$.pipe(
        map(things => {
          things.filter = control.value!.trim().toLocaleUpperCase();
          this.dataSource = things;
          return (this.dataSource.filteredData.length > 0 &&
            this.inputIsReadOnly == true) ? { 'alreadyInUse': true } : null;
        }));
    }
  }
  checkInUseINAMI(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this._storeService$.dataSourceO$.pipe(
        map(things => {
          things.filter = control.value!.trim().toLocaleLowerCase();
          this.dataSource = things;
          let checkInami: number = this.dataSource.filteredData.length;
          if (Number(control.value) % 97 != 0) {
            if (Number(control.value) % 89 != 0) {
              if (Number(control.value) % 83 != 0) {
                checkInami = Number(control.value) % 74
              }
            }
          }
          return (checkInami = 0 &&
            this.inputIsReadOnly == true) ? { 'alreadyInUse': true } : null;
        }));
    }
  }
  checkInUseRue(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this._storeService$.dataSourceO$.pipe(
        map(things => {
          things.filter = control.value!.trim().toLocaleUpperCase();
          this.dataSource = things;
          return (this.dataSource.filteredData.length > 0 && this.inputIsReadOnly == true) ? { 'alreadyInUse': true } : null;
        }));
    }
  }
  checkInUseVille(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this._storeService$.dataSourceO$.pipe(
        map(things => {
          things.filter = control.value!.trim().toLocaleLowerCase();
          this.dataSource = things;
          return (this.dataSource.filteredData.length > 0 && this.inputIsReadOnly == true) ? { 'alreadyInUse': null } : null;
        }));
    }
  }
  checkInUseTel(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this._storeService$.dataSourceO$.pipe(
        map(things => {
          things.filter = control.value!.trim().toLocaleLowerCase();
          this.dataSource = things;
          return (this.dataSource.filteredData.length > 0 &&
            this.inputIsReadOnly == true) ? { 'alreadyInUse': true } : null;
        }));
    }
  }
  checkInUseGsm(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this._storeService$.dataSourceO$.pipe(
        map(things => {
          things.filter = control.value!.trim().toLocaleLowerCase();
          this.dataSource = things;
          return (this.dataSource.filteredData.length > 0 &&
            this.inputIsReadOnly == true) ? { 'alreadyInUse': true } : null;
        }));
    }
  }
  checkInUseFax(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this._storeService$.dataSourceO$.pipe(
        map(things => {
          things.filter = control.value!.trim().toLocaleLowerCase();
          this.dataSource = things;
          return (this.dataSource.filteredData.length > 0 &&
            this.inputIsReadOnly == true) ? { 'alreadyInUse': true } : null;
        }));
    }
  }
  checkInUseEmail(): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
      return this._storeService$.dataSourceO$.pipe(
        map(things => {
          things.filter = control.value!.trim().toLocaleLowerCase();
          this.dataSource = things;
          return (this.dataSource.filteredData.length > 0 &&
            this.inputIsReadOnly == true) ? { 'alreadyInUse': true } : null;
        }));
    }
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
    return this.formGroup!.get('Email')!.hasError('required') ? 'Field is required' :
      this.formGroup!.get('Email')!.hasError('pattern') ? 'Not a valid GSM' :
        this.formGroup!.get('Email')!.hasError('alreadyInUse') ? 'This GSM is already in use' : '';
  }


  onSubmit(post: any) {
    this.post = post;
    let formData: Medecins = new Medecins;
    //formData.MedecinId = 0;
    formData.unom = this.unom.value;
    formData.uprenom = this.uprenom.value;
    formData.urue = this.urue.value;
    formData.ucodep = this.ucodep.value;
    formData.uville = this.uville.value;
    formData.Email = this.Email.value;

    this._medecinsService.addMedecins(formData).subscribe(r => { });
    this._storeService$.dataSourceO$ =
      this._medecinsService.getMedecins().pipe(
        map(things => {
          const dataSource = new MatTableDataSource<IMedecins>();
          dataSource.data = things;
          return dataSource;
        }));
    this._storeService$.inputIsCreation.next(false);
    this._storeService$.inputIsReadOnly.next(true);
    this.route.navigateByUrl('medecins/selection');
  }
  onKey(event: any) { this.document.body.tabIndex = 0; }

  deleteMedecin() {
    this._storeService$.inputIsCreation.next(false);
    this._storeService$.inputIsReadOnly.next(true);
    this._medecinsService.deleteMedecins(this.medecinsId).subscribe(x => {
      this._storeService$.dataSourceO$ =
        this._medecinsService.getMedecins().pipe(
          map(things => {
            const dataSource = new MatTableDataSource<IMedecins>();
            dataSource.data = things;
            return dataSource;
          }));
      this.route.navigateByUrl('medecins/selection');
    });
  }

  editMedecin() {
    this._storeService$.inputIsCreation.next(false);
    this._storeService$.inputIsReadOnly.next(false);
    console.log(this.location.path());

    //window.location.reload();
    //this.reloadComponent;
    this.reloadCurrentRoute;

    /*     this.route.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
          this.route.navigate([this.location.path()]);
        });
        this.route.navigate([this.location.path()]); */
  }

  reloadComponent() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  reloadCurrentRoute() {
    let currentUrl = this.route.url;
    this.route.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.route.navigate([currentUrl]);
      console.log(currentUrl);
    });
  }
}
