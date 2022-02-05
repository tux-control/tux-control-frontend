import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { FileInfo } from '../models/file-info';
import { FileService } from '../services/file.service';


@Injectable({
  providedIn: 'root'
})
export class FileResolver implements Resolve<any> {

  constructor(
    private fileService: FileService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    const path = route.paramMap.get('path');
    if (path === null) {
      this.router.navigate(['/error/404']);
      return of(null);
    }

    console.log(path);

    return new Promise((resolve, reject) => {
      this.fileService.onGet$.pipe(
        first()
      ).subscribe((fileInfo: FileInfo) => {
        resolve(fileInfo);
      });
      this.fileService.getFile(path);
    });
  }
}
