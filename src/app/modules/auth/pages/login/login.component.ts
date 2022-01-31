import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { AlertService } from '@app/core/services/alert.service';
import { takeUntil } from 'rxjs/operators';
import { faLock, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private componentDestroyed$: Subject<boolean> = new Subject();
  loginForm!: FormGroup;
  loadingLogin: boolean = false;
  submitted: boolean = false;
  enableRegisterButton: boolean = false;
  private returnUrl!: string;

  faLock = faLock;
  faUser = faUser;


  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private alertService: AlertService) { }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    this.authenticationService.onLogin$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe(data => {
            this.alertService.success('Přihášen.', 'Byli jste úspěšně přihlášeni do aplikace.');
            this.router.navigate([this.returnUrl]);
    });

    this.authenticationService.onLoginError$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe(
        data => {
            this.alertService.error('Přihlášení selhalo.', data.message);
            this.loadingLogin = false;
        });

    this.loginForm = this.formBuilder.group({
        email: ['', Validators.required],
        password: ['', Validators.required]
    });

    // reset login status
    this.authenticationService.logOut();
  }

  get fl() { return this.loginForm.controls; }

  onSubmitLogin() {
      this.submitted = true;

      // stop here if form is invalid
      if (this.loginForm.invalid) {
          return;
      }

      this.loadingLogin = true;
      this.authenticationService.login(this.fl.email.value, this.fl.password.value);
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
