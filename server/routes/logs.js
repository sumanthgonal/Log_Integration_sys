import express from 'express';
import logService from '../services/logService.js';
import { validateLogEntry, validateQueryParams } from '../utils/validation.js';

const router = express.Router();

// POST /logs - Ingest a single log entry
router.post('/', async (req, res) => {
  try {
    const validation = validateLogEntry(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validation.errors
      });
    }

    const logEntry = await logService.createLog(req.body);
    res.status(201).json(logEntry);
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create log entry'
    });
  }
});

// GET /logs - Retrieve and filter log entries
router.get('/', async (req, res) => {
  try {
    const validation = validateQueryParams(req.query);
    if (!validation.isValid) {
      return res.status(400).json({
        error: 'Invalid query parameters',
        details: validation.errors
      });
    }

    const logs = await logService.getLogs(req.query);
    res.status(200).json(logs);
  } catch (error) {
    console.error('Error retrieving logs:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve logs'
    });
  }
});

export default router;