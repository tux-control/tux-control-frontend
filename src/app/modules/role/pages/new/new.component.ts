import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { AlertService } from '@app/core/services/alert.service';
import { RoleService } from '@app/core/services/role.service';

import { Role } from '@app/core/models/role';

import { PermissionService } from '@app/core/services/permission.service';
import { Permission } from '@app/core/models/permission';
import { LazyLoadEvent } from 'primeng/api';
import { PagedResult } from '@app/core/models/paged-result';
import { ResponseError } from '@app/core/models/response-error';

@Component({
  selector: 'app-role-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit, OnDestroy {
  private componentDestroyed$: Subject<boolean> = new Subject();
  permissions!: Permission[];
  newRoleForm!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;

  roles!: Role[];

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.newRoleForm = this.formBuilder.group({
      name: ['', Validators.required],
      permissions: [null, [Validators.required]],
    });

    this.permissionService.onListAll$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((permissionPagedResult: PagedResult<Permission>) => {
      this.permissions = permissionPagedResult.data;
    });

    this.roleService.onCreate$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((role: Role) => {
      this.alertService.success($localize `Role has been sucessfully saved.`, 'OK');
      this.loading = false;

      // Reset form values
      this.rf.name.reset();
      this.rf.permissions.reset();
      this.router.navigate(['/role']);
    });

    this.roleService.onCreateError$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((responseError: ResponseError) => {
      this.alertService.error($localize `Role addition failed.`, responseError.message);
      this.loading = false;
    });

    this.permissionService.getPermissions(<LazyLoadEvent>{});
  }

  get rf() { return this.newRoleForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.newRoleForm.invalid) {
      return;
    }

    this.loading = true;

    const roleData = <Role>{
      name: this.rf.name.value,
      permissions: this.rf.permissions.value
    };

    this.roleService.addRole(roleData);
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
