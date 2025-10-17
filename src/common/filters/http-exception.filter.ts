import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EncryptionService } from '../../utils/Security/Aes/Aes';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private logger = new Logger('GlobalException');
/**
 *
 */
constructor(public encryptionService: EncryptionService) {}


  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? (exception.getResponse() as any).message || exception.message
        : 'Internal server error';

    if (Array.isArray(message)) {
      message = message.join(', ');
    }
    
    // Log safely
    const stack = exception instanceof Error ? exception.stack : '';
    this.logger.error(message, stack, 'AllExceptionsFilter');

     let resStr =  JSON.stringify({
      statusCode: status,
      message,
      error: exception instanceof HttpException ? exception.name : 'Error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
    response.status(status).json( this.encryptionService.envEnc(resStr));
  }
}
