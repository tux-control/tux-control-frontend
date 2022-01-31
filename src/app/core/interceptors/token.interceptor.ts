import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse, HttpProgressEvent,
  HttpResponse, HttpUserEvent, HttpErrorResponse, HttpEvent, HttpParams
} from '@angular/common/http';
import { AuthenticationService } from '../services/authentication.service';
import { UserStorageService } from '@app/core/services/user-storage.service';
import { ApiService } from '../services/api.service';


const TOKEN_HEADER_KEY = 'Authorization';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
  regexIso8601 = /^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)$/;
  constructor(
    private authenticationService: AuthenticationService,
    private userStorageService: UserStorageService,
    private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    // Add auth header
    if (this.userStorageService.getAccessToken() != null && !request.headers.get(TOKEN_HEADER_KEY)) {
      request = request.clone({
        headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + this.userStorageService.getAccessToken()),
      });
    }

    request = request.clone({
      headers: request.headers.set('TimeZone', Intl.DateTimeFormat().resolvedOptions().timeZone),
    });

    // Convert body and parameters from cameCase to snake_case
    let parameters:{[key: string]: any} = {};
    for (const parameterName of request.params.keys()) {
      parameters[parameterName] = request.params.get(parameterName);
    }

    let httpParams = new HttpParams();
    parameters = ApiService.createConverterFunction(ApiService.camelCaseToSnakeCase)(parameters);
    for (const convertedParameterName of Object.keys(parameters)) {
      const convertedParameterValue = parameters[convertedParameterName];
      httpParams = httpParams.set(convertedParameterName, convertedParameterValue);
    }

    request = request.clone({
      body: ApiService.createConverterFunction(ApiService.camelCaseToSnakeCase)(request.body),
      params: httpParams,
    });

    // proceed
    return next.handle(request).pipe(
      map((response: HttpEvent<any>) => {
        // Convert snake_case to camelCase
        if (response instanceof HttpResponse) {
          this.convertDateStringsToDates(response.body);
          response = response.clone({
            body: ApiService.createConverterFunction(ApiService.snakeCaseToCamelCase)(response.body)
          });
        }
        return response;
      }),
      catchError((err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            this.authenticationService.logOut();
            this.router.navigate(['/auth/sign-in']);
          }
        }

        return throwError(err);
      }));
  }



  convertDateStringsToDates(input: any) {
      // Ignore things that aren't objects.
      if (typeof input !== 'object') {
        return input;
      }

      for (const key in input) {

          if (!input.hasOwnProperty(key)) { continue; }

          const value = input[key];
          let match;
          // Check for string properties which look like dates.
          if (typeof value === 'string' && (match = value.match(this.regexIso8601))) {
              const milliseconds = Date.parse(value);
              if (!isNaN(milliseconds)) {
                  input[key] = new Date(milliseconds);
              }
          } else if (typeof value === 'object') {
              // Recurse into object
              this.convertDateStringsToDates(value);
          }
      }
  }
}
