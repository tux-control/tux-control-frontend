import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppValidators } from '@app/core/validators/app-validators';

import { UserService } from '@app/core/services/user.service';
import { AlertService } from '@app/core/services/alert.service';
import { RoleService } from '@app/core/services/role.service';

import { Role } from '@app/core/models/role';
import { User } from '@app/core/models/user';
import { PagedResult } from '@app/core/models/paged-result';
import { ResponseError } from '@app/core/models/response-error';


@Component({
  selector: 'app-user-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  private componentDestroyed$: Subject<boolean> = new Subject();
  user!: User;
  editUserForm!: FormGroup;
  passwordFormGroup!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;

  roles!: Role[];

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private userService: UserService,
    private roleService: RoleService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  checkPasswords(group: FormGroup): {[key: string]: any} | null {
    const pass = group.controls.password.value;
    const repeatPassword = group.controls.repeatPassword.value;

    return pass === repeatPassword ? null : { notSame: true };
  }

  ngOnInit() {
    this.user = {...<User>this.route.snapshot.data.user};

    this.passwordFormGroup = this.formBuilder.group({
      password: ['', [AppValidators.passwordValidator('medium')]],
      repeatPassword: ['', [AppValidators.passwordValidator('medium')]]
    }, {
      validator: this.checkPasswords
    });

    this.editUserForm = this.formBuilder.group({
        email: [this.user.email, Validators.required],
        firstName: [this.user.firstName, Validators.required],
        lastName: [this.user.lastName, [Validators.required]],
        systemUser: [this.user.systemUser, Validators.required],
        roles: [this.user.roles, Validators.required],

        passwordFormGroup: this.passwordFormGroup
    });
    
    this.roleService.onListAll$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((rolePagedResult: PagedResult<Role>) => {
      this.roles = rolePagedResult.data;
    });

    this.userService.onUpdate$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((user: User) => {
      this.alertService.success($localize `User has been sucessfully modified.`, 'OK');
      this.loading = false;
      this.router.navigate(['/user']);
    });

    this.userService.onUpdateError$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((responseError: ResponseError) => {
      this.alertService.error($localize `User modification failed.`, responseError.message);
      this.loading = false;
    });

    this.roleService.getRoles({});
  }

  get rf() { return this.editUserForm.controls; }
  get pf() { return this.passwordFormGroup.controls; }

  onSubmit() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.editUserForm.invalid) {
          return;
      }

      this.loading = true;

      this.user.firstName = this.rf.firstName.value;
      this.user.lastName = this.rf.lastName.value;
      this.user.systemUser = this.rf.systemUser.value;
      this.user.email = this.rf.email.value;
      this.user.roles = this.rf.roles.value;

      if (this.pf.password.value) {
        this.user.password = this.pf.password.value;
      }

      this.userService.updateUser(this.user);
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
