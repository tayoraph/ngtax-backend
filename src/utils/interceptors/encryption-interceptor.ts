
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { EncryptionService } from '../Security/Aes/Aes';

@Injectable()
export class EncryptionInterceptor implements NestInterceptor {
    /**
     *
     */
    constructor(private enc: EncryptionService) {
        
    }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    //decrypting request from client
    // console.log("request body to be decrypted",request.body)
    if(request.body.param !== undefined)
    request.body = JSON.parse(this.enc.envDecrpt(request.body.param))

     return next.handle().pipe(
      // Transform or decrypt response if needed
      map((value) => {
        try {
          let encValue =  this.enc.envEnc(JSON.stringify(value))
            return {param:encValue}

        } catch (err) {
          console.error('Error in map():', err);
          let encValue =  this.enc.envEnc(JSON.stringify(err))
          return encValue; 
        }
      }),
    );
  }
}