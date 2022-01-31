import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { AlertService } from '@app/core/services/alert.service';
import { Router, NavigationEnd } from '@angular/router';
import { AuthorizedUser } from '@app/core/models/authorized-user';
import { faBars, faSignOutAlt, faUser, faCog } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private componentDestroyed$: Subject<boolean> = new Subject();
  @Output() toggleMenuClick = new EventEmitter();
  userDropdownIsOpened: boolean = false;
  isLoggedIn$!: Observable<AuthorizedUser | null>;


  faBars = faBars;
  faSignOutAlt = faSignOutAlt;
  faUser = faUser;
  faCog = faCog;

  constructor(
    private authenticationService: AuthenticationService,
    private alertService: AlertService,
    private router: Router
  ) { }

  ngOnInit() {
    this.isLoggedIn$ = this.authenticationService.isLoggedIn;

    this.router.events.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((val) => {
      // Close menu on navigation change in mobile
      if (val instanceof NavigationEnd) {
          this.setUserDropdownState(false);
      }
    });
  }

  onUserDropdownClick(event: MouseEvent) {
    event.preventDefault();
    this.setUserDropdownState(null);
  }

  setUserDropdownState(open: boolean | null) {
    if (open === null) {
      this.userDropdownIsOpened = !this.userDropdownIsOpened;
    } else {
      this.userDropdownIsOpened = open;
    }
  }

  onMenuToggleClick() {
    this.toggleMenuClick.emit();
  }

  handleLogOut = (event: MouseEvent) => {
    event.preventDefault();
    this.authenticationService.logOut();
    this.alertService.success('Logged out.', 'You has been successfully logged out.');
    this.router.navigate(['/auth/sign-in']);
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
