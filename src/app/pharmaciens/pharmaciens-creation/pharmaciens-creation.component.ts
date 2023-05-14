import { AfterViewInit, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { ModalService } from '../../_modal';
import _storeService from '../../services/_store.service';
import { PharmaciensService } from 'src/app/Services/pharmaciens.service';
import { IPharmaciens } from 'src/app/Models/IPharmaciens';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Pharmaciens } from 'src/app/Models/Pharmaciens';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pharmaciens-creation',
  templateUrl: './pharmaciens-creation.component.html',
  styleUrls: ['./pharmaciens-creation.component.css']
})
export class PharmaciensCreationComponent implements OnInit {
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
  dataSource = new MatTableDataSource<IPharmaciens>();
  displayedFields: string[] = ['Nom du cours', 'Details', 'Update', 'Delete'];   // ,'PharmacienRue','PharmacienFax'

  Id: number = 0;
  Pharmaciens: Pharmaciens = new Pharmaciens;

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private _activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private location: Location,
    private _PharmaciensService: PharmaciensService,
    @Inject(DOCUMENT) private document: Document,
    private route: Router,
  ) {
    this._storeService$.displayedColumns$ = new BehaviorSubject<string[]>(
      ['cnom',
        'details', 'update', 'delete']);   // ,'PharmacienRue','PharmacienFax'
    this._storeService$.pharmaciensO$ = new Observable<MatTableDataSource<IPharmaciens>>();
    this.inputIsCreation = (this._storeService$.inputIsCreation.value == true) ? true : false;
    this.inputIsReadOnly = (this._storeService$.inputIsReadOnly.value == true) ? true : false;
    //this.Id = Number(this._activatedRoute.snapshot.params['id']);
  }
  @HostListener("window:scroll", [])

  ngOnInit(): void {
    this._storeService$.pharmaciensO$ =
      this._PharmaciensService.getPharmaciens().pipe(
        map(things => {
          const dataSource = new MatTableDataSource<IPharmaciens>();
          dataSource.data = things;
          return dataSource;
        }));
    this.ngAfterViewInit();
  }
  ngAfterViewInit(): void {
    this._storeService$.pharmaciensO$ =
      this._storeService$.pharmaciensO$.pipe(
        map(things => {
          things.sort = this.sort ?? null;
          things.paginator = this.paginator ?? null;
          this.dataSource = things
          return this.dataSource;
        }));
    this.createForm();
    this.formGroup = this._storeService$.pharmaciensCreationFG$;
  }

  createForm() {
    let nameregex: RegExp = /[A-Za-z0-9]/;

    this._storeService$.pharmaciensCreationFG$ = this.formBuilder.group({
      'fnom': [null, [Validators.required,
      Validators.minLength(2), Validators.maxLength(255),
      Validators.pattern(nameregex)]],

    });
  }

  get fnom() {
    return this.formGroup.get('cnom') as FormControl
  }

  getErrorPharmacienName() {
    return this.formGroup!.get('cnom')!.hasError('required') ? 'Field is required' :
      this.formGroup!.get('cnom')!.hasError('pattern') ? 'Not a valid NAME' :
        this.formGroup!.get('cnom')!.hasError('alreadyInUse') ? 'This NAME is already in use' : '';
  }

  onSubmit(post: any) {
    this.post = post;
    let formData: Pharmaciens = new Pharmaciens;
    formData.cid = 0;
    formData.cnom = this.fnom.value;
    this._PharmaciensService.addPharmaciens(formData).subscribe(r => {
      this._storeService$.pharmaciensO$ =
        this._PharmaciensService.getPharmaciens().pipe(
          map(things => {
            const dataSource = new MatTableDataSource<IPharmaciens>();
            dataSource.data = things;
            return dataSource;
          }));
      this.route.navigateByUrl('cours/selection');
    });
  }
  onKey(event: any) { this.document.body.tabIndex = 0; }
}

