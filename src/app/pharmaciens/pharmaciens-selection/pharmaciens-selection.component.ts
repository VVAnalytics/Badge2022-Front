import { AfterViewInit, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { ModalService } from '../../_modal';
import _storeService from '../../Services/_store.service';
import { PharmaciensService } from 'src/app/Services/pharmaciens.service';
import { IPharmaciens } from 'src/app/Models/IPharmaciens';
import { OrdonnancesService } from 'src/app/Services/ordonnances.service';
import { IOrdonnances } from 'src/app/Models/IOrdonnances';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-pharmaciens-selection',
  templateUrl: './pharmaciens-selection.component.html',
  styleUrls: ['./pharmaciens-selection.component.css'],

})
export class PharmaciensSelectionComponent implements OnInit {
  colorControl = new FormControl('primary');
  fontSizeControl = new FormControl(16, Validators.min(10));
  options = this._formBuilder.group({
    color: this.colorControl,
    fontSize: this.fontSizeControl,
  });
  bodyText: string = "";
  _storeService$ = _storeService.getInstance();
  title = 'GestPharmaFR';
  windowScrolled: boolean | undefined;
  dataSource = new MatTableDataSource<IPharmaciens>();
  dataSourceO = new MatTableDataSource<IOrdonnances>();
  displayedFields: string[] = ['Nom des cours', 'Details', 'Update', 'Delete'];   // ,'medecinRue','medecinFax'

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private modalService: ModalService,
    private _formBuilder: FormBuilder,
    private _PharmaciensService: PharmaciensService,
    private _OrdonnancesService: OrdonnancesService,
    @Inject(DOCUMENT) private document: Document,
    private route: Router,
  ) {
    this._storeService$.displayedColumns$ = new BehaviorSubject<string[]>(
      ['cnom',
        'details', 'update', 'delete']);   // ,'medecinRue','medecinFax'
    this._storeService$.pharmaciensO$ = new Observable<MatTableDataSource<IPharmaciens>>();
    this._storeService$.ordonnancesO$ = new Observable<MatTableDataSource<IOrdonnances>>();
  }

  @HostListener("window:scroll", [])

  onWindowScroll() {
    const element = document.getElementById("PgContent");
    if (window.pageYOffset || element!.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    }
    else if (this.windowScrolled && window.pageYOffset || element!.scrollTop || document.body.scrollTop < 10) {
      this.windowScrolled = false;
    }
    this.windowScrolled = true;
  }
  scrollToTop() {
    (function smoothscroll() {
      const element = document.getElementById("PgContent");
      element!.scrollIntoView();
    }
    )();
  }
  ngOnInit(): void {
    this._storeService$.ordonnancesO$ =
      this._OrdonnancesService.getOrdonnances().pipe(
        map(things => {
          const dataSourceO = new MatTableDataSource<IOrdonnances>();
          dataSourceO.data = things;
          return dataSourceO;
        }));

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
  }

  openFootModal(id: string) {
    this.modalService.open(id);
  }

  closeFootModal(id: string) {
    this.modalService.close(id);
  }

  sortData(sort: Sort) {
    this._storeService$.pharmaciensO$ =
      this._storeService$.pharmaciensO$.pipe(
        map(things => {
          things.sort = this.sort ?? null;
          this.dataSource = things
          return this.dataSource;
        }));
  }

  doFilter(value: string | null) {
    this._storeService$.pharmaciensO$ =
      this._storeService$.pharmaciensO$.pipe(
        map(things => {
          things.filter = value!.trim().toLocaleLowerCase();
          this.dataSource = things
          return this.dataSource;
        }));
  }
  redirectToCreate = () => {
    this._storeService$.pharmaciensO$.subscribe(
      {
        next: (data: any) => {
          this.route.navigateByUrl('/pharmaciens/creation');
        }
      });
  }
  redirectToUpdate = (id: string) => {
    this._storeService$.pharmaciensO$.subscribe(
      {
        next: (data: any) => {
          this._storeService$.inputIsCreation.next(false);
          this._storeService$.inputIsReadOnly.next(false);
          this.route.navigateByUrl('/pharmaciens/edition/' + id);
        }
      });
  }
  redirectToDelete = (id: string) => {
    this._storeService$.pharmaciensO$.subscribe(
      {
        next: (data: any) => {
          this._storeService$.inputIsCreation.next(false);
          this._storeService$.inputIsReadOnly.next(true);
          this.route.navigateByUrl('/pharmaciens/edition/' + id);
        }
      });
  }
  redirectToDetails = (id: string) => {
    this._storeService$.pharmaciensO$.subscribe(
      {
        next: (data: any) => {
          this._storeService$.inputIsCreation.next(false);
          this._storeService$.inputIsReadOnly.next(true);
          this.route.navigateByUrl('/pharmaciens/edition/' + id);
        }
      });
  }
}
