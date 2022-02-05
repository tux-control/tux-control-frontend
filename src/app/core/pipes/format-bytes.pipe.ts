import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'formatBytes'})
export class FormatBytesPipe implements PipeTransform {
  transform(bytes: number): string {
    if (bytes == 0) {
        return '0 B';
    }
    let k = 1024,
    dm = 3,
    sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
