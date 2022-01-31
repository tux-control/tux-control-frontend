import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'gravatar'})
export class GravatarPipe implements PipeTransform {
  transform(emailMd5?: string): string {
    return `https://www.gravatar.com/avatar/${emailMd5}?d=identicon`;
  }
}
