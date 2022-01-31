import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { PluginConfigItem } from '../models/plugin-config-item';
import { PluginConfigItemService } from '../services/plugin-config-item.service';


@Injectable({
  providedIn: 'root'
})
export class PluginConfigItemResolver implements Resolve<any> {
  constructor(
    private pluginConfigItemService: PluginConfigItemService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    const pluginKey = route.paramMap.get('pluginKey');
    const pluginConfigItemKey = route.paramMap.get('pluginConfigItemKey');
    if (pluginConfigItemKey === null || pluginKey === null) {
      this.router.navigate(['/error/404']);
      return of(null);
    }

    return new Promise((resolve, reject) => {
      this.pluginConfigItemService.onGet$.pipe(
        first()
      ).subscribe((pluginConfigItem: PluginConfigItem) => {
        resolve(pluginConfigItem);
      });
      this.pluginConfigItemService.getPluginConfigItem(pluginConfigItemKey, pluginKey);
    });
  }
}
