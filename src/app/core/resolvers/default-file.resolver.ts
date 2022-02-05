import { Injectable } from '@angular/core';
import { Router, Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { FileInfo } from '../models/file-info';
import { FileService } from '../services/file.service';


@Injectable({
  providedIn: 'root'
})
export class DefaultFileResolver implements Resolve<any> {

  constructor(
    private fileService: FileService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot) {
    return new Promise((resolve, reject) => {
      this.fileService.onGetDefault$.pipe(
        first()
      ).subscribe((fileInfo: FileInfo) => {
        resolve(fileInfo);
      });
      this.fileService.getDefaultFile();
    });
  }
}
