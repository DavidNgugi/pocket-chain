export interface LoggerConfig {
    enabled: boolean;
    level: 'debug' | 'info' | 'warn' | 'error' | 'none';
}

class Logger {
    private config: LoggerConfig = {
        enabled: true,
        level: 'info'
    };

    setConfig(config: Partial<LoggerConfig>): void {
        this.config = { ...this.config, ...config };
    }

    getConfig(): LoggerConfig {
        return { ...this.config };
    }

    private shouldLog(level: string): boolean {
        if (!this.config.enabled) return false;

        const levels = ['debug', 'info', 'warn', 'error', 'none'];
        const configLevelIndex = levels.indexOf(this.config.level);
        const messageLevelIndex = levels.indexOf(level);

        return messageLevelIndex >= 0 && messageLevelIndex >= configLevelIndex;
    }

    debug(...args: any[]): void {
        if (this.shouldLog('debug')) {
            console.log('[DEBUG]', ...args);
        }
    }

    info(...args: any[]): void {
        if (this.shouldLog('info')) {
            console.log('[INFO]', ...args);
        }
    }

    warn(...args: any[]): void {
        if (this.shouldLog('warn')) {
            console.warn('[WARN]', ...args);
        }
    }

    error(...args: any[]): void {
        if (this.shouldLog('error')) {
            console.error('[ERROR]', ...args);
        }
    }
}

export const logger = new Logger();
