import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './pages/user/user.component';
import { NewComponent } from './pages/new/new.component';
import { EditComponent } from './pages/edit/edit.component';
import { AuthGuard } from '@app/core/guards/auth.guard';
import { UserResolver } from '@app/core/resolvers/user.resolver';

export const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: '',
          component: UserComponent,
          canActivate: [AuthGuard],
          data: {permission: ['user.edit']}
        },
        {
          path: 'new',
          component: NewComponent,
          canActivate: [AuthGuard],
          data: {permission: ['user.edit']}
        },
        {
          path: 'edit/:userId',
          component: EditComponent,
          canActivate: [AuthGuard],
          data: {permission: ['user.edit']},
          resolve: {
            user: UserResolver
          }
        }
      ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
