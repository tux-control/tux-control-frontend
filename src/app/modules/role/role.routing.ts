import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleComponent } from './pages/role/role.component';
import { NewComponent } from './pages/new/new.component';
import { EditComponent } from './pages/edit/edit.component';
import { AuthGuard } from '@app/core/guards/auth.guard';
import { RoleResolver } from '@app/core/resolvers/role.resolver';

export const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: '',
          component: RoleComponent,
          canActivate: [AuthGuard],
          data: {permission: ['role.edit']}
        },
        {
          path: 'new',
          component: NewComponent,
          canActivate: [AuthGuard],
          data: {permission: ['role.edit']}
        },
        {
          path: 'edit/:roleId',
          component: EditComponent,
          canActivate: [AuthGuard],
          data: {permission: ['role.edit']},
          resolve: {
            role: RoleResolver
          }
        }
      ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class RoleRoutingModule { }
