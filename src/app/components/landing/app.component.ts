import {
  AfterViewInit,
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
import { NgFor, NgTemplateOutlet } from '@angular/common';

type view = 'skeleton' | 'content' | 'noContent';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NavbarComponent, NgFor, NgTemplateOutlet],
  providers: [CrudService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, AfterViewInit {
  private _changeDetectorRef: ChangeDetectorRef = inject(ChangeDetectorRef);
  @ViewChild('skeletonRef') private skeletonRef!: TemplateRef<any>;
  @ViewChild('contentRef') private contentRef!: TemplateRef<any>;
  @ViewChild('noContentRef') private noContentRef!: TemplateRef<any>;
  public currentView: view = 'skeleton';
  ngOnInit(): void {
    initFlowbite();
  }

  ngAfterViewInit(): void {
    this.returnContentRef();
    this._changeDetectorRef.detectChanges();
  }
  public returnContentRef(): TemplateRef<any> {
    const templateMap: any = {
      skeleton: this.skeletonRef,
      content: this.contentRef,
      noContent: this.noContentRef,
    };
    return templateMap['content'];
  }
}
