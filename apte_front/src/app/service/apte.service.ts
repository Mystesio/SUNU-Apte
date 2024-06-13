import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApteService {

  private apiUrl = 'http://localhost:8086/shell'; // Adjust the URL as needed
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
    return this.http.post(`${this.apiUrl}/execute`, { script, input: '' }, { responseType: 'text' });
  }

  getPrompt(): Observable<string> {
    return this.http.get(`${this.apiUrl}/prompt`, { responseType: 'text' });
  }

  sendResponse(response: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/response`, response);
  }
}
