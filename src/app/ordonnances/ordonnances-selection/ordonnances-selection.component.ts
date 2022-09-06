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
import { Router } from '@angular/router';

@Component({
  selector: 'app-ordonnances-selection',
  templateUrl: './ordonnances-selection.component.html',
  styleUrls: ['./ordonnances-selection.component.css']
})
export class OrdonnancesSelectionComponent implements OnInit {
  bodyText: string = "";
  _storeService$ = _storeService.getInstance();
  title = 'GestPharmaFR';
  windowScrolled: boolean | undefined;
  dataSource = new MatTableDataSource<IOrdonnances>();
  displayedFields: string[] = ['Nom des formations', 'Details', 'Update', 'Delete'];   // ,'medecinRue','medecinFax'

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private modalService: ModalService,
    private _OrdonnancesService: OrdonnancesService,
    @Inject(DOCUMENT) private document: Document,
    private route: Router,
  ) {
    this._storeService$.displayedColumns$ = new BehaviorSubject<string[]>(
      ['fnom',
        'details', 'update', 'delete']);   // ,'medecinRue','medecinFax'
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
  }

  openFootModal(id: string) {
    this.modalService.open(id);
  }

  closeFootModal(id: string) {
    this.modalService.close(id);
  }

  sortData(sort: Sort) {
    this._storeService$.ordonnancesO$ =
      this._storeService$.ordonnancesO$.pipe(
        map(things => {
          things.sort = this.sort ?? null;
          this.dataSource = things
          return this.dataSource;
        }));
  }

  doFilter(value: string | null) {
    this._storeService$.ordonnancesO$ =
      this._storeService$.ordonnancesO$.pipe(
        map(things => {
          things.filter = value!.trim().toLocaleLowerCase();
          this.dataSource = things
          return this.dataSource;
        }));
  }
  redirectToCreate = () => {
    this._storeService$.ordonnancesO$.subscribe(
      {
        next: (data: any) => {
          this.route.navigateByUrl('/formations/creation');
        }
      });
  }
  redirectToUpdate = (id: string) => {
    this._storeService$.ordonnancesO$.subscribe(
      {
        next: (data: any) => {
          this._storeService$.inputIsCreation.next(false);
          this._storeService$.inputIsReadOnly.next(false);
          this.route.navigateByUrl('/formations/edition/' + id);
        }
      });
  }
  redirectToDelete = (id: string) => {
    this._storeService$.ordonnancesO$.subscribe(
      {
        next: (data: any) => {
          this._storeService$.inputIsCreation.next(false);
          this._storeService$.inputIsReadOnly.next(true);
          this.route.navigateByUrl('/formations/edition/' + id);
        }
      });
  }
  redirectToDetails = (id: string) => {
    this._storeService$.ordonnancesO$.subscribe(
      {
        next: (data: any) => {
          this._storeService$.inputIsCreation.next(false);
          this._storeService$.inputIsReadOnly.next(true);
          this.route.navigateByUrl('/formations/edition/' + id);
        }
      });
  }
}
