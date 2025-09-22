import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-journal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './journal.component.html',
  styleUrls: ['./journal.component.scss']
})
export class JournalComponent implements OnInit, AfterViewChecked {
  messageText: string = '';
  isLoading: boolean = false;
  entries: any[] = []; // Cambiamos el tipo para agrupar user+AI
  userId: string = 'user123';
  errorMessage: string = '';
  successMessage: string = '';
  
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    // Agregar mensaje de bienvenida inicial
    this.entries = [{
      type: 'ai',
      text: '¡Hola! Soy tu asistente de diario emocional. Puedes contarme cómo te sientes hoy, qué pensamientos tienes o cualquier cosa que quieras compartir. Estoy aquí para ayudarte.',
      timestamp: new Date(),
      isWelcome: true
    }];
    
    this.loadEntries();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  sendMessage() {
    if (!this.messageText.trim() || this.isLoading) return;

    const userMessage = this.messageText;
    this.messageText = '';
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Agregar mensaje de usuario inmediatamente
    this.entries.push({
      type: 'user',
      text: userMessage,
      timestamp: new Date(),
      isTemp: true // Marcar como temporal hasta tener respuesta
    });

    this.scrollToBottom();

    this.apiService.createEntry({
      text: userMessage,
      user_id: this.userId
    }).subscribe({
      next: (response) => {
        // Reemplazar el mensaje temporal con el real
        const tempIndex = this.entries.findIndex(entry => entry.isTemp);
        if (tempIndex !== -1) {
          this.entries.splice(tempIndex, 1);
        }

        // Agregar entrada del usuario
        this.entries.push({
          type: 'user',
          text: response.text,
          timestamp: new Date(response.created_at),
          sentiment: response.sentiment_analysis,
          originalData: response
        });

        // Agregar respuesta de IA
        this.entries.push({
          type: 'ai',
          text: response.ai_feedback,
          timestamp: new Date(), // Usar fecha actual para la respuesta
          sentiment: response.sentiment_analysis,
          originalData: response
        });

        this.isLoading = false;
        this.successMessage = '¡Mensaje enviado!';
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error enviando mensaje:', error);
        
        // Eliminar mensaje temporal en caso de error
        const tempIndex = this.entries.findIndex(entry => entry.isTemp);
        if (tempIndex !== -1) {
          this.entries.splice(tempIndex, 1);
        }
        
        this.errorMessage = 'Error al enviar el mensaje. Intenta nuevamente.';
        this.isLoading = false;
        this.messageText = userMessage; // Restaurar el mensaje
      }
    });
  }

  loadEntries() {
    this.apiService.getUserEntries(this.userId).subscribe({
      next: (entries) => {
        // Procesar entradas para convertirlas en formato de chat
        const chatEntries: any[] = [];
        
        entries.forEach(entry => {
          // Mensaje del usuario
          chatEntries.push({
            type: 'user',
            text: entry.text,
            timestamp: new Date(entry.created_at),
            sentiment: entry.sentiment_analysis,
            originalData: entry
          });
          
          // Respuesta de IA
          chatEntries.push({
            type: 'ai',
            text: entry.ai_feedback,
            timestamp: new Date(entry.created_at),
            sentiment: entry.sentiment_analysis,
            originalData: entry
          });
        });
        
        // Agregar al historial (después del mensaje de bienvenida)
        this.entries = [...this.entries, ...chatEntries];
      },
      error: (error) => {
        console.error('Error cargando mensajes:', error);
        this.errorMessage = 'Error al cargar el historial.';
      }
    });
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  formatDate(date: Date): string {
    const today = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === today.toDateString()) {
      return 'Hoy';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    }
    
    return messageDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
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