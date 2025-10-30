type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  timestamp: Date
  level: LogLevel
  message: string
  data?: any
  userId?: string
  sessionId?: string
}

class Logger {
  private logs: LogEntry[] = []
  private maxLogs = 1000
  private isDevelopment = process.env.NODE_ENV === 'development'

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date(),
      level,
      message,
      data,
      userId: this.getUserId(),
      sessionId: this.getSessionId()
    }
  }

  private getUserId(): string | undefined {
    // In a real app, get from auth context or localStorage
    return localStorage.getItem('userId') || undefined
  }

  private getSessionId(): string | undefined {
    // Generate or retrieve session ID
    let sessionId = localStorage.getItem('sessionId')
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('sessionId', sessionId)
    }
    return sessionId
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift() // Remove oldest log
    }

    // In development, also log to console
    if (this.isDevelopment) {
      const color = this.getLogColor(entry.level)
      console.log(`%c[${entry.level.toUpperCase()}] ${entry.message}`, `color: ${color}`, entry.data || '')
    }

    // Send to external logging service in production
    if (!this.isDevelopment) {
      this.sendToExternalService(entry)
    }
  }

  private getLogColor(level: LogLevel): string {
    switch (level) {
      case 'debug': return '#6b7280'
      case 'info': return '#3b82f6'
      case 'warn': return '#f59e0b'
      case 'error': return '#ef4444'
      default: return '#000000'
    }
  }

  private async sendToExternalService(entry: LogEntry) {
    try {
      // In a real app, send to logging service like LogRocket, Sentry, etc.
      // For now, just store locally
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]')
      logs.push(entry)
      localStorage.setItem('app_logs', JSON.stringify(logs.slice(-100))) // Keep last 100 logs
    } catch (error) {
      console.error('Failed to send log to external service:', error)
    }
  }

  debug(message: string, data?: any) {
    this.addLog(this.createLogEntry('debug', message, data))
  }

  info(message: string, data?: any) {
    this.addLog(this.createLogEntry('info', message, data))
  }

  warn(message: string, data?: any) {
    this.addLog(this.createLogEntry('warn', message, data))
  }

  error(message: string, data?: any) {
    this.addLog(this.createLogEntry('error', message, data))
  }

  // Performance logging
  time(label: string) {
    console.time(label)
    this.debug(`Started timing: ${label}`)
  }

  timeEnd(label: string) {
    console.timeEnd(label)
    this.debug(`Ended timing: ${label}`)
  }

  // User action logging
  logUserAction(action: string, details?: any) {
    this.info(`User Action: ${action}`, details)
  }

  // Error boundary logging
  logError(error: Error, errorInfo?: any) {
    this.error(`Application Error: ${error.message}`, {
      stack: error.stack,
      ...errorInfo
    })
  }

  // API call logging
  logApiCall(endpoint: string, method: string, status: number, duration: number, data?: any) {
    const level = status >= 400 ? 'error' : status >= 300 ? 'warn' : 'info'
    this[level](`API Call: ${method} ${endpoint}`, {
      status,
      duration: `${duration}ms`,
      ...data
    })
  }

  // Get logs for debugging
  getLogs(level?: LogLevel, limit = 50): LogEntry[] {
    let filteredLogs = this.logs
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level)
    }
    return filteredLogs.slice(-limit)
  }

  // Export logs
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }

  // Clear logs
  clearLogs() {
    this.logs = []
    localStorage.removeItem('app_logs')
  }
}

// Singleton instance
export const logger = new Logger()
export default logger