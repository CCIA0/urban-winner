import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface JournalEntry {
  id: number;
  text: string;
  user_id: string;
  sentiment_analysis: {
    sentiment: {
      label: string;
      probabilities: any;
    };
    emotion: {
      label: string;
      probabilities: any;
    };
  };
  ai_feedback: string;
  created_at: string;
}

export interface CreateEntryRequest {
  text: string;
  user_id: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    
    console.error('Error en API Service:', errorMessage);
    return throwError(() => errorMessage);
  }

  createEntry(entry: CreateEntryRequest): Observable<JournalEntry> {
    return this.http.post<JournalEntry>(`${this.baseUrl}/journal/entries`, entry)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getUserEntries(userId: string): Observable<JournalEntry[]> {
    return this.http.get<JournalEntry[]>(`${this.baseUrl}/journal/entries/${userId}`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getDashboard(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/dashboard`)
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }
}