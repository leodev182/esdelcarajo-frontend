import * as Sentry from "@sentry/nextjs";

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
    // En producción, enviar a Sentry como breadcrumb
    Sentry.addBreadcrumb({
      category: "info",
      message: String(args[0]),
      level: "info",
    });
  }

  warn(...args: unknown[]): void {
    if (this.shouldLog()) {
      console.warn("[WARN]", ...args);
    }
    // Enviar warning a Sentry
    Sentry.captureMessage(String(args[0]), "warning");
  }

  error(...args: unknown[]): void {
    if (this.shouldLog()) {
      console.error("[ERROR]", ...args);
    }
    // Siempre enviar errores a Sentry
    const error = args[0];
    if (error instanceof Error) {
      Sentry.captureException(error);
    } else {
      Sentry.captureMessage(String(error), "error");
    }
  }

  debug(...args: unknown[]): void {
    if (this.shouldLog()) {
      console.debug("[DEBUG]", ...args);
    }
  }

  /**
   * Log agrupado
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
