import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOGS_FILE_PATH = path.join(__dirname, '../data/logs.json');

class LogService {
  async ensureDataFile() {
    try {
      await fs.access(LOGS_FILE_PATH);
    } catch (error) {
      // File doesn't exist, create it with empty array
      await fs.writeFile(LOGS_FILE_PATH, JSON.stringify([], null, 2));
    }
  }

  async readLogs() {
    await this.ensureDataFile();
    try {
      const data = await fs.readFile(LOGS_FILE_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading logs file:', error);
      return [];
    }
  }

  async writeLogs(logs) {
    try {
      await fs.writeFile(LOGS_FILE_PATH, JSON.stringify(logs, null, 2));
    } catch (error) {
      console.error('Error writing logs file:', error);
      throw new Error('Failed to persist log data');
    }
  }

  async createLog(logData) {
    const logs = await this.readLogs();
    
    // Add timestamp if not provided
    if (!logData.timestamp) {
      logData.timestamp = new Date().toISOString();
    }

    logs.push(logData);
    await this.writeLogs(logs);
    
    return logData;
  }

  async getLogs(filters = {}) {
    const logs = await this.readLogs();
    let filteredLogs = [...logs];

    // Apply filters
    if (filters.level) {
      filteredLogs = filteredLogs.filter(log => 
        log.level.toLowerCase() === filters.level.toLowerCase()
      );
    }

    if (filters.message) {
      const searchTerm = filters.message.toLowerCase();
      filteredLogs = filteredLogs.filter(log =>
        log.message.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.resourceId) {
      filteredLogs = filteredLogs.filter(log =>
        log.resourceId.toLowerCase().includes(filters.resourceId.toLowerCase())
      );
    }

    if (filters.traceId) {
      filteredLogs = filteredLogs.filter(log =>
        log.traceId.toLowerCase().includes(filters.traceId.toLowerCase())
      );
    }

    if (filters.spanId) {
      filteredLogs = filteredLogs.filter(log =>
        log.spanId.toLowerCase().includes(filters.spanId.toLowerCase())
      );
    }

    if (filters.commit) {
      filteredLogs = filteredLogs.filter(log =>
        log.commit.toLowerCase().includes(filters.commit.toLowerCase())
      );
    }

    if (filters.timestamp_start) {
      const startDate = new Date(filters.timestamp_start);
      filteredLogs = filteredLogs.filter(log =>
        new Date(log.timestamp) >= startDate
      );
    }

    if (filters.timestamp_end) {
      const endDate = new Date(filters.timestamp_end);
      filteredLogs = filteredLogs.filter(log =>
        new Date(log.timestamp) <= endDate
      );
    }

    // Sort by timestamp in reverse chronological order (most recent first)
    filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return filteredLogs;
  }
}

export default new LogService();