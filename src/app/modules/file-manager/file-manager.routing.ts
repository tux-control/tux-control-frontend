import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FileManagerComponent } from './pages/file/file-manager.component';
import { AuthGuard } from '@app/core/guards/auth.guard';
import { FileResolver } from '@app/core/resolvers/file.resolver';
import { DefaultFileResolver } from '@app/core/resolvers/default-file.resolver';

export const routes: Routes = [
    {
      path: '',
      children: [
        {
          path: '',
          component: FileManagerComponent,
          canActivate: [AuthGuard],
          data: {permission: ['file.read']},
          resolve: {
            fileInfo: DefaultFileResolver
          }
        },
        {
          path: ':path',
          component: FileManagerComponent,
          canActivate: [AuthGuard],
          data: {permission: ['file.read']},
          resolve: {
            fileInfo: FileResolver
          }
        },
      ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FileManagerRoutingModule { }
