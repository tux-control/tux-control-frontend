import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppValidators } from '@app/core/validators/app-validators';

import { AuthenticationService } from '@app/core/services/authentication.service';
import { UserStorageService } from '@app/core/services/user-storage.service';
import { AlertService } from '@app/core/services/alert.service';

import { User } from '@app/core/models/user';
import { ResponseError } from '@app/core/models/response-error';

@Component({
  selector: 'app-settings-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit, OnDestroy {
  private componentDestroyed$: Subject<boolean> = new Subject();
  accountForm!: FormGroup;
  passwordForm!: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  passwordFormSubmitted: boolean = false;
  passwordFormLoading: boolean = false;
  user!: User;

  isContactAddress: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    private userStorageService: UserStorageService,
    private route: ActivatedRoute
  ) { }

  checkPasswords(group: FormGroup): { [key: string]: any } | null {
    const pass = group.controls.newPassword.value;
    const repeatPassword = group.controls.repeatNewPassword.value;

    return pass === repeatPassword ? null : { notSame: true };
  }

  ngOnInit() {
    this.user = { ...<User>this.route.snapshot.data.user};

    this.accountForm = this.formBuilder.group({
      email: [this.user.email, Validators.required],
      firstName: [this.user.firstName, Validators.required],
      lastName: [this.user.lastName, [Validators.required]],
    });

    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required],
      newPassword: ['', [Validators.required, AppValidators.passwordValidator('medium')]],
      repeatNewPassword: ['', [Validators.required, AppValidators.passwordValidator('medium')]]
    }, {
        validator: this.checkPasswords
    });

    this.authenticationService.onSetCurrentUser$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((user: User) => {
        this.alertService.success($localize `Account info has been sucessfully saved.`, 'OK');
        this.loading = false;
    });

    this.authenticationService.onSetCurrentUserPassword$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((user: User) => {
      this.alertService.success($localize `Password has been sucessfully saved.`, 'OK');
      this.pf.password.reset();
      this.pf.newPassword.reset();
      this.pf.repeatNewPassword.reset();
      this.passwordFormLoading = false;
    });

    this.authenticationService.onSetCurrentUserPasswordError$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((responseError: ResponseError) => {
        this.alertService.error($localize `Failed to change password.`, responseError.message);
        this.passwordFormLoading = false;
    });
  }

  get af() { return this.accountForm.controls; }
  get pf() { return this.passwordForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.accountForm.invalid) {
      return;
    }

    this.loading = true;

    const userData = <User>{
      email: this.af.email.value,
      firstName: this.af.firstName.value,
      lastName: this.af.lastName.value
    };

    this.authenticationService.updateCurrentUser(userData);
  }

  onPasswordFormSubmit() {
    this.passwordFormSubmitted = true;

    // stop here if form is invalid
    if (this.passwordForm.invalid) {
      return;
    }

    this.passwordFormLoading = true;

    this.authenticationService.updateCurrentUserPassword(this.pf.password.value, this.pf.newPassword.value);
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
