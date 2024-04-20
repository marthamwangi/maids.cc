import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { CrudService } from 'src/app/service/crud.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject, map } from 'rxjs';
import { IUserModel, viewType } from 'src/app/model/user.model';
import { AsyncPipe, NgStyle, NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'ud-user-details',
  standalone: true,
  imports: [RouterLink, NgStyle, AsyncPipe, NgTemplateOutlet],
  templateUrl: './user-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDetailsComponent implements OnInit {
  private _changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _crudService: CrudService = inject(CrudService);
  private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  @ViewChild('skeletonRef', { static: true })
  private skeletonRef!: TemplateRef<any>;
  @ViewChild('contentRef', { static: true })
  private contentRef!: TemplateRef<any>;
  @ViewChild('noContentRef', { static: true })
  private noContentRef!: TemplateRef<any>;
  public renderedView: viewType = 'noContent';

  private _user: IUserModel | null = null;
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
        this._crudService.getOne(id).subscribe({
          next: (res) => {
            this._user = res.data.user;
            this.renderedUser$.next(this._user);
            if (this._user) {
              this.renderedView = 'content';
            } else {
              this.renderedView = 'noContent';
            }
            this._commonChangeDetector();
          },
        });
      });
    this.renderedView = 'skeleton';
  }
}
