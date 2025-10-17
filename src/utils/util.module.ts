import { Module } from "@nestjs/common";
import { EncryptionService } from "./Security/Aes/Aes";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { EncryptionInterceptor } from "./interceptors/encryption-interceptor";

@Module({
    providers:[EncryptionService,
    {
      provide: APP_INTERCEPTOR,
      useClass: EncryptionInterceptor,
    },
    ]
})

export class UtilityModule{}