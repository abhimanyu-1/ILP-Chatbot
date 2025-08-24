// Chat service for API communication
const API_BASE_URL = 'http://localhost:5000/api';

export interface ChatRequest {
  message: string;
  isAnonymous?: boolean;
}

export interface ChatResponse {
  success: boolean;
  message: string;
  priority?: 'urgent' | 'high' | 'medium' | 'low';
  category?: string;
  error?: string;
}

export interface StatsResponse {
  totalQueries: number;
  resolvedQueries: number;
  avgResponseTime: number;
  uptime: string;
  satisfaction: number;
  categories: Record<string, number>;
  priorities: Record<string, number>;
}

export class ChatService {
  static async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Chat service error:', error);
      return {
        success: false,
        message: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  static async getStats(): Promise<StatsResponse | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Stats service error:', error);
      return null;
    }
  }

  static async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check error:', error);
      return false;
    }
  }
}