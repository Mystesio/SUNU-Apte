import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApteService {

  private apiUrl = 'http://localhost:8086/shell';

  constructor(private http: HttpClient) { }
  
  executeScript(script: string, pays: string, options = {}): Observable<HttpResponse<{ output?: string; error?: string }>> {
    return this.http.post<{ output?: string; error?: string }>(`${this.apiUrl}/execute`, { script, pays }, { ...options, observe: 'response' });
  }
}
