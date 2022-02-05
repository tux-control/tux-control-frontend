import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'shortText'})
export class ShortTextPipe implements PipeTransform {
  transform(text: string, len: number = 15): string {
    return text.substr(0, len) + (text.length > len ? '&hellip;' : '');
  }
}
