import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Config } from '../models/config';
import { ApiService } from './api.service';


@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private configUrl: string;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {
    this.configUrl = this.apiService.baseUrl + '/config';
  }

  getConfig(): Observable<Config> {
    return this.http.get<Config>(this.configUrl, this.httpOptions);
  }
}
