import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApteService {

  private apiUrl = 'http://localhost:8086/shell/execute'; // Adjust the URL as needed
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
    // Start the execution and return an observable
    return new Observable(observer => {
      this.http.post<any>(this.apiUrl, { script }).subscribe({
        next: response => {
          if (response.prompt) {
            this.userInputSubject.next(response.prompt);
          } else {
            observer.next(response.output);
            observer.complete();
          }
        },
        error: err => {
          this.handleError(err).subscribe();
          observer.error(err);
        }
      });
    });
  }

  sendUserInput(input: string) {
    this.userInputSubject.next(input);
  }
}
