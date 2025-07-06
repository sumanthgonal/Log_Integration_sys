import React, { useState, useEffect } from 'react';
import { LogEntry as LogEntryType, LogFilters } from '../types/log';
import { logService } from '../services/logService';
import { useDebounce } from '../hooks/useDebounce';
import LogEntry from './LogEntry';
import FilterBar from './FilterBar';
import { AlertCircle, Loader2, FileText, RefreshCw } from 'lucide-react';

const LogViewer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<LogFilters>({});
  
  // Debounce filters to avoid excessive API calls
  const debouncedFilters = useDebounce(filters, 300);

  const fetchLogs = async (currentFilters: LogFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedLogs = await logService.getLogs(currentFilters);
      setLogs(fetchedLogs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(debouncedFilters);
  }, [debouncedFilters]);

  const handleFiltersChange = (newFilters: LogFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleRefresh = () => {
    fetchLogs(filters);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center space-x-3 text-red-600 mb-4">
            <AlertCircle size={24} />
            <h2 className="text-lg font-semibold">Error Loading Logs</h2>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="text-blue-600" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Log Ingestion System</h1>
                <p className="text-gray-600">Monitor and analyze your application logs</p>
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        {/* Results Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="animate-spin" size={16} />
                    <span>Loading logs...</span>
                  </div>
                ) : (
                  `Showing ${logs.length} log${logs.length !== 1 ? 's' : ''}`
                )}
              </span>
              {logs.length > 0 && !loading && (
                <div className="flex space-x-4 text-xs">
                  {['error', 'warn', 'info', 'debug'].map(level => {
                    const count = logs.filter(log => log.level === level).length;
                    if (count === 0) return null;
                    
                    const colors = {
                      error: 'text-red-600 bg-red-50',
                      warn: 'text-amber-600 bg-amber-50',
                      info: 'text-blue-600 bg-blue-50',
                      debug: 'text-gray-600 bg-gray-50'
                    };
                    
                    return (
                      <span key={level} className={`px-2 py-1 rounded ${colors[level as keyof typeof colors]}`}>
                        {count} {level}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Log Entries */}
        <div className="space-y-0">
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <Loader2 className="animate-spin mx-auto mb-4 text-gray-400" size={32} />
              <p className="text-gray-600">Loading logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
              <FileText className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No logs found</h3>
              <p className="text-gray-600">
                {Object.values(filters).some(v => v) 
                  ? 'Try adjusting your filters to see more results.'
                  : 'No logs have been ingested yet.'}
              </p>
            </div>
          ) : (
            logs.map((log, index) => (
              <LogEntry key={`${log.traceId}-${log.spanId}-${index}`} log={log} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LogViewer;