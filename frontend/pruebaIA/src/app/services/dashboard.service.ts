import { Injectable } from '@angular/core';
import { ApiService, JournalEntry } from './api.service';
import { Observable, map, catchError, of } from 'rxjs';

export interface DashboardData {
  total_users: number;
  total_entries: number;
  avg_sentiment_score: number;
  entries_last_week: number;
  sentiment_distribution: {
    sentiment: string;
    count: number;
    percentage: number;
  }[];
  top_emotions: {
    emotion: string;
    count: number;
  }[];
  users_stats: {
    user_id: string;
    entries_count: number;
    dominant_sentiment: string;
    dominant_emotion: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private apiService: ApiService) {}

  getDashboardData(): Observable<DashboardData> {
    return this.apiService.getDashboard().pipe(
      map(backendData => {
        console.log('Datos del backend:', backendData);
        return this.normalizeDashboardData(backendData);
      }),
      catchError(error => {
        console.error('Error fetching dashboard data:', error);
        return of(this.getDefaultDashboardData());
      })
    );
  }

  private normalizeDashboardData(data: any): DashboardData {
    // Asegurarse de que los arrays existan
    const normalizedData: DashboardData = {
      total_users: data.total_users || 0,
      total_entries: data.total_entries || 0,
      avg_sentiment_score: data.avg_sentiment_score || 0.5,
      entries_last_week: data.entries_last_week || 0,
      sentiment_distribution: this.ensureSentimentArray(data.sentiment_distribution),
      top_emotions: this.ensureEmotionArray(data.top_emotions || data.emotion_distribution),
      users_stats: this.ensureArray(data.users_stats)
    };

    console.log('Datos normalizados:', normalizedData);
    return normalizedData;
  }

  private ensureSentimentArray(value: any): any[] {
    if (Array.isArray(value)) return value;
    
    if (value && typeof value === 'object') {
      // Convertir objeto {pos: 5, neu: 3, neg: 2} a array
      return Object.entries(value).map(([sentiment, count]) => ({
        sentiment,
        count: count as number,
        percentage: 0 // Se calculará después si es necesario
      }));
    }
    
    return [];
  }

  private ensureEmotionArray(value: any): any[] {
    if (Array.isArray(value)) return value;
    
    if (value && typeof value === 'object') {
      // Convertir objeto {joy: 5, sadness: 3} a array
      return Object.entries(value).map(([emotion, count]) => ({
        emotion,
        count: count as number
      }));
    }
    
    return [];
  }

  private ensureArray(value: any): any[] {
    if (Array.isArray(value)) return value;
    return [];
  }

  getDefaultDashboardData(): DashboardData {
    return {
      total_users: 1,
      total_entries: 0,
      avg_sentiment_score: 0.5,
      entries_last_week: 0,
      sentiment_distribution: [],
      top_emotions: [],
      users_stats: []
    };
  }
  // Añade este método al DashboardService para debugging
  getRawData(): Observable<any> {
    return this.apiService.getDashboard().pipe(
      catchError(error => {
        console.error('Error getting raw data:', error);
        return of(null);
      })
    );
  }
}