import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApteService {

  private apiUrl = 'http://localhost:8086/shell';

  constructor(private http: HttpClient) { }

  report(options = {}): Observable<HttpResponse<any>> {
    return this.http.get<any>(`${this.apiUrl}/report`, { ...options, observe: 'response' });
  }
  
  
  executeScript(script: string, pays: string, options = {}): Observable<HttpResponse<string>> {
    return this.http.post<string>(`${this.apiUrl}/execute`, { script, pays }, { ...options, observe: 'response' });
  }
  
}
