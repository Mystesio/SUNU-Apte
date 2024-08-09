import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pays } from 'app/model/pays.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PaysService {

  private apiUrl = 'http://localhost:8086/pays';


  constructor(private http: HttpClient) { }

  getListePays(): Observable<Pays[]> {
    return this.http.get<Pays[]>(`${this.apiUrl}/update`);
  }
}
 