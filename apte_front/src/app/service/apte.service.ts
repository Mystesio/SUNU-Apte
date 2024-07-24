import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApteService {

  private apiUrl = 'http://localhost:8086/shell';

  private errors: string[] = [];

  constructor(private http: HttpClient) { }

  getErrors(): string[] {
    return this.errors.slice(0, 10); // Retourne les 10 derniers messages d'erreur
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Une erreur inconnue est survenue !';

    if (typeof error.error === 'string') {
      errorMessage = error.error;
    }

    // Ajouter l'erreur au tableau d'erreurs
    this.errors.unshift(errorMessage); // Ajoute l'erreur au début du tableau
    if (this.errors.length > 10) {
      this.errors.pop(); // Garde seulement les 10 dernières erreurs
    }

    return throwError(errorMessage);
  }

  executeScript(script: string, pays: string): Observable<string> {
    const params = new HttpParams()
      .set('script', script)
      .set('pays', pays);

    return this.http.post(`${this.apiUrl}/execute`, null, { params, responseType: 'text' })
      .pipe(catchError(this.handleError.bind(this)));
  }

  getListePays(): Observable<string> {
    return this.http.get(`${this.apiUrl}/liste-pays`, { responseType: 'text' })
      .pipe(catchError(this.handleError.bind(this)));
  }
}
