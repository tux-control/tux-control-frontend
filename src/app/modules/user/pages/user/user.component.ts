import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { ConfirmationService, FilterMetadata, LazyLoadEvent } from 'primeng/api';
import { UserService } from '@app/core/services/user.service';
import { AlertService } from '@app/core/services/alert.service';
import { User } from '@app/core/models/user';
import { Role } from '@app/core/models/role';

import { Table } from 'primeng/table';
import { takeUntil } from 'rxjs/operators';
import { PagedResult } from '@app/core/models/paged-result';
import { ResponseError } from '@app/core/models/response-error';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy, AfterViewInit {
  private componentDestroyed$: Subject<boolean> = new Subject();
  @ViewChild('dt') dt!: Table;
  users!: User[];
  roles!: Role[];
  selectedUsers!: User[];
  totalRecords!: number;
  gridLoading!: boolean;
  cols!: any[];

  filterRole: Role | undefined;

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.gridLoading = true;
    this.cols = [
        { field: 'email', header: 'Email', filterMatchMode: 'contains' },
        { field: 'fullName', header: $localize `Name`, filterMatchMode: 'contains' },
        { field: 'roles', header: $localize `Role`, filterMatchMode: 'equals' },
        { field: 'lastLogin', header: $localize `Last login`, filterMatchMode: 'contains' }
    ];

    this.userService.onListAll$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((pagedResultUser: PagedResult<User>) => {
      this.gridLoading = false;
      this.users = pagedResultUser.data;
      this.totalRecords = pagedResultUser.total;
    });

    this.userService.onDelete$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((user: User) => {
      this.alertService.success($localize `User has been sucessfully deleted.`, 'OK');
      this.users = this.users.filter((userFind: User) => userFind.id !== user.id);
      this.gridLoading = false;
    });

    this.userService.onDeleteError$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((responseError: ResponseError) => {
      this.alertService.error($localize `User deletion failed.`, responseError.message);
      this.gridLoading = false;
    });
  }

  ngAfterViewInit() {
    const roleFilterMetadata = <FilterMetadata>this.dt.filters['role'];
    this.filterRole = roleFilterMetadata?.value;
    this.cdRef.detectChanges();
  }

  loadUsersLazy(event: LazyLoadEvent) {
    this.gridLoading = true;
    this.userService.getUsers(event);
  }

  deleteUserWithButton(user: User) {
    this.confirmationService.confirm({
        message: $localize `Are you sure that you want to delete this user?`,
        accept: () => {
          this.gridLoading = true;
          this.userService.deleteUser(user);
        }
    });
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
