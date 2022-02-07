import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertService } from '@app/core/services/alert.service';
import { DialogService } from 'primeng/dynamicdialog';
import { FileInfo } from '@app/core/models/file-info';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private componentDestroyed$: Subject<boolean> = new Subject();
  
  constructor(
    private alertService: AlertService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
   
  }


  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
