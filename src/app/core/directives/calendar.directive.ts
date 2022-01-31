import { Directive, Host } from '@angular/core';
import { Calendar } from 'primeng/calendar';

@Directive({
  selector: '[appCalendarLocale]'
})
export class CalendarLocaleDirective {
  locale = {
    firstDayOfWeek: 1,
    dayNames: ['neděle', 'pondělí', 'úterý', 'středa', 'čtvrtek', 'pátek', 'sobota'],
    dayNamesShort: ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'],
    dayNamesMin: ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'],
    monthNames: ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'],
    monthNamesShort: ['led', 'úno', 'bře', 'dub', 'kvě', 'čvn', 'čvc', 'srp', 'zář', 'říj', 'lis', 'pro'],
    today: 'Dnes',
    clear: 'Reset'
  };

  constructor(@Host() private pCalendar: Calendar) {
    pCalendar.locale = this.locale;
  }
}
