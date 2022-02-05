import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

import { fas, faHome, faHeart, faUsers, faCog, faFileArchive } from '@fortawesome/free-solid-svg-icons';
import { icon, library, IconName, Icon } from '@fortawesome/fontawesome-svg-core';
import { AuthorizedUser } from '@app/core/models/authorized-user';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { PluginService } from '@app/core/services/plugin.service';
import { MenuItem } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
import { Plugin } from '@app/core/models/plugin';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss']
})
export class ContentLayoutComponent implements OnInit, OnDestroy {
  private componentDestroyed$: Subject<boolean> = new Subject();
  isLoggedIn$!: Observable<AuthorizedUser | null>;
  isMobile: boolean = window.innerWidth < 1024;
  sideBarIsOpened: boolean = !this.isMobile;

  menuItems!: MenuItem[];

  faHome = faHome;
  faHeart = faHeart;
  faUsers = faUsers;
  faCog = faCog;
  faFileArchive = faFileArchive;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private pluginService: PluginService
  ) {}

  setSidebarState(open: boolean | null) {
    if (open === null) {
      this.sideBarIsOpened = !this.sideBarIsOpened;
    } else {
      this.sideBarIsOpened = open;
    }
  }

  ngOnInit() {
    library.add(fas);
    this.isLoggedIn$ = this.authenticationService.isLoggedIn;
    this.router.events.subscribe((val) => {
      // Close menu on navigation change in mobile
      if (val instanceof NavigationEnd && this.isMobile) {
          this.setSidebarState(false);
      }
    });

    this.pluginService.onListAll$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((plugins: Plugin[]) => {
      this.menuItems = plugins.map((plugin: Plugin) => {
        return {
          label: plugin.name,
          routerLink: ['/plugin', plugin.key],
          icon: plugin.icon
        }
      });
    });

    this.pluginService.getPlugins();
  }

  iconStringToIcon(iconName: string): Icon {
    return icon({ prefix: 'fas', iconName: iconName as IconName });
  }

  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
