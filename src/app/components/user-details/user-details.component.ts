import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { AsyncPipe, NgStyle, NgTemplateOutlet } from '@angular/common';
import { IUserModel, viewType } from 'src/app/state-manager/model/user.model';
import { AppState } from 'src/app/state-manager/state/store';
import { Store } from '@ngrx/store';
import * as fromUserSelector from '../../state-manager/state/selectors';
import * as fromUserAction from '../../state-manager/state/actions';
@Component({
  selector: 'ud-user-details',
  standalone: true,
  imports: [RouterLink, NgStyle, AsyncPipe, NgTemplateOutlet],
  templateUrl: './user-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsComponent implements OnInit {
  private _changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private _store: Store<AppState> = inject(Store);

  @ViewChild('skeletonRef', { static: true })
  private skeletonRef!: TemplateRef<any>;
  @ViewChild('contentRef', { static: true })
  private contentRef!: TemplateRef<any>;
  @ViewChild('noContentRef', { static: true })
  private noContentRef!: TemplateRef<any>;
  public renderedView: viewType = 'noContent';

  private _user$: Observable<IUserModel> = this._store.select(
    fromUserSelector.singleUserSelector
  );
  public renderedUser$: BehaviorSubject<IUserModel | null> =
    new BehaviorSubject<IUserModel | null>(null);

  ngOnInit(): void {
    this._getUserById();
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

  private _getUserById() {
    this._activatedRoute.params
      .pipe(map((params: any) => params.id))
      .subscribe((id) => {
        this._store.dispatch(fromUserAction.getSingleUserFromBackend({ id }));
        this.renderedView = 'skeleton';
        setTimeout(() => {
          this._renderUser();
        }, 50);
      });
  }
  private _renderUser() {
    this._user$.subscribe({
      next: (user) => {
        this.renderedUser$.next(user);
        if (this.renderedUser$.value?.id !== 0) {
          this.renderedView = 'content';
        } else {
          this.renderedView = 'noContent';
        }
      },
    });
    this._commonChangeDetector();
  }
}
