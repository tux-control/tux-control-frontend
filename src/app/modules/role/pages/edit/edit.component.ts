import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
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
  selector: 'app-role-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  private componentDestroyed$: Subject<boolean> = new Subject();
  permissions!: Permission[];
  role!: Role;
  editRoleForm!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;

  roles!: Role[];

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private roleService: RoleService,
    private permissionService: PermissionService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.role = {...<Role>this.route.snapshot.data.role};

    this.editRoleForm = this.formBuilder.group({
        name: [this.role.name, Validators.required],
        permissions: [this.role.permissions, Validators.required],
    });

    this.permissionService.onListAll$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((permissionPagedResult: PagedResult<Permission>) => {
      this.permissions = permissionPagedResult.data;
    });

    this.roleService.onUpdate$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((role: Role) => {
      this.alertService.success($localize `Role has been sucessfully saved.`, 'OK');
      this.loading = false;
      this.router.navigate(['/role']);
    });

    this.roleService.onUpdateError$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((responseError: ResponseError) => {
      this.alertService.error($localize `Role modification failed.`, responseError.message);
      this.loading = false;
    });

    this.permissionService.getPermissions(<LazyLoadEvent>{});
  }

  get rf() { return this.editRoleForm.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.editRoleForm.invalid) {
          return;
      }

      this.loading = true;

      this.role.name = this.rf.name.value;
      this.role.permissions = this.rf.permissions.value;
     
      this.roleService.updateRole(this.role);
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
