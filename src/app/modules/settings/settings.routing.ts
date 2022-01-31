import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountComponent } from './pages/account/account.component';
import { CurrentUserResolver } from '@app/core/resolvers/current-user.resolver';

export const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: 'account',
          component: AccountComponent,
          resolve: {
            user: CurrentUserResolver
          }
        }
      ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }
