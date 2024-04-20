import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { initFlowbite } from 'flowbite';
import { NavbarComponent } from '../navbar/navbar.component';
import { CrudService } from 'src/app/service/crud.service';
import { AsyncPipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { IUserModel, viewType } from 'src/app/model/user.model';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  Subject,
  distinctUntilChanged,
  takeUntil,
} from 'rxjs';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'landing-page',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  imports: [
    NavbarComponent,
    NgFor,
    NgTemplateOutlet,
    NgIf,
    ReactiveFormsModule,
    AsyncPipe,
    RouterLink,
    RouterOutlet,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandingPage implements OnInit {
  private _changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _crudService: CrudService = inject(CrudService);
  private unsubscribe$: Subject<boolean> = new Subject<boolean>();

  @ViewChild('skeletonRef', { static: true })
  private skeletonRef!: TemplateRef<any>;
  @ViewChild('contentRef', { static: true })
  private contentRef!: TemplateRef<any>;
  @ViewChild('noContentRef', { static: true })
  private noContentRef!: TemplateRef<any>;

  public renderedView: viewType = 'noContent';

  public _users: Array<IUserModel> = [];
  public renderedUsers$: BehaviorSubject<Array<IUserModel>> =
    new BehaviorSubject<Array<IUserModel>>([]);
  public pages: number = 0;
  public totalPages: number = 0;
  public totalUSers: number = 0;
  public perPage: number = 0;
  public readonly indexOffset: number = 1;
  public start: number = 0;
  public end: number = 0;

  public currentPage = 1;
  private _params = { page: 1 };
  public search: string = '';
  public pagesList: Array<number> = [];

  public searchForm = new FormGroup({
    searchField: new FormControl(),
  });

  ngOnInit(): void {
    initFlowbite();
    this.getUsers();
    this.searchForUser();
  }

  private _commonChangeDetector(): void {
    this._changeDetectorRef.detectChanges();
  }

  public returnContentRef(): TemplateRef<any> {
    const templateMap: any = {
      skeleton: this.skeletonRef,
      content: this.contentRef,
      noContent: this.noContentRef,
    };
    return templateMap[this.renderedView];
  }

  public getUsers(): void {
    this._params.page = this.currentPage;
    this._crudService.getAllUsers(this._params).subscribe({
      next: (res) => {
        this._users = res.response.users;
        this.renderedUsers$.next(this._users);
        this.totalUSers = res.response.totalUsers;
        this.perPage = res.response.perPage;
        this.totalPages = res.response.totalPages;
        if (this._users.length) {
          this.renderedView = 'content';
        } else {
          this.renderedView = 'noContent';
        }
        this._createPagesList();
        this._createToAndFrom();
        this._commonChangeDetector();
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.renderedView = 'skeleton';
  }

  private _createPagesList(): void {
    const pagesList = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pagesList.push(i);
    }
    this.pagesList = pagesList;
  }

  private _createToAndFrom(): void {
    this.start =
      (this.currentPage - this.indexOffset) * this.perPage + this.indexOffset;

    /**
     * decide on the end
     */
    if (this.start + this.perPage >= this.totalUSers) {
      this.end = this.totalUSers;
    } else {
      this.end = this.start - this.indexOffset + this.perPage;
    }
  }

  public goToNextPage() {
    if (this.currentPage === this.totalPages) {
      return;
    }
    this.currentPage += 1;
    this.getUsers();
  }

  public goToPreviousPage() {
    if (this.currentPage === 1) {
      return;
    }
    this.currentPage -= 1;
    this.getUsers();
  }

  public showSetPagesCap(cap: number): void {
    this._createPagesList();
  }

  public skipToPage(page: number) {
    if (this.currentPage === page) {
      return;
    }
    this.currentPage = page;
    this.getUsers();
  }

  public searchForUser() {
    this.searchForm
      .get('searchField')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$), distinctUntilChanged())
      .subscribe({
        next: (searchTerm) =>
          this._filterUsers(searchTerm.toString().toLowerCase().trim()),
      });
  }

  private _filterUsers(searchTerm: string) {
    if (searchTerm) {
      this.renderedUsers$.next(
        this._users.filter(
          (user) =>
            user.id.toString().toLowerCase().trim() === searchTerm ||
            user.firstName.toLowerCase().trim().includes(searchTerm) ||
            user.lastName.toLowerCase().trim().includes(searchTerm)
        )
      );
      if (!this.renderedUsers$.value.length) {
        this.renderedView = 'noContent';
      } else {
        this.renderedView = 'content';
      }
      this._commonChangeDetector();
    } else {
      this.renderedUsers$.next(this._users);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
    this.unsubscribe$.complete();
  }
}
