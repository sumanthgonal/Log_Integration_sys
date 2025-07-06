import { LogEntry, LogFilters } from '../types/log';

const API_BASE_URL = 'http://localhost:3001';

class LogService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async getLogs(filters: LogFilters = {}): Promise<LogEntry[]> {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value);
      }
    });

    const queryString = queryParams.toString();
    const endpoint = `/logs${queryString ? `?${queryString}` : ''}`;
    
    return this.request<LogEntry[]>(endpoint);
  }

  async createLog(logEntry: Omit<LogEntry, 'timestamp'> & { timestamp?: string }): Promise<LogEntry> {
    return this.request<LogEntry>('/logs', {
      method: 'POST',
      body: JSON.stringify(logEntry),
    });
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

export const logService = new LogService();