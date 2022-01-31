import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { Plugin } from '../models/plugin';
import { PluginService } from '../services/plugin.service';


@Injectable({
  providedIn: 'root'
})
export class PluginResolver implements Resolve<any> {
  constructor(
    private pluginService: PluginService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    const pluginKey = route.paramMap.get('pluginKey');
    if (pluginKey === null) {
      this.router.navigate(['/error/404']);
      return of(null);
    }

    return new Promise((resolve, reject) => {
      this.pluginService.onGet$.pipe(
        first()
      ).subscribe((plugin: Plugin) => {
        resolve(plugin);
      });
      this.pluginService.getPlugin(pluginKey);
  });
  }
}
