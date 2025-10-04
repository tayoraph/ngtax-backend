import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileLogger implements LoggerService {
  private logFilePath = path.join(__dirname, '../../../logs/app.log');

  private writeToFile(message: string) {
    fs.mkdirSync(path.dirname(this.logFilePath), { recursive: true });
    fs.appendFileSync(this.logFilePath, message + '\n', { encoding: 'utf8' });
  }

  log(message: any, context?: string) {
    const logMessage = `[LOG] [${new Date().toISOString()}]${context ? ' [' + context + ']' : ''} ${message}`;
    console.log(logMessage);
    this.writeToFile(logMessage);
  }

  error(message: any, trace?: string, context?: string) {
    const errorMessage = `[ERROR] [${new Date().toISOString()}]${context ? ' [' + context + ']' : ''} ${message} ${trace || ''}`;
    console.error(errorMessage);
    this.writeToFile(errorMessage);
  }

  warn(message: any, context?: string) {
    const warnMessage = `[WARN] [${new Date().toISOString()}]${context ? ' [' + context + ']' : ''} ${message}`;
    console.warn(warnMessage);
    this.writeToFile(warnMessage);
  }

  debug(message: any, context?: string) {
    const debugMessage = `[DEBUG] [${new Date().toISOString()}]${context ? ' [' + context + ']' : ''} ${message}`;
    console.debug(debugMessage);
    this.writeToFile(debugMessage);
  }

  verbose(message: any, context?: string) {
    const verboseMessage = `[VERBOSE] [${new Date().toISOString()}]${context ? ' [' + context + ']' : ''} ${message}`;
    console.log(verboseMessage);
    this.writeToFile(verboseMessage);
  }
}
