const VALID_LOG_LEVELS = ['error', 'warn', 'info', 'debug'];

function validateLogEntry(logData) {
  const errors = [];

  if (!logData || typeof logData !== 'object') {
    return { isValid: false, errors: ['Request body must be a valid JSON object'] };
  }

  // Required fields validation
  const requiredFields = ['level', 'message', 'resourceId', 'timestamp', 'traceId', 'spanId', 'commit', 'metadata'];
  
  for (const field of requiredFields) {
    if (!logData.hasOwnProperty(field)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  // Level validation
  if (logData.level && !VALID_LOG_LEVELS.includes(logData.level)) {
    errors.push(`Invalid level. Must be one of: ${VALID_LOG_LEVELS.join(', ')}`);
  }

  // String field validation
  const stringFields = ['level', 'message', 'resourceId', 'traceId', 'spanId', 'commit'];
  for (const field of stringFields) {
    if (logData[field] && typeof logData[field] !== 'string') {
      errors.push(`Field '${field}' must be a string`);
    }
  }

  // Timestamp validation
  if (logData.timestamp) {
    const timestamp = new Date(logData.timestamp);
    if (isNaN(timestamp.getTime())) {
      errors.push('Invalid timestamp format. Must be a valid ISO 8601 string');
    }
  }

  // Metadata validation
  if (logData.metadata && typeof logData.metadata !== 'object') {
    errors.push('Metadata must be an object');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

function validateQueryParams(query) {
  const errors = [];

  // Validate level if provided
  if (query.level && !VALID_LOG_LEVELS.includes(query.level)) {
    errors.push(`Invalid level filter. Must be one of: ${VALID_LOG_LEVELS.join(', ')}`);
  }

  // Validate timestamp filters
  if (query.timestamp_start) {
    const startDate = new Date(query.timestamp_start);
    if (isNaN(startDate.getTime())) {
      errors.push('Invalid timestamp_start format. Must be a valid ISO 8601 string');
    }
  }

  if (query.timestamp_end) {
    const endDate = new Date(query.timestamp_end);
    if (isNaN(endDate.getTime())) {
      errors.push('Invalid timestamp_end format. Must be a valid ISO 8601 string');
    }
  }

  // Validate date range
  if (query.timestamp_start && query.timestamp_end) {
    const startDate = new Date(query.timestamp_start);
    const endDate = new Date(query.timestamp_end);
    if (startDate > endDate) {
      errors.push('timestamp_start must be before timestamp_end');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export {
  validateLogEntry,
  validateQueryParams,
  VALID_LOG_LEVELS
};