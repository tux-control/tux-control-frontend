import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
  selector: 'app-user-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit, OnDestroy {
  private componentDestroyed$: Subject<boolean> = new Subject();
  newUserForm!: FormGroup;
  passwordFormGroup!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;

  roles!: Role[];

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private userService: UserService,
    private roleService: RoleService,
    private router: Router
  ) { }

  checkPasswords(group: FormGroup): { [key: string]: any } | null {
    const pass = group.controls.password.value;
    const repeatPassword = group.controls.repeatPassword.value;

    return pass === repeatPassword ? null : { notSame: true };
  }

  ngOnInit() {
    this.passwordFormGroup = this.formBuilder.group({
      password: ['', [Validators.required, AppValidators.passwordValidator('medium')]],
      repeatPassword: ['', [Validators.required, AppValidators.passwordValidator('medium')]]
    }, {
        validator: this.checkPasswords
      });

    this.newUserForm = this.formBuilder.group({
      email: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', [Validators.required]],
      systemUser: ['', Validators.required],
      roles: ['', Validators.required],

      passwordFormGroup: this.passwordFormGroup
    });

    this.roleService.onListAll$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((pagedResultRoles: PagedResult<Role>) => {
      this.roles = pagedResultRoles.data;
    });

    this.userService.onCreate$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((user: User) => {
      this.alertService.success($localize `User has been sucessfully added.`, 'OK');
      this.loading = false;

      // Reset form values
      this.rf.firstName.reset();
      this.rf.lastName.reset();
      this.rf.systemUser.reset();
      this.rf.email.reset();
      this.rf.roles.reset();

      this.pf.password.reset();
      this.pf.repeatPassword.reset();

      
      this.router.navigate(['/user']);
    });

    this.userService.onCreateError$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((responseError: ResponseError) => {
      this.alertService.error($localize `User addition failed.`, responseError.message);
      this.loading = false;
    });


    this.roleService.getRoles({});
  }

  get rf() { return this.newUserForm.controls; }
  get pf() { return this.passwordFormGroup.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.newUserForm.invalid) {
      return;
    }

    this.loading = true;

    const userData = <User>{
      firstName: this.rf.firstName.value,
      lastName: this.rf.lastName.value,
      systemUser: this.rf.systemUser.value,
      email: this.rf.email.value,
      password: this.pf.password.value,
      roles: this.rf.roles.value
    };

    this.userService.addUser(userData);
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}

