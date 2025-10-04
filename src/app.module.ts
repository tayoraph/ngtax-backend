import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TaxModule } from './tax/tax.module';
import { UsersModule } from './users/user.module';
import { FileLogger } from './common/logger/file-logger.service';
import { LoggerModule } from './common/logger/logger.module';
import { AppConfigModule } from './config/config.module';
import { MongoDBConfig } from './config/db.config';
 const url = "mongodb+srv://tayoraph_elor_tax_user:sb7t1AhDPTS3UGKd@taxcalculator.anrgx74.mongodb.net/";
@Module({
  imports: [
    AppConfigModule, // Import global config
    //MongooseModule.forRoot(url),
    MongooseModule.forRootAsync(MongoDBConfig),
    LoggerModule, // import global module **once** here
    AuthModule,
    TaxModule,
    
  ],
  providers: [
    {
      provide: Logger,
      useClass: FileLogger, // Use custom file logger globally
    },
  ],
})
export class AppModule {}