import { AfterViewInit, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { ModalService } from '../../_modal';
import _storeService from '../../services/_store.service';
import { MedicamentsService } from 'src/app/Services/medicaments.service';
import { IMedicaments } from 'src/app/Models/IMedicaments';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Medicaments } from 'src/app/Models/Medicaments';
import { Location } from '@angular/common';

@Component({
  selector: 'app-medicaments-creation',
  template: '<input (keydown.Tab)="onKey($event)">',
  templateUrl: './medicaments-creation.component.html',
  styleUrls: ['./medicaments-creation.component.css']
})
export class MedicamentsCreationComponent implements OnInit {
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
  dataSource = new MatTableDataSource<IMedicaments>();
  displayedFields: string[] = ['Nom du rôle', 'Details', 'Update', 'Delete'];   // ,'MedicamentRue','MedicamentFax'

  Id: number = 0;
  medicaments: Medicaments = new Medicaments;

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private _activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private location: Location,
    private _medicamentsService: MedicamentsService,
    @Inject(DOCUMENT) private document: Document,
    private route: Router,
  ) {
    this._storeService$.displayedColumns$ = new BehaviorSubject<string[]>(
      ['name',
        'details', 'update', 'delete']);   // ,'MedicamentRue','MedicamentFax'
    this._storeService$.medicamentsO$ = new Observable<MatTableDataSource<IMedicaments>>();
    this.inputIsCreation = (this._storeService$.inputIsCreation.value == true) ? true : false;
    this.inputIsReadOnly = (this._storeService$.inputIsReadOnly.value == true) ? true : false;
    //this.Id = Number(this._activatedRoute.snapshot.params['id']);
  }
  @HostListener("window:scroll", [])

  ngOnInit(): void {
    this._storeService$.medicamentsO$ =
      this._medicamentsService.getMedicaments().pipe(
        map(things => {
          const dataSource = new MatTableDataSource<IMedicaments>();
          dataSource.data = things;
          return dataSource;
        }));
    this.ngAfterViewInit();
  }
  ngAfterViewInit(): void {
    this._storeService$.medicamentsO$ =
      this._storeService$.medicamentsO$.pipe(
        map(things => {
          things.sort = this.sort ?? null;
          things.paginator = this.paginator ?? null;
          this.dataSource = things
          return this.dataSource;
        }));
    this.createForm();
    this.formGroup = this._storeService$.medicamentsCreationFG$;
  }

  createForm() {
    let nameregex: RegExp = /[A-Za-z0-9]/;

    this._storeService$.medicamentsCreationFG$ = this.formBuilder.group({
      'name': [null, [Validators.required,
      Validators.minLength(2), Validators.maxLength(255),
      Validators.pattern(nameregex)]],

    });
  }

  get name() {
    return this.formGroup.get('name') as FormControl
  }

  getErrorMedicamentName() {
    return this.formGroup!.get('name')!.hasError('required') ? 'Field is required' :
      this.formGroup!.get('name')!.hasError('pattern') ? 'Not a valid NAME' :
        this.formGroup!.get('name')!.hasError('alreadyInUse') ? 'This NAME is already in use' : '';
  }

  onSubmit(post: any) {
    this.post = post;
    let formData: Medicaments = new Medicaments;
    formData.id = 0;
    formData.name = this.name.value;
    this._medicamentsService.addMedicaments(formData).subscribe(r => {
      this._storeService$.medicamentsO$ =
        this._medicamentsService.getMedicaments().pipe(
          map(things => {
            const dataSource = new MatTableDataSource<IMedicaments>();
            dataSource.data = things;
            return dataSource;
          }));
      this.route.navigateByUrl('roles/selection');
    });
  }
  onKey(event: any) { this.document.body.tabIndex = 0; }
}

