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
import { AsyncPipe, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';

import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  Subject,
  distinctUntilChanged,
  takeUntil,
} from 'rxjs';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import * as UserSelectors from '../../state-manager/state/selectors';
import * as UserActions from '../../state-manager/state/actions';
import { IUserModel, viewType } from 'src/app/state-manager/model/user.model';
import { AppState } from 'src/app/state-manager/state/store';

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
  private _store: Store<AppState> = inject(Store);

  private unsubscribe$: Subject<boolean> = new Subject<boolean>();

  @ViewChild('skeletonRef', { static: true })
  private skeletonRef!: TemplateRef<any>;
  @ViewChild('contentRef', { static: true })
  private contentRef!: TemplateRef<any>;
  @ViewChild('noContentRef', { static: true })
  private noContentRef!: TemplateRef<any>;

  public renderedView: viewType = 'noContent';

  private _users$: Observable<Array<IUserModel>> = this._store.select(
    UserSelectors.usersListSelector
  );

  private _users: Array<IUserModel> = [];

  public renderedUsers$: BehaviorSubject<Array<IUserModel>> =
    new BehaviorSubject<Array<IUserModel>>([]);

  public pages: number = 0;

  private _totalPages$: Observable<number> = this._store.select(
    UserSelectors.totalPagesSelector
  );

  private _totalUSers$: Observable<number> = this._store.select(
    UserSelectors.totalUsersSelector
  );
  private _perPage$: Observable<number> = this._store.select(
    UserSelectors.perPageSelector
  );

  public totalPages!: number;
  public totalUsers!: number;
  public perPage!: number;

  constructor() {
    this._totalPages$.subscribe((value) => {
      this.totalPages = value;
    });
    this._totalUSers$.subscribe((value) => {
      this.totalUsers = value;
    });
    this._perPage$.subscribe((value) => {
      this.perPage = value;
    });
  }

  public readonly indexOffset: number = 1;
  public start: number = 0;
  public end: number = 0;

  public currentPage = 1;
  public search: string = '';
  public pagesList: Array<number> = [];

  public searchForm = new FormGroup({
    searchField: new FormControl(),
  });

  ngOnInit(): void {
    initFlowbite();
    this._getUsers();
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

  public _getUsers(): void {
    this._store.dispatch(
      UserActions.getPageUsersFromBackend({ page: this.currentPage })
    );
    this.renderedView = 'skeleton';
    setTimeout(() => {
      this._renderUsers();
    }, 50);
  }

  private _renderUsers() {
    this._users$.subscribe({
      next: (res) => {
        if (res?.length) {
          this._users = res;
          this.renderedUsers$.next(res);
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
    if (this.start + this.perPage >= this.totalUsers) {
      this.end = this.totalUsers;
    } else {
      this.end = this.start - this.indexOffset + this.perPage;
    }
  }

  public goToNextPage() {
    if (this.currentPage === this.totalPages) {
      return;
    }
    this.currentPage += 1;
    console.log('current', this.currentPage);
    this._getUsers();
  }

  public goToPreviousPage() {
    if (this.currentPage === 1) {
      return;
    }
    this.currentPage -= 1;
    this._getUsers();
  }

  public showSetPagesCap(cap: number): void {
    this._createPagesList();
  }

  public skipToPage(page: number) {
    if (this.currentPage === page) {
      return;
    }
    this.currentPage = page;
    this._getUsers();
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
