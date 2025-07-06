import React from 'react';
import { LogFilters } from '../types/log';
import { Search, Filter, Calendar, Server, GitCommit, Zap } from 'lucide-react';
import { toISODateTimeLocal } from '../utils/dateUtils';

interface FilterBarProps {
  filters: LogFilters;
  onFiltersChange: (filters: LogFilters) => void;
  onClearFilters: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFiltersChange, onClearFilters }) => {
  const handleFilterChange = (key: keyof LogFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined,
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== '');

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="text-gray-600" size={20} />
          <h2 className="text-lg font-semibold text-gray-900">Filter Logs</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Message Search */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Search className="inline mr-1" size={14} />
            Search Message
          </label>
          <input
            type="text"
            value={filters.message || ''}
            onChange={(e) => handleFilterChange('message', e.target.value)}
            placeholder="Search in messages..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Level Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Zap className="inline mr-1" size={14} />
            Log Level
          </label>
          <select
            value={filters.level || ''}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All levels</option>
            <option value="error">Error</option>
            <option value="warn">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
        </div>

        {/* Resource ID */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Server className="inline mr-1" size={14} />
            Resource ID
          </label>
          <input
            type="text"
            value={filters.resourceId || ''}
            onChange={(e) => handleFilterChange('resourceId', e.target.value)}
            placeholder="Filter by resource..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Trace ID */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <GitCommit className="inline mr-1" size={14} />
            Trace ID
          </label>
          <input
            type="text"
            value={filters.traceId || ''}
            onChange={(e) => handleFilterChange('traceId', e.target.value)}
            placeholder="Filter by trace..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Date Range Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Calendar className="inline mr-1" size={14} />
            Start Date & Time
          </label>
          <input
            type="datetime-local"
            value={filters.timestamp_start || ''}
            onChange={(e) => handleFilterChange('timestamp_start', e.target.value ? new Date(e.target.value).toISOString() : '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            <Calendar className="inline mr-1" size={14} />
            End Date & Time
          </label>
          <input
            type="datetime-local"
            value={filters.timestamp_end || ''}
            onChange={(e) => handleFilterChange('timestamp_end', e.target.value ? new Date(e.target.value).toISOString() : '')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Quick Date Filters */}
      <div className="flex flex-wrap gap-2 mt-4">
        <span className="text-sm text-gray-600">Quick filters:</span>
        <button
          onClick={() => {
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
            onFiltersChange({
              ...filters,
              timestamp_start: oneHourAgo.toISOString(),
              timestamp_end: now.toISOString(),
            });
          }}
          className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          Last hour
        </button>
        <button
          onClick={() => {
            const now = new Date();
            const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            onFiltersChange({
              ...filters,
              timestamp_start: oneDayAgo.toISOString(),
              timestamp_end: now.toISOString(),
            });
          }}
          className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          Last 24h
        </button>
        <button
          onClick={() => {
            const now = new Date();
            const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            onFiltersChange({
              ...filters,
              timestamp_start: oneWeekAgo.toISOString(),
              timestamp_end: now.toISOString(),
            });
          }}
          className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          Last week
        </button>
      </div>
    </div>
  );
};

export default FilterBar;