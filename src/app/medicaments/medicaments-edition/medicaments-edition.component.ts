import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
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
  selector: 'app-medicaments-edition',
  templateUrl: './medicaments-edition.component.html',
  styleUrls: ['./medicaments-edition.component.css']
})
export class MedicamentsEditionComponent implements OnInit {
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
    this.Id = Number(this._activatedRoute.snapshot.params['id']);
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
    if (!this.inputIsCreation) {
      this._medicamentsService.getMedicamentsById(this.Id).subscribe(x => {
        const mdc = x[0] as IMedicaments;
        this.formGroup.controls['name'].setValue(mdc.name);
      }
      )
    }
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
    var formData: Medicaments = new Medicaments;
    this._medicamentsService.getMedicamentsById(this.Id).subscribe(x => {
      formData = x[0] as IMedicaments;
      formData.name = this.name.value;
      this._medicamentsService.editMedicaments(this.Id, formData).subscribe(x => {
        this._storeService$.medicamentsO$ =
          this._medicamentsService.getMedicaments().pipe(
            map(things => {
              const dataSource = new MatTableDataSource<IMedicaments>();
              dataSource.data = things;
              return dataSource;
            }));
        this._storeService$.inputIsCreation.next(false);
        this._storeService$.inputIsReadOnly.next(true);
        this.route.navigateByUrl('roles/selection');
      });
    }
    )
  }
  onKey(event: any) { this.document.body.tabIndex = 0; }

  deleteMedicament() {
    this._storeService$.inputIsCreation.next(false);
    this._storeService$.inputIsReadOnly.next(true);
    this._medicamentsService.deleteMedicaments(this.Id).subscribe(x => {
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

  editMedicament() {
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
  backMedicament() {
    this.route.navigateByUrl('roles/selection');
  }
}
