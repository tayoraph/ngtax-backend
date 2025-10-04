import { Module, Global } from '@nestjs/common';
import { FileLogger } from './file-logger.service';

@Global() // optional: makes it globally available
@Module({
  providers: [FileLogger],
  exports: [FileLogger],
})
export class LoggerModule {}
