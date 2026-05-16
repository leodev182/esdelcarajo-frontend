import * as Sentry from "@sentry/nextjs";

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
    Sentry.addBreadcrumb({
      category: "warning",
      message: String(args[0]),
      level: "warning",
    });
  }

  error(
    message: string,
    data?: unknown,
    options?: { expected?: boolean }
  ): void {
    if (this.shouldLog()) {
      console.error("[ERROR]", message, data);
    }

    if (options?.expected) {
      Sentry.addBreadcrumb({
        category: "error.expected",
        message,
        level: "warning",
      });
      return;
    }

    if (data instanceof Error) {
      Sentry.captureException(data);
    } else {
      Sentry.captureMessage(message, "error");
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
