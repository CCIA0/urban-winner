import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private baseUrl = '/api/v1'; // Ruta relativa para el proxy

  constructor(private http: HttpClient) {}

  createEntry(entry: CreateEntryRequest): Observable<JournalEntry> {
    return this.http.post<JournalEntry>(`${this.baseUrl}/journal/entries`, entry);
  }

  getUserEntries(userId: string): Observable<JournalEntry[]> {
    return this.http.get<JournalEntry[]>(`${this.baseUrl}/journal/entries/${userId}`);
  }

  getDashboard(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/dashboard`);
  }
}