/**
 * Logger liviano para el frontend
 *
 * - En desarrollo: muestra logs en consola
 * - En producción: silencioso (cero overhead)
 * - Preparado para integración con Sentry
 */

type LogLevel = "log" | "info" | "warn" | "error" | "debug";

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  private shouldLog(): boolean {
    return this.isDevelopment;
  }

  log(...args: unknown[]): void {
    if (this.shouldLog()) {
      console.log("[LOG]", ...args);
    }
  }

  info(...args: unknown[]): void {
    if (this.shouldLog()) {
      console.info("[INFO]", ...args);
    }
  }

  warn(...args: unknown[]): void {
    if (this.shouldLog()) {
      console.warn("[WARN]", ...args);
    }
  }

  error(...args: unknown[]): void {
    if (this.shouldLog()) {
      console.error("[ERROR]", ...args);
    }
    // TODO: Cuando integremos Sentry, agregar:
    // Sentry.captureException(args[0]);
  }

  debug(...args: unknown[]): void {
    if (this.shouldLog()) {
      console.debug("[DEBUG]", ...args);
    }
  }

  /**
   * Log agrupado (útil para objetos complejos)
   */
  group(label: string, data: unknown): void {
    if (this.shouldLog()) {
      console.group(label);
      console.log(data);
      console.groupEnd();
    }
  }
}

export const logger = new Logger();
