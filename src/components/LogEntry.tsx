import React from 'react';
import { LogEntry as LogEntryType } from '../types/log';
import { formatTimestamp, formatRelativeTime } from '../utils/dateUtils';
import { AlertCircle, AlertTriangle, Info, Bug } from 'lucide-react';

interface LogEntryProps {
  log: LogEntryType;
}

const LogEntry: React.FC<LogEntryProps> = ({ log }) => {
  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'error':
        return {
          icon: AlertCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-l-red-500',
          textColor: 'text-red-700',
          badgeColor: 'bg-red-100 text-red-800',
        };
      case 'warn':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-amber-50',
          borderColor: 'border-l-amber-500',
          textColor: 'text-amber-700',
          badgeColor: 'bg-amber-100 text-amber-800',
        };
      case 'info':
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-l-blue-500',
          textColor: 'text-blue-700',
          badgeColor: 'bg-blue-100 text-blue-800',
        };
      case 'debug':
        return {
          icon: Bug,
          bgColor: 'bg-gray-50',
          borderColor: 'border-l-gray-500',
          textColor: 'text-gray-700',
          badgeColor: 'bg-gray-100 text-gray-800',
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-gray-50',
          borderColor: 'border-l-gray-500',
          textColor: 'text-gray-700',
          badgeColor: 'bg-gray-100 text-gray-800',
        };
    }
  };

  const config = getLevelConfig(log.level);
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} ${config.borderColor} border-l-4 rounded-r-lg shadow-sm hover:shadow-md transition-shadow duration-200 mb-3`}>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Icon className={`${config.textColor} mt-0.5 flex-shrink-0`} size={18} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badgeColor}`}>
                  {log.level.toUpperCase()}
                </span>
                <span className="text-sm text-gray-600 font-mono">
                  {log.resourceId}
                </span>
              </div>
              <p className="text-gray-900 text-sm leading-relaxed mb-3">
                {log.message}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600">
                <div>
                  <span className="font-medium">Trace:</span> 
                  <span className="font-mono ml-1">{log.traceId}</span>
                </div>
                <div>
                  <span className="font-medium">Span:</span> 
                  <span className="font-mono ml-1">{log.spanId}</span>
                </div>
                <div>
                  <span className="font-medium">Commit:</span> 
                  <span className="font-mono ml-1">{log.commit}</span>
                </div>
              </div>
              {log.metadata && Object.keys(log.metadata).length > 0 && (
                <details className="mt-3">
                  <summary className="text-xs text-gray-600 cursor-pointer hover:text-gray-800 transition-colors">
                    View metadata
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
          <div className="text-right text-xs text-gray-500 ml-4 flex-shrink-0">
            <div className="font-medium">{formatRelativeTime(log.timestamp)}</div>
            <div className="mt-1">{formatTimestamp(log.timestamp)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogEntry;