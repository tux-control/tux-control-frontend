import { Routes } from '@angular/router';

export const CONTENT_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () => import('../../modules/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'plugin',
    loadChildren: () => import('../../modules/plugin/plugin.module').then(m => m.PluginModule)
  },
  {
    path: 'settings',
    loadChildren: () => import('../../modules/settings/settings.module').then(m => m.SettingsModule)
  },
  {
    path: 'user',
    loadChildren: () => import('../../modules/user/user.module').then(m => m.UserModule)
  },
  {
    path: 'role',
    loadChildren: () => import('../../modules/role/role.module').then(m => m.RoleModule)
  }
];
