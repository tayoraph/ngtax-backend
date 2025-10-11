import { Global, Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class LoggerService implements OnModuleInit {
  private logStream: fs.WriteStream;

  onModuleInit() {
    this.logStream = fs.createWriteStream('startup.log', { flags: 'a' });
    this.log(`[${new Date().toISOString()}] LoggerService initialized`);
  }

  log(message: string) {
    if (!this.logStream) {
      this.logStream = fs.createWriteStream('startup.log', { flags: 'a' });
    }
    this.logStream.write(`${message}\n`);
  }
}
