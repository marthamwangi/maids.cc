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
import { NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { FormControl } from '@angular/forms';
import { IUserModel } from 'src/app/model/user.model';

type view = 'skeleton' | 'content' | 'noContent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NavbarComponent, NgFor, NgTemplateOutlet, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  private _changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  private _crudService: CrudService = inject(CrudService);

  @ViewChild('skeletonRef', { static: true })
  private skeletonRef!: TemplateRef<any>;
  @ViewChild('contentRef', { static: true })
  private contentRef!: TemplateRef<any>;
  @ViewChild('noContentRef', { static: true })
  private noContentRef!: TemplateRef<any>;

  public renderedView: view = 'noContent';

  public users: Array<IUserModel> = [];
  public pages: number = 0;
  public totalPages: number = 0;
  public totalUSers: number = 0;
  public perPage: number = 0;
  public readonly indexOffset: number = 1;
  public start: number = 0;
  public end: number = 0;

  public currentPage = 1;
  private _params = { page: 1 };
  public searchControl: FormControl = new FormControl('');
  public pagesList: Array<number> = [];

  ngOnInit(): void {
    initFlowbite();
    this.getUsers();
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
        this.users = res.response.users;
        this.totalUSers = res.response.totalUsers;
        this.perPage = res.response.perPage;
        this.totalPages = res.response.totalPages;
        if (this.users.length) {
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
    // const pagesCount = Math.ceil(this.totalUSers/this.perPage)
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
}
