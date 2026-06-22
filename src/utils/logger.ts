/**
 * Logger Utility
 * Provides structured logging for the application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  error?: any;
  userId?: string;
  organizationId?: string;
  sessionId?: string;
}

class Logger {
  private isDevelopment: boolean;
  private logLevel: LogLevel;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: Record<LogLevel, number> = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3,
    };
    return levels[level] >= levels[this.logLevel];
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: any,
    error?: any
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(data && { data }),
      ...(error && { error: this.serializeError(error) }),
    };
  }

  private serializeError(error: any): any {
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
      };
    }
    return error;
  }

  private formatConsoleOutput(entry: LogEntry): void {
    const { timestamp, level, message, data, error } = entry;
    
    if (this.isDevelopment) {
      // Pretty format for development
      const colors = {
        debug: '\x1b[36m', // Cyan
        info: '\x1b[32m',  // Green  
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m', // Red
        reset: '\x1b[0m',
      };

      const color = colors[level] || colors.reset;
      const prefix = `${color}[${level.toUpperCase()}]${colors.reset}`;
      const timeStr = new Date(timestamp).toLocaleTimeString();
      
      console.log(`${prefix} ${timeStr} ${message}`);
      
      if (data) {
        console.log('Data:', data);
      }
      
      if (error) {
        console.error('Error:', error);
      }
    } else {
      // JSON format for production
      console.log(JSON.stringify(entry));
    }
  }

  debug(message: string, data?: any): void {
    if (!this.shouldLog('debug')) return;
    
    const entry = this.createLogEntry('debug', message, data);
    this.formatConsoleOutput(entry);
  }

  info(message: string, data?: any): void {
    if (!this.shouldLog('info')) return;
    
    const entry = this.createLogEntry('info', message, data);
    this.formatConsoleOutput(entry);
  }

  warn(message: string, data?: any): void {
    if (!this.shouldLog('warn')) return;
    
    const entry = this.createLogEntry('warn', message, data);
    this.formatConsoleOutput(entry);
  }

  error(message: string, error?: any, data?: any): void {
    if (!this.shouldLog('error')) return;
    
    const entry = this.createLogEntry('error', message, data, error);
    this.formatConsoleOutput(entry);
  }

  // Structured logging methods for specific contexts
  auth(level: LogLevel, message: string, data?: any): void {
    if (!this.shouldLog(level)) return;
    
    const entry = this.createLogEntry(level, `[AUTH] ${message}`, {
      ...data,
      context: 'authentication',
    });
    this.formatConsoleOutput(entry);
  }

  api(level: LogLevel, message: string, data?: any): void {
    if (!this.shouldLog(level)) return;
    
    const entry = this.createLogEntry(level, `[API] ${message}`, {
      ...data,
      context: 'api',
    });
    this.formatConsoleOutput(entry);
  }

  security(level: LogLevel, message: string, data?: any): void {
    if (!this.shouldLog(level)) return;
    
    const entry = this.createLogEntry(level, `[SECURITY] ${message}`, {
      ...data,
      context: 'security',
    });
    this.formatConsoleOutput(entry);
  }

  workflow(level: LogLevel, message: string, data?: any): void {
    if (!this.shouldLog(level)) return;
    
    const entry = this.createLogEntry(level, `[WORKFLOW] ${message}`, {
      ...data,
      context: 'workflow',
    });
    this.formatConsoleOutput(entry);
  }

  // Performance logging
  time(label: string): void {
    if (this.isDevelopment) {
      console.time(label);
    }
  }

  timeEnd(label: string): void {
    if (this.isDevelopment) {
      console.timeEnd(label);
    }
  }
}

// Create singleton logger instance
export const logger = new Logger();

// Export logger types for use in other modules
export type { LogLevel, LogEntry };

// Context-aware logging utilities
export const createContextLogger = (context: {
  userId?: string;
  organizationId?: string;
  sessionId?: string;
}) => {
  return {
    debug: (message: string, data?: any) =>
      logger.debug(message, { ...data, ...context }),
    info: (message: string, data?: any) =>
      logger.info(message, { ...data, ...context }),
    warn: (message: string, data?: any) =>
      logger.warn(message, { ...data, ...context }),
    error: (message: string, error?: any, data?: any) =>
      logger.error(message, error, { ...data, ...context }),
  };
};

// Request logging middleware helper
export const requestLogger = (
  method: string,
  url: string,
  statusCode: number,
  duration: number,
  userId?: string
) => {
  const level: LogLevel = statusCode >= 400 ? 'error' : statusCode >= 300 ? 'warn' : 'info';
  
  logger.api(level, `${method} ${url} ${statusCode}`, {
    method,
    url,
    statusCode,
    duration,
    userId,
  });
};

// Performance measurement helper
export const measurePerformance = async <T>(
  operation: () => Promise<T>,
  operationName: string,
  context?: any
): Promise<T> => {
  const start = Date.now();
  
  try {
    const result = await operation();
    const duration = Date.now() - start;
    
    logger.info(`Performance: ${operationName} completed`, {
      operationName,
      duration,
      success: true,
      ...context,
    });
    
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    
    logger.error(`Performance: ${operationName} failed`, error, {
      operationName,
      duration,
      success: false,
      ...context,
    });
    
    throw error;
  }
};