type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';

  private format(level: LogLevel, message: string, meta?: Record<string, unknown>) {
    const timestamp = new Date().toISOString();

    if (this.isProduction) {
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...meta,
      });
    }

    const colors: Record<LogLevel, string> = {
      DEBUG: '\x1b[36m', // Cyan
      INFO: '\x1b[32m', // Green
      WARN: '\x1b[33m', // Yellow
      ERROR: '\x1b[31m', // Red
    };
    const reset = '\x1b[0m';
    const color = colors[level] || reset;

    const metaStr = meta ? ` | meta: ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${color}${level}${reset}: ${message}${metaStr}`;
  }

  public debug(message: string, meta?: Record<string, unknown>) {
    if (!this.isProduction || process.env.DEBUG === 'true') {
      console.debug(this.format('DEBUG', message, meta));
    }
  }

  public info(message: string, meta?: Record<string, unknown>) {
    console.info(this.format('INFO', message, meta));
  }

  public warn(message: string, meta?: Record<string, unknown>) {
    console.warn(this.format('WARN', message, meta));
  }

  public error(message: string, error?: Error | unknown, meta?: Record<string, unknown>) {
    const errorDetails =
      error instanceof Error
        ? { errorName: error.name, errorMessage: error.message, errorStack: error.stack }
        : { rawError: error };

    console.error(
      this.format('ERROR', message, { ...errorDetails, ...meta } as Record<string, unknown>),
    );
  }
}

export const logger = new Logger();
export default logger;
