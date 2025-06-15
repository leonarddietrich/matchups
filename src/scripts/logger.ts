export class Logger {
  private loggerName: string;

  constructor(name: string) {
    this.loggerName = name;
  }

  private getTime(): string {
    const now = new Date();
    return now.toISOString().replace("T", " ").replace("Z", "");
  }

  info(...args: any): void {
    console.info(`[INFO] [${this.getTime()}] [${this.loggerName}]:\t`, ...args);
  }

  warn(...args: any): void {
    console.warn(`[WARN] [${this.getTime()}] [${this.loggerName}]:\t`, ...args);
  }

  error(...args: any): void {
    console.error(`[ERROR] [${this.getTime()}] [${this.loggerName}]:\t`, ...args);
  }

  debug(...args: any): void {
    console.debug(`[DEBUG] [${this.getTime()}] [${this.loggerName}]:\t`, ...args);
  }
}
