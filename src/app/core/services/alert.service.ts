import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(
    private router: Router,
    private messageService: MessageService) {
    // clear alert message on route change
    this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
            if (this.keepAfterNavigationChange) {
                // only keep for a single location change
                this.keepAfterNavigationChange = false;
            } else {
                // clear alert
                this.subject.next();
            }
        }
    });
  }

  success(message: string, description: string): void {
      /*this.keepAfterNavigationChange = keepAfterNavigationChange;
      this.subject.next({ type: 'success', text: message });*/
      this.messageService.add({severity: 'success', summary: message, detail: description});
  }

  error(message: string, description: string): void {
      /*this.keepAfterNavigationChange = keepAfterNavigationChange;
      this.subject.next({ type: 'error', text: message });*/
      this.messageService.add({severity: 'error', summary: message, detail: description});
  }

  warning(message: string, description: string): void {
      /*this.keepAfterNavigationChange = keepAfterNavigationChange;
      this.subject.next({ type: 'error', text: message });*/
      this.messageService.add({severity: 'warn', summary: message, detail: description});
  }

  info(message: string, description: string): void {
      /*this.keepAfterNavigationChange = keepAfterNavigationChange;
      this.subject.next({ type: 'error', text: message });*/
      this.messageService.add({severity: 'info', summary: message, detail: description});
  }

  getMessage(): Observable<any> {
      return this.subject.asObservable();
  }
}
