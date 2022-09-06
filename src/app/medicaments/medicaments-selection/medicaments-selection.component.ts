import { AfterViewInit, Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { ModalService } from '../../_modal';
import _storeService from '../../Services/_store.service';
import { MedicamentsService } from 'src/app/Services/medicaments.service';
import { IMedicaments } from 'src/app/Models/IMedicaments';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-medicaments-selection',
  templateUrl: './medicaments-selection.component.html',
  styleUrls: ['./medicaments-selection.component.css']
})
export class MedicamentsSelectionComponent implements OnInit, AfterViewInit {
  bodyText: string = "";
  _storeService$ = _storeService.getInstance();
  title = 'GestPharmaFR';
  windowScrolled: boolean | undefined;
  dataSource = new MatTableDataSource<IMedicaments>();
  displayedFields: string[] = ['Nom des rôles', 'Details', 'Update', 'Delete'];   // ,'medecinRue','medecinFax'

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(private modalService: ModalService,
    private _MedicamentsService: MedicamentsService,
    @Inject(DOCUMENT) private document: Document,
    private route: Router,
  ) {
    this._storeService$.displayedColumns$ = new BehaviorSubject<string[]>(
      ['name',
        'details', 'update', 'delete']);   // ,'medecinRue','medecinFax'
    this._storeService$.medicamentsO$ = new Observable<MatTableDataSource<IMedicaments>>();
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
    this._storeService$.medicamentsO$ =
      this._MedicamentsService.getMedicaments().pipe(
        map(things => {
          console.log(things)
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
  }

  openFootModal(id: string) {
    this.modalService.open(id);
  }

  closeFootModal(id: string) {
    this.modalService.close(id);
  }

  sortData(sort: Sort) {
    this._storeService$.medicamentsO$ =
      this._storeService$.medicamentsO$.pipe(
        map(things => {
          things.sort = this.sort ?? null;
          this.dataSource = things
          return this.dataSource;
        }));
  }

  doFilter(value: string | null) {
    this._storeService$.medicamentsO$ =
      this._storeService$.medicamentsO$.pipe(
        map(things => {
          things.filter = value!.trim().toLocaleLowerCase();
          this.dataSource = things
          return this.dataSource;
        }));
  }
  redirectToCreate = () => {
    this._storeService$.medicamentsO$.subscribe(
      {
        next: (data: any) => {
          this.route.navigateByUrl('/roles/creation');
        }
      });
  }
  redirectToUpdate = (id: string) => {
    this._storeService$.medicamentsO$.subscribe(
      {
        next: (data: any) => {
          this._storeService$.inputIsCreation.next(false);
          this._storeService$.inputIsReadOnly.next(false);
          this.route.navigateByUrl('/roles/edition/' + id);
        }
      });
  }
  redirectToDelete = (id: string) => {
    this._storeService$.medicamentsO$.subscribe(
      {
        next: (data: any) => {
          this._storeService$.inputIsCreation.next(false);
          this._storeService$.inputIsReadOnly.next(true);
          this.route.navigateByUrl('/roles/edition/' + id);
        }
      });
  }
  redirectToDetails = (id: string) => {
    this._storeService$.medicamentsO$.subscribe(
      {
        next: (data: any) => {
          this._storeService$.inputIsCreation.next(false);
          this._storeService$.inputIsReadOnly.next(true);
          this.route.navigateByUrl('/roles/edition/' + id);
        }
      });
  }
}
