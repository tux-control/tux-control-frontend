import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PluginResolver } from '@app/core/resolvers/plugin.resolver';
import { PluginConfigItemResolver } from '@app/core/resolvers/plugin-config-item.resolver';
import { PluginComponent } from './pages/plugin/plugin.component';
import { EditComponent } from './pages/edit/edit.component';
import { NewComponent } from './pages/new/new.component';

export const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: ':pluginKey',
          component: PluginComponent,
          resolve: {
            plugin: PluginResolver
          }
        },
        {
          path: ':pluginKey/add',
          component: NewComponent,
          resolve: {
            plugin: PluginResolver
          }
        },
        {
          path: ':pluginKey/edit/:pluginConfigItemKey',
          component: EditComponent,
          resolve: {
            plugin: PluginResolver,
            pluginConfigItem: PluginConfigItemResolver,
          }
        }
      ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PluginRoutingModule { }
