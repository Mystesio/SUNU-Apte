import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApteService {

  private apiUrl = 'http://localhost:8086/shell'; // Ajuster l'URL si nécessaire
  private errors: string[] = [];
  private userInputSubject = new Subject<string>();
  userInput$ = this.userInputSubject.asObservable();

  constructor(private http: HttpClient) { }

  getErrors(): string[] {
    return this.errors.slice(0, 10); // Retourne les 10 derniers messages d'erreur
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage = error.error instanceof ErrorEvent ? 
      `An error occurred: ${error.error.message}` : 
      `Backend returned code ${error.status}, body was: ${error.error}`;
    
    this.errors.unshift(errorMessage); // Ajoute l'erreur au début du tableau
    return throwError(errorMessage);
  }

  executeScript(script: string): Observable<string> {
    // Commencez par exécuter le script
    return this.http.post(`${this.apiUrl}/execute`, { script }, { responseType: 'text' })
      .pipe(
        catchError(this.handleError.bind(this)),
        switchMap(response => {
          // Après l'exécution du script, attendez les prompts
          return this.getPrompt();
        })
      );
  }

  getPrompt(): Observable<string> {
    return this.http.get(`${this.apiUrl}/execute`, { responseType: 'text' })
      .pipe(catchError(this.handleError.bind(this)));
  }

  sendResponse(response: string): Observable<string> {
    // Envoyez la réponse et attendez le prochain prompt ou la fin de l'exécution
    return this.http.post(`${this.apiUrl}/execute`, { response }, { responseType: 'text' })
      .pipe(
        catchError(this.handleError.bind(this)),
        switchMap(resp => {
          // Après avoir envoyé la réponse, attendez le prochain prompt
          return this.getPrompt();
        })
      );
  }
}

