import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApteService {

  private apiUrl = 'http://localhost:8086/shell';
  private bugs: string[] = [];

  constructor(private http: HttpClient) { }

  getBugs(): string[] {
    return this.bugs.slice(0, 10); // Retourne les 10 derniers messages d'erreur
  }

  private handleResponse(response: string): string {
    console.log('handleResponse - response:', response);
    this.bugs.unshift(response); // Ajoute le message au début du tableau
    console.log('handleResponse - bugs after unshift:', this.bugs);
    if (this.bugs.length > 10) {
      this.bugs.pop(); // Garde seulement les 10 dernières messages
    }
    console.log('handleResponse - bugs after pop:', this.bugs);
    return response; // Retourne la réponse complète
  }
  
  executeScript(script: string, pays: string): Observable<string> {
    const params = new HttpParams()
      .set('script', script)
      .set('pays', pays);

    return this.http.post(`${this.apiUrl}/execute`, null, { params, responseType: 'text' })
      .pipe(
        map(response => this.handleResponse(response))
      );
  }

  getListePays(): Observable<string> {
    console.log('getListePays - fetching data...');
    return this.http.get(`${this.apiUrl}/liste-pays`, { responseType: 'text' })
      .pipe(
        map(response => {
          console.log('getListePays - response:', response);
          return this.handleResponse(response);
        })
      );
  }
}
