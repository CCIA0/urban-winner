export interface JournalEntry {
  id: number;
  text: string;
  user_id: string;
  sentiment_analysis: {
    sentiment: {
      label: string;
      probabilities: {
        NEG: number;
        NEU: number;
        POS: number;
      };
    };
    emotion: {
      label: string;
      probabilities: {
        others: number;
        joy: number;
        sadness: number;
        anger: number;
        surprise: number;
        disgust: number;
        fear: number;
      };
    };
  };
  ai_feedback: string;
  created_at: string;
}

export interface CreateJournalEntryRequest {
  text: string;
  user_id: string;
}

export interface SentimentAnalysis {
  sentiment: {
    label: 'POS' | 'NEG' | 'NEU';
    probabilities: {
      NEG: number;
      NEU: number;
      POS: number;
    };
  };
  emotion: {
    label: string;
    probabilities: {
      others: number;
      joy: number;
      sadness: number;
      anger: number;
      surprise: number;
      disgust: number;
      fear: number;
    };
  };
}

export interface DashboardData {
  total_entries: number;
  sentiment_distribution: {
    POS: number;
    NEG: number;
    NEU: number;
  };
  emotion_distribution: {
    joy: number;
    sadness: number;
    anger: number;
    surprise: number;
    disgust: number;
    fear: number;
    others: number;
  };
  recent_activity: JournalEntry[];
}