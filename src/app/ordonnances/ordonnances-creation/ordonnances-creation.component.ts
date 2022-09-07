import { AfterViewInit, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { ModalService } from '../../_modal';
import _storeService from '../../Services/_store.service';
import { OrdonnancesService } from 'src/app/Services/ordonnances.service';
import { IOrdonnances } from 'src/app/Models/IOrdonnances';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Ordonnances } from 'src/app/Models/Ordonnances';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ordonnances-creation',
  template: '<input (keydown.Tab)="onKey($event)">',
  templateUrl: './ordonnances-creation.component.html',
  styleUrls: ['./ordonnances-creation.component.css']
})
export class OrdonnancesCreationComponent implements OnInit {
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
  dataSource = new MatTableDataSource<IOrdonnances>();
  displayedFields: string[] = ['Nom de la nouvelle formation', 'Details', 'Update', 'Delete'];   // ,'OrdonnanceRue','OrdonnanceFax'

  Id: number = 0;
  Ordonnances: Ordonnances = new Ordonnances;

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private _activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private location: Location,
    private _OrdonnancesService: OrdonnancesService,
    @Inject(DOCUMENT) private document: Document,
    private route: Router,
  ) {
    this._storeService$.displayedColumns$ = new BehaviorSubject<string[]>(
      ['fnom',
        'details', 'update', 'delete']);   // ,'OrdonnanceRue','OrdonnanceFax'
    this._storeService$.ordonnancesO$ = new Observable<MatTableDataSource<IOrdonnances>>();
    this.inputIsCreation = (this._storeService$.inputIsCreation.value == true) ? true : false;
    this.inputIsReadOnly = (this._storeService$.inputIsReadOnly.value == true) ? true : false;
    //this.Id = Number(this._activatedRoute.snapshot.params['id']);
  }
  @HostListener("window:scroll", [])

  ngOnInit(): void {
    this._storeService$.ordonnancesO$ =
      this._OrdonnancesService.getOrdonnances().pipe(
        map(things => {
          const dataSource = new MatTableDataSource<IOrdonnances>();
          dataSource.data = things;
          return dataSource;
        }));
    this.ngAfterViewInit();
  }
  ngAfterViewInit(): void {
    this._storeService$.ordonnancesO$ =
      this._storeService$.ordonnancesO$.pipe(
        map(things => {
          things.sort = this.sort ?? null;
          things.paginator = this.paginator ?? null;
          this.dataSource = things
          return this.dataSource;
        }));
    this.createForm();
    this.formGroup = this._storeService$.ordonnancesCreationFG$;
  }

  createForm() {
    let nameregex: RegExp = /[A-Za-z0-9]/;

    this._storeService$.ordonnancesCreationFG$ = this.formBuilder.group({
      'fnom': [null, [Validators.required,
      Validators.minLength(2), Validators.maxLength(255),
      Validators.pattern(nameregex)]],

    });
  }

  get fnom() {
    return this.formGroup.get('fnom') as FormControl
  }

  getErrorOrdonnanceName() {
    return this.formGroup!.get('fnom')!.hasError('required') ? 'Field is required' :
      this.formGroup!.get('fnom')!.hasError('pattern') ? 'Not a valid NAME' :
        this.formGroup!.get('fnom')!.hasError('alreadyInUse') ? 'This NAME is already in use' : '';
  }

  onSubmit(post: any) {
    this.post = post;
    let formData: Ordonnances = new Ordonnances;
    formData.fid = 0;
    formData.fnom = this.fnom.value;
    this._OrdonnancesService.addOrdonnances(formData).subscribe(r => {
      this._storeService$.ordonnancesO$ =
        this._OrdonnancesService.getOrdonnances().pipe(
          map(things => {
            const dataSource = new MatTableDataSource<IOrdonnances>();
            dataSource.data = things;
            return dataSource;
          }));
      this.route.navigateByUrl('formations/selection');
    });
  }
  onKey(event: any) { this.document.body.tabIndex = 0; }
}

