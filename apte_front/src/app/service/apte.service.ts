import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApteService {

  private apiUrl = 'http://localhost:8086/shell';

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
    return this.http.post<string>(`${this.apiUrl}/script`, { script })
      .pipe(
        catchError(this.handleError.bind(this)),
        switchMap(response => {
          return this.pollForPrompt();
        })
      );
  }

  pollForPrompt(): Observable<string> {
    return new Observable<string>(observer => {
      const intervalId = setInterval(() => {
        this.getPrompt().subscribe(
          prompt => {
            if (prompt) {
              observer.next(prompt);
              clearInterval(intervalId);
            }
          },
          error => observer.error(error)
        );
      }, 1000); // Interroge le backend toutes les secondes

      return () => clearInterval(intervalId);
    });
  }

  getPrompt(): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/prompt`)
      .pipe(catchError(this.handleError.bind(this)));
  }

  sendResponse(response: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/script`, { response })
      .pipe(
        catchError(this.handleError.bind(this)),
        switchMap(() => {
          return this.pollForPrompt();
        })
      );
  }
}
