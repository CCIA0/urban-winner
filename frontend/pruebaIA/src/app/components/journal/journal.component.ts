import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, JournalEntry } from '../../services/api.service';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit {
  entryText: string = '';
  isLoading: boolean = false;
  entries: JournalEntry[] = [];
  userId: string = 'estudiante_1';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadEntries();
  }

  submitEntry() {
    if (!this.entryText.trim() || this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.apiService.createEntry({
      text: this.entryText,
      user_id: this.userId
    }).subscribe({
      next: (response) => {
        this.entries.unshift(response);
        this.entryText = '';
        this.isLoading = false;
        this.successMessage = '¡Entrada guardada exitosamente!';
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error creando entrada:', error);
        this.errorMessage = 'Error al enviar la entrada. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  loadEntries() {
    this.apiService.getUserEntries(this.userId).subscribe({
      next: (entries) => {
        this.entries = entries;
      },
      error: (error) => {
        console.error('Error cargando entradas:', error);
        this.errorMessage = 'Error al cargar las entradas.';
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleString('es-ES');
  }

  getSentimentColor(sentiment: string): string {
    switch (sentiment.toLowerCase()) {
      case 'pos': return '#4caf50'; // Verde
      case 'neg': return '#f44336'; // Rojo
      case 'neu': return '#ff9800'; // Naranja
      default: return '#9e9e9e'; // Gris
    }
  }

  getEmotionIcon(emotion: string): string {
    switch (emotion.toLowerCase()) {
      case 'joy': return '😊';
      case 'sadness': return '😢';
      case 'anger': return '😠';
      case 'fear': return '😨';
      case 'surprise': return '😲';
      case 'disgust': return '🤢';
      default: return '😐';
    }
  }
}